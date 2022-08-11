import ElectronAPI from './electron';
import type { UserResponse, User } from '../types/user';

export function Authenticate(username: string, password: string, token: string): Promise<User> {
	return new Promise((resolve, reject) => {
		ElectronAPI()
			.login(username, password, token)
			.then((response: UserResponse) => {
				if (response.success) {
					if (response.renew) localStorage.setItem('renew', response.renew);
					resolve(response.user as User);
				} else reject(response.error);
			})
			.catch((e) => {
				console.error(e);
				reject(e);
			});
	});
}

export function GetUser(): Promise<User> {
	return new Promise((resolve, reject) => {
		const renew = localStorage.getItem('renew');

		ElectronAPI()
			.fetchUser(renew)
			.then((data: UserResponse) => {
				if (data.success) {
					if (data.renew) localStorage.setItem('renew', data.renew);
					resolve(data.user as User);
				} else reject(data.error);
			})
			.catch(reject);
	});
}
