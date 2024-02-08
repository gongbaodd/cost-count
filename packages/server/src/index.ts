import { createSchema, createYoga } from 'graphql-yoga';
import {
	UUIDDefinition,
	UUIDResolver,
	TimestampTypeDefinition,
	TimestampResolver,
	EmailAddressTypeDefinition,
	EmailAddressResolver,
} from 'graphql-scalars';
import { Env } from './types';
import { login, register } from './services/user';
import { Category, createCategory, getCategories } from './models/category';
import { Record, createRecord, deleteRecord, findRecordById, getRecords, updateRecord } from './models/record';

const schema = createSchema({
	typeDefs: `#graphql
		${UUIDDefinition}
		${TimestampTypeDefinition}
		${EmailAddressTypeDefinition}
		type Record {
			id: UUID!
			name: String!
			price: Float!
			type: String!
			date: Timestamp!
		}
		type Category {
			id: UUID!
			name: String!
		}
		type User {
			id: UUID!
			email: EmailAddress!
			token: String!
		}
		type Query {
			records: [Record]
			record(id: String!): Record
			categories: [Category]
		}
		type Mutation {
			addCategory(name: String!): Category
			addRecord(name: String!, price: Float!, type: UUID!, date: Timestamp): Record
			mutRecord(id: UUID!, name: String, price: Float, type: UUID, date: Timestamp): Record
			delRecord(id: UUID!): Record
			register(email: EmailAddress!, password: String!): User
			login(email: EmailAddress!, password: String!): User
		}
	`,
	resolvers: {
		UUID: UUIDResolver,
		Timestamp: TimestampResolver,
		EmailAddress: EmailAddressResolver,
		Record: {
			type: async (record: Record, _args, ctx: Env) => {
				const categories = await getCategories(ctx);
				return categories.find((category) => category.id === record.type)?.name ?? 'idle';
			},
		},
		Query: {
			records: async (_src, _args, ctx) => await getRecords(ctx),
			record: async (_src, { id }: Pick<Record, 'id'>, ctx: Env) => await findRecordById(ctx, id),
			categories: async (_src, _args, ctx) => await getCategories(ctx),
		},
		Mutation: {
			addCategory: async (_src, { name }: Omit<Category, 'id'>, ctx: Env) => await createCategory(ctx, name),
			addRecord: async (_src, args: Omit<Record, 'id'>, ctx: Env) => await createRecord(ctx, args),
			mutRecord: async (_src, args: Partial<Record> & Pick<Record, 'id'>, ctx: Env) => await updateRecord(ctx, args.id, args),
			delRecord: async (_src, { id }: Pick<Record, 'id'>, ctx: Env) => await deleteRecord(ctx, id),
			register,
			login,
		},
	},
});

export const yoga = createYoga({
	schema,
	graphiql: true,
});

export default {
	fetch: yoga.fetch,
};
