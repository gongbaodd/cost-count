import { test, it, expect } from 'vitest';
import { getUsers } from './user';
import { Env } from '../types';

test('user Model', () => {
	it('should return [] when no value', () => {
		const users = getUsers({ kv: { get: async () => null } } as unknown as Env);

		expect(users).toEqual([]);
	});
});
