'use server';

import { AuthError } from 'next-auth';
import { signIn } from '@/auth';
import bcrypt from "bcrypt";
import axios from "axios";
import { RegistrationUser } from '../register/page';
import { DepartmentDetails, RoleDetails, UserDetails } from './definitions';

export async function authenticate(
	prevState: string | undefined,
	formData: FormData,
) {
	try {
		await signIn('credentials', formData);
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case 'CredentialsSignin':
					return 'Invalid credentials.';
				default:
					return 'Something went wrong.';
			}
		}
		throw error;
	}
}

export async function encryptPassword(password: string) {
	return bcrypt.hash(password, 8);
}

export async function createUser(payload: UserDetails | RegistrationUser) {
	try {
		const { data } = await axios.post(`${process.env.APP_URL}/api/users`, payload);
		return data;
	} catch (error) {
		throw error;
	}
}

export async function updateUser(payload: UserDetails, id: string) {
	try {
		const { data } = await axios.put(`${process.env.APP_URL}/api/users/${id}`, payload);
		
		return data;
	} catch (error) {
		throw error;
	}
}

export async function deleteUser(id: string) {
	try {
		const { data } = await axios.delete(`${process.env.APP_URL}/api/users/${id}`);
		
		return data;
	} catch (error) {
		throw error;
	}
}

export async function createDepartment(payload: DepartmentDetails) {
	try {
		const { data } = await axios.post(`${process.env.APP_URL}/api/departments`, payload);
		return data;
	} catch (error) {
		throw error;
	}
}

export async function updateDepartment(payload: DepartmentDetails, id: string) {
	try {
		const { data } = await axios.put(`${process.env.APP_URL}/api/departments/${id}`, payload);
		
		return data;
	} catch (error) {
		throw error;
	}
}

export async function deleteDepartment(id: string) {
	try {
		const { data } = await axios.delete(`${process.env.APP_URL}/api/departments/${id}`);
		
		return data;
	} catch (error) {
		throw error;
	}
}

export async function createRole(payload: RoleDetails) {
	try {
		const { data } = await axios.post(`${process.env.APP_URL}/api/roles`, payload);
		return data;
	} catch (error) {
		throw error;
	}
}

export async function updateRole(payload: RoleDetails, id: string) {
	try {
		const { data } = await axios.put(`${process.env.APP_URL}/api/roles/${id}`, payload);
		
		return data;
	} catch (error) {
		throw error;
	}
}

export async function deleteRole(id: string) {
	try {
		const { data } = await axios.delete(`${process.env.APP_URL}/api/roles/${id}`);
		
		return data;
	} catch (error) {
		throw error;
	}
}