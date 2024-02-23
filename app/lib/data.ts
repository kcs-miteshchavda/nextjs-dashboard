import { unstable_noStore as noStore } from 'next/cache';
import axios from 'axios';
import { DepartmentDetails, RoleDetails, UserDetails } from './definitions';

export async function getUsers(): Promise<UserDetails[]> {
	noStore();
	try {
		const data = await axios.get(`${process.env.APP_URL}/api/users`);
		
		return data?.data
	} catch (error) {
		throw new Error("Failed to fetch users.");
	}
}

export async function getUserById(id?: string) {
	noStore();
	try {
		const data = await axios.get(`${process.env.APP_URL}/api/users/${id}`);
		
		return data?.data?.[0]
	} catch (error) {
		throw new Error(`Failed to fetch user.`);
	}
}

export async function getDepartments(): Promise<DepartmentDetails[]> {
	noStore();
	try {
		const data = await axios.get(`${process.env.APP_URL}/api/departments`);
		
		return data?.data
	} catch (error) {
		throw new Error("Failed to fetch departments.");
	}
}

export async function getDepartmentById(id?: string): Promise<DepartmentDetails> {
	noStore();
	try {
		const data = await axios.get(`${process.env.APP_URL}/api/departments/${id}`);
		
		return data?.data?.[0]
	} catch (error) {
		throw new Error(`Failed to fetch department.`);
	}
}

export async function getRoles(): Promise<RoleDetails[]> {
	noStore();
	try {
		const data = await axios.get(`${process.env.APP_URL}/api/roles`);
		
		return data?.data
	} catch (error) {
		throw new Error("Failed to fetch roles.");
	}
}

export async function getRoleById(id?: string): Promise<RoleDetails> {
	noStore();
	try {
		const data = await axios.get(`${process.env.APP_URL}/api/roles/${id}`);
		
		return data?.data?.[0]
	} catch (error) {
		throw new Error(`Failed to fetch role.`);
	}
}