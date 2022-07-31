export type electronAPI = {
	quitProgram: () => void;
	maximiseWindow: () => void;
	minimiseWindow: () => void;

	login: (username: string, password: string) => Promise<UserResponse>;
	fetchUser: (token: string | undefined) => Promise<UserResponse>;
};
