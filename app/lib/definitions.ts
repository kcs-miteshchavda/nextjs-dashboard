// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.

export type UserDetails = {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	gender: string;
	address: string;
	phone: string;
	image_url: string;
	dob: string;
	hobbies: Hobby[]
	otherHobbies?: string;
};

export type Hobby =
	"cricket" | "singing" | "dancing" | "travelling" | "reading" | "vlogging" | "other";

export type DepartmentDetails = {
	id: string;
	departmentName: string;
	active: boolean;
};

export type RoleDetails = {
	id: string;
	roleName: string;
	active: boolean;
};