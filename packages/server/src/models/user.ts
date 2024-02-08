import { GraphQLError } from 'graphql';
import { Env } from '../types';
import jwt from '@tsndr/cloudflare-worker-jwt';
import { hash } from '../utils/hash';
import { storage } from '../utils/storage';

const key = 'users';

export interface User {
	id: string;
	email: string;
	hash: string;
}

export async function getUsers(ctx: Env) {
	const users = await storage(ctx).get<User[] | null>(key, 'json');
	return users ?? [];
}

export async function getUser(ctx: Env, id: string) {
	const users = await getUsers(ctx);
	return users.find((user) => user.id === id) || null;
}

export async function getUserByEmail(ctx: Env, email: string) {
	const users = await getUsers(ctx);
	return users.find((user) => user.email === email) || null;
}

export async function createUser(ctx: Env, info: Omit<User, 'id' | 'hash'> & { password: string }) {
	const [users, user] = await Promise.all([
		getUsers(ctx),
		getUserByEmail(ctx, info.email),
	])

	if (user) {
		throw new GraphQLError('User already exists', {
			extensions: {
				http: {
					status: 409,
				},
			},
		});
	}

	const id = crypto.randomUUID();
	const newUser = { id, email: info.email, hash: await hash(info.password) };

	users.push(newUser);
	await storage(ctx).put(key, JSON.stringify(users));
	return newUser;
}

export async function signUser(ctx: Env, user: User) {
	const token = await jwt.sign({ id: user.id }, ctx.SINING_KEY);
	return { token };
}

export async function verifyUser(ctx: Env) {
	const authorization = ctx.request.headers.get('authorization');
	if (!authorization) {
		throw new GraphQLError('Authorization required', {
			extensions: {
				http: {
					status: 401,
				},
			},
		});
	}

	const token = authorization.split(' ')[1];

	const isValid = await jwt.verify(token, ctx.SINING_KEY);
	if (!isValid) {
		throw new GraphQLError('Invalid token', {
			extensions: {
				http: {
					status: 401,
				},
			},
		});
	}

	const { payload } = jwt.decode<{ id: string }>(token);

	if (!payload) {
		throw new GraphQLError('Invalid token', {
			extensions: {
				http: {
					status: 401,
				},
			},
		});
	}

	const user = await getUser(ctx, payload.id);

	if (!user) {
		throw new GraphQLError('User not found', {
			extensions: {
				http: {
					status: 404,
				},
			},
		});
	}

	return user;
}
