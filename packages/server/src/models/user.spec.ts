import { it, expect, beforeAll, vi, describe } from 'vitest';
import { getUser, getUserByEmail, getUsers } from './user';
import { Env } from '../types';

describe('user Model', () => {
	beforeAll(() => {
		vi.mock('@tsndr/cloudflare-worker-jwt', async () => ({}))
	})

	it('getUsers() should return [] when no value', async () => {
		const users = await getUsers({ kv: { get: async () => null } } as unknown as Env);
		expect(users).toEqual([]);
	});

	it('getUser() should return null when no user', async () => {
		const user = await getUser({ kv: { get: async () => null } } as unknown as Env, 'id');
		expect(user).toBeNull();
	})

	it('getUserByEmail() should return null when no user', async () => {
		const user = await getUserByEmail({ kv: { get: async () => null } } as unknown as Env, 'email');
		expect(user).toBeNull();
	})

	it('createUser() should create a user', async () => {});

	it('createUser() should throw an error when user already exists', async () => {});

	it('signUser() should return a token', async () => {});

	it('verifyUser() should throw an error when no authorization header', async () => {});

	it('verifyUser() should throw an error when token is invalid', async () => {});

	it('verifyUser() should throw an error when payload is wrong', async () => {});

	it('verifyUser() should throw an error when user is not existed', async () => {});

});
