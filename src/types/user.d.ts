export type User = {
	id: number;
	username: string;
	email: string;
	interium_user: string;
	user_group: string;
};

export type UserResponse = {
	success: boolean;
	error?: string;

	user?: User;
	renew?: string;
};
