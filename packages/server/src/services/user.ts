import { GraphQLError } from 'graphql';
import { User, createUser, getUser, getUserByEmail, signUser } from '../models/user';
import { Env } from '../types';
import { hash } from '../utils/hash';

type LoginInput = Omit<User, 'id'> & { password: string };

type LoginResponse = Omit<User, 'hash'> & { token: string };

export const register = async (_src: any, { email, password }: LoginInput, ctx: Env): Promise<LoginResponse> => {
	const user = await createUser(ctx, { email, password });
	const { token } = await signUser(ctx, user);
	return {
		token,
		id: user.id,
		email: user.email,
	};
};

export const login = async (_src: any, { email, password }: LoginInput, ctx: Env) => {
	const [user, inputHash] = await Promise.all([getUserByEmail(ctx, email), hash(password)]);

	if (!user) {
		throw new GraphQLError('User not found', {
			extensions: {
				http: {
					status: 404,
				},
			},
		});
	}

	if (inputHash !== user.hash) {
		throw new GraphQLError('Password incorrect', {
			extensions: {
				http: {
					status: 401,
				},
			},
		});
	}
	const { token } = await signUser(ctx, user);
	return { id: user.id, email, token };
};
