import { GraphQLError } from 'graphql';
import { Env } from '../types';
import { findCategoryById } from './category';
import { User, verifyUser } from './user';
import { storage } from '../utils/storage';

export interface Record {
	id: string;
	name: string;
	price: number;
	type: string; // UUID
	date: number;
}

function getKey(user: User) {
	return 'records-' + user.id;
}

export async function getRecords(ctx: Env) {
	const user = await verifyUser(ctx);
	const key = getKey(user);

	const records = (await storage(ctx).get<Record[] | null>(key, 'json')) ?? [];
	return records;
}

export async function findRecordById(ctx: Env, id: string) {
	const records = await getRecords(ctx);
	return records.find((record) => record.id === id) ?? null;
}

export async function createRecord(ctx: Env, { name, price, type, date }: Omit<Record, 'id'>): Promise<Record> {
	const [records, user, category] = await Promise.all([getRecords(ctx), verifyUser(ctx), findCategoryById(ctx, type)]);

	if (!category) {
		throw new GraphQLError('Category not found', {
			extensions: {
				http: {
					status: 404,
				},
			},
		});
	}

	const key = getKey(user);
	const id = crypto.randomUUID();
	const newRecord = { id, name, price, type, date: date ?? +Date.now() };
	records.push(newRecord);
	await storage(ctx).put(key, JSON.stringify(records));

	return newRecord;
}

export async function updateRecord(ctx: Env, id: string, { name, price, type, date }: Partial<Omit<Record, 'id'>>): Promise<Record> {
	const [records, user, record] = await Promise.all([getRecords(ctx), verifyUser(ctx), findRecordById(ctx, id)]);

	if (!record) {
		throw new GraphQLError('Record not found', {
			extensions: {
				http: {
					status: 404,
				},
			},
		});
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

	const key = getKey(user);
	await storage(ctx).put(key, JSON.stringify(records));
	return record;
}

export async function deleteRecord(ctx: Env, id: string) {
	const [records, user, record] = await Promise.all([getRecords(ctx), verifyUser(ctx), findRecordById(ctx, id)]);

	if (!record) {
		throw new GraphQLError('Record not found', {
			extensions: {
				http: {
					status: 404,
				},
			},
		});
	}

	const key = getKey(user);
	await storage(ctx).put(key, JSON.stringify(records.filter((record) => record.id !== id)));
	return record;
}
