import { GraphQLError } from 'graphql';
import { Env } from '../types';
import { User, verifyUser } from './user';

export interface Category {
	id: string;
	name: string;
}

function getKey(user: User) {
	return 'categories-' + user.id;
}

export async function getCategories(ctx: Env) {
	const user = await verifyUser(ctx);
	const key = getKey(user);

	const categories = (await ctx.kv.get<Category[] | null>(key, 'json')) ?? [];

	return categories;
}

export async function findCategoryById(ctx: Env, id: string) {
	const categories = await getCategories(ctx);
	return categories.find((category) => category.id === id) ?? null;
}

export async function findCategoryByName(ctx: Env, name: string) {
	const categories = await getCategories(ctx);
	return categories.find((category) => category.name === name) ?? null;
}

export async function createCategory(ctx: Env, name: string): Promise<Category> {
	const [categories, user] = await Promise.all([getCategories(ctx), verifyUser(ctx)]);

	const key = getKey(user);

	const existed = await findCategoryByName(ctx, name);
	if (existed) {
		throw new GraphQLError('Category already exists', {
			extensions: {
				http: {
					status: 400,
				},
			},
		});
	}

	const id = crypto.randomUUID();
	categories.push({ id, name });
	await ctx.kv.put(key, JSON.stringify(categories));

	return { id, name };
}
