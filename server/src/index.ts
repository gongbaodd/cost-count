import { createSchema, createYoga } from "graphql-yoga"
import jwt from "@tsndr/cloudflare-worker-jwt"
import { GraphQLError } from "graphql";

export interface Env {
	kv: KVNamespace;
	SINING_KEY: string;
	request: Request;
}

interface Record {
	id: string;
	name: string;
	price: number;
	type: string;
	date: number;
}

interface Category {
	id: string;
	name: string;
}

interface User {
	id: string;
	email: string;
	hash: string;
}

const yoga = createYoga({
	schema: createSchema({
		typeDefs: `#graphql
			type Record {
				id: ID!
				name: String!
				price: Float!
				type: String!
				date: Float!
			}
			type Category {
				id: ID!
				name: String!
			}
			type User {
				id: ID!
				email: String!
				token: String!
			}
			type Query {
				records: [Record]
				record(id: String!): Record
				categories: [Category]
			}
			type Mutation {
				addCategory(name: String!): Category
				addRecord(name: String!, price: Float!, type: ID!, date: Int): Record
				mutRecord(id: ID!, name: String, price: Float, type: ID, date: Int): Record
				delRecord(id: ID!): Record
				register(email: String!, password: String!): User
				login(email: String!, password: String!): User
			}
		`,
		resolvers: {
			Record: {
				type: async (record: Record, _args, ctx: Env) => {
					const { id } = await getToken(ctx)

					const categories = await ctx.kv.get('categories-' + id, 'json') as Category[] ?? [];
					return categories.find(category => category.id === record.type)?.name ?? 'idle';
				}
			},
			Query: {
				records: allRecords,
				record: async (_src, { id }: { id: string }, ctx: Env) => {
					const records = await allRecords(_src, {}, ctx)
					return records.find(record => record.id === id);
				},
				categories: allCategories,
			},
			Mutation: {
				addCategory: async (_src, { name }: { name: string }, ctx: Env) => {
					const user = await getToken(ctx)
					await findUser(user, ctx);

					const key = 'categories-' + user.id;

					const categories = await ctx.kv.get(key, 'json') as Category[] ?? [];
					const id = crypto.randomUUID()
					categories.push({ id, name });
					await ctx.kv.put(key, JSON.stringify(categories));
					return { id, name };
				},
				addRecord: async (_src, { name, price, type, date }: { name: string, price: number, type: string, date: number }, ctx: Env) => {
					const user = await getToken(ctx)
					await findUser(user, ctx);

					const key = 'records-' + user.id;

					const records = await ctx.kv.get(key, 'json') as Record[] ?? [];
					const id = crypto.randomUUID();
					records.push({ id, name, price, type, date: date ?? +Date.now() });
					await ctx.kv.put(key, JSON.stringify(records));
					return { id, name, price, type, date };
				},
				mutRecord: async (_src, { id, name, price, type, date }: { id: string, name?: string, price?: number, type?: string, date?: number }, ctx: Env) => {
					const user = await getToken(ctx)
					await findUser(user, ctx);

					const key = 'records-' + user.id;


					const records = await ctx.kv.get(key, 'json') as Record[] ?? [];
					const record = records.find(record => record.id === id);
					if (!record) {
						throw new GraphQLError('Record not found');
					}
					if (name) {
						record.name = name;
					}
					if (price) {
						record.price = price;
					}
					if (type) {
						record.type = type;
					}
					if (date) {
						record.date = date;
					}
					await ctx.kv.put(key, JSON.stringify(records));
					return record;
				},
				delRecord: async (_src, { id }: { id: string }, ctx: Env) => {
					const user = await getToken(ctx)
					await findUser(user, ctx);

					const key = 'records-' + user.id;

					const records = await ctx.kv.get(key, 'json') as Record[] ?? [];
					const record = records.find(record => record.id === id);
					if (!record) {
						throw new GraphQLError('Record not found');
					}
					await ctx.kv.put(key + user.id, JSON.stringify(records.filter(record => record.id !== id)));
					return record;
				},
				register: async (_src, { email, password }: { email: string, password: string }, ctx: Env) => {
					const key = 'users';
					const users = await ctx.kv.get(key, 'json') as User[] ?? [];

					if (!email || !password) {
						throw new GraphQLError('Email and password required');
					}

					if (users.find(user => user.email === email)) {
						throw new GraphQLError('User already exists');
					}
					const id = crypto.randomUUID();
					const token = jwt.sign({ id }, ctx.SINING_KEY);
					const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
					const hash = btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));

					users.push({ id, email, hash });
					await ctx.kv.put(key, JSON.stringify(users));
					return { id, email, token };
				},
				login: async (_src, { email, password }: { email: string, password: string }, ctx: Env) => {
					const key = 'users';
					
					const users = await ctx.kv.get(key, 'json') as User[] ?? [];
					const user = users.find(user => user.email === email);
					if (!user) {
						throw new GraphQLError('User not found');
					}
					const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
					const hash = btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));
					if (hash !== user.hash) {
						throw new GraphQLError('Password incorrect');
					}
					const token = jwt.sign({ id: user.id }, ctx.SINING_KEY);
					return { id: user.id, email, token };
				}
			},
		},
	}),
	graphiql: true,
})

export default {
	fetch: yoga.fetch,
};

async function getToken(ctx: Env) {
	const authorization = ctx.request.headers.get("authorization")
	if (!authorization) {
		throw new GraphQLError('Authorization required');
	}

	const token = authorization.split(" ")[1];
	const isValid = await jwt.verify(token, ctx.SINING_KEY);
	if (!isValid) {
		throw new GraphQLError('Invalid token');
	}

	const { payload } = jwt.decode(token);
	return payload as { id: string };
}

async function findUser({ id }: { id: string }, ctx: Env) {
	const users = await ctx.kv.get('users', 'json') as User[] ?? [];
	const user = users.find(user => user.id === id);

	if (!user) {
		throw new GraphQLError("Invalid user");
	}

	return user
}

async function allRecords(_src: any, _args: any, ctx: Env) {
	const { id } = await getToken(ctx)
	await findUser({ id }, ctx);

	const records = await ctx.kv.get('records-' + id, 'json') as Record[] ?? [];
	return records;
}

async function allCategories(_src: any, _args: any, ctx: Env) {
	const { id } = await getToken(ctx)
	await findUser({ id }, ctx);

	const categories = await ctx.kv.get('categories-' + id, 'json') as Category[] ?? [];
	return categories;
}