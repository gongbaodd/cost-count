import { createSchema, createYoga } from "graphql-yoga"
import jwt from "@tsndr/cloudflare-worker-jwt"
import { useJWT } from "@graphql-yoga/plugin-jwt"

export interface Env {
	kv: KVNamespace;
	SINING_KEY: string;
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
					const categories = await ctx.kv.get('categories', 'json') as Category[] ?? [];
					return categories.find(category => category.id === record.type)?.name ?? 'idle';
				}
			},
			Query: {
				records: async (_src, _args, ctx: Env) => {
					const records = await ctx.kv.get('records', 'json') as Record[] ?? [];
					return records;
				},
				record: async (_src, { id }: { id: string }, ctx: Env) => {
					const records = await ctx.kv.get('records', 'json') as Record[] ?? [];
					return records.find(record => record.id === id);
				},
				categories: async (_src, _args, ctx: Env) => {
					const categories = await ctx.kv.get('categories', 'json') as Category[] ?? [];
					return categories;
				},
			},
			Mutation: {
				addCategory: async (_src, { name }: { name: string }, ctx: Env) => {
					const categories = await ctx.kv.get('categories', 'json') as Category[] ?? [];
					const id = crypto.randomUUID()
					categories.push({ id, name });
					await ctx.kv.put('categories', JSON.stringify(categories));
					return { id, name };
				},
				addRecord: async (_src, { name, price, type, date }: { name: string, price: number, type: string, date: number }, ctx: Env) => {
					const records = await ctx.kv.get('records', 'json') as Record[] ?? [];
					const id = crypto.randomUUID();
					records.push({ id, name, price, type, date: date ?? +Date.now()});
					await ctx.kv.put('records', JSON.stringify(records));
					return { id, name, price, type, date };
				},
				mutRecord: async (_src, { id, name, price, type, date }: { id: string, name?: string, price?: number, type?: string, date?: number }, ctx: Env) => {
					const records = await ctx.kv.get('records', 'json') as Record[] ?? [];
					const record = records.find(record => record.id === id);
					if (!record) {
						throw new Error('Record not found');
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
					await ctx.kv.put('records', JSON.stringify(records));
					return record;
				},
				delRecord: async (_src, { id }: { id: string }, ctx: Env) => {
					const records = await ctx.kv.get('records', 'json') as Record[] ?? [];
					const record = records.find(record => record.id === id);
					if (!record) {
						throw new Error('Record not found');
					}
					await ctx.kv.put('records', JSON.stringify(records.filter(record => record.id !== id)));
					return record;
				},
				register: async (_src, { email, password }: { email: string, password: string }, ctx: Env) => {
					const users = await ctx.kv.get('users', 'json') as User[] ?? [];
					if (users.find(user => user.email === email)) {
						throw new Error('User already exists');
					}
					const id = crypto.randomUUID();
					const token = jwt.sign({ id }, ctx.SINING_KEY);
					const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
					const hash = btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));
					
					users.push({ id, email, hash });
					await ctx.kv.put('users', JSON.stringify(users));
					return { id, email, token };
				}
			},
		},
	}),
	graphiql: true,
})

export default {
	fetch: yoga.fetch,
};
