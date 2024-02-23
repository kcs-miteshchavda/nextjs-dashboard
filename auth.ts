import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import type { UserDetails } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import { getUsers } from './app/lib/data';

async function getUser(email: string): Promise<UserDetails | undefined> {
	try {
		const users = await getUsers();
		const user = users.find((u: UserDetails) => u.email === email);
		return user && user;
	} catch (error) {
		console.error('Failed to fetch user:', error);
		throw new Error('Failed to fetch user.');
	}
}

export const { auth, signIn, signOut } = NextAuth({
	...authConfig,
	providers: [
		Credentials({
			async authorize(credentials) {
				const parsedCredentials = z
					.object({
						email: z.string().email(),
						password: z.string().min(6),
					})
					.safeParse(credentials);

				if (parsedCredentials.success) {
					const { email, password } = parsedCredentials.data;
					const user = await getUser(email);

					if (!user) return null;
					const passwordsMatch = await bcrypt.compare(
						password,
						user.password,
					);

					if (passwordsMatch) return user;
				}

				console.log('Invalid credentials');
				return null;
			},
		}),
	],
});
