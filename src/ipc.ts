import fetch from 'node-fetch';
import { ipcMain } from 'electron';

import type { UserResponse } from './types/user';

const API_URL = 'https://grenade.kibbewater.com/api';

function Login(username: string, password: string): Promise<UserResponse> {
	return new Promise((resolve, reject) => {
		fetch(API_URL + '/user', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				username: username,
				password: password,
			}),
		})
			.then((response) => response.json().then((data) => resolve(data as UserResponse)))
			.catch((error) => reject(error));
	});
}

function FetchUser(renew?: string): Promise<UserResponse> {
	return new Promise((resolve, reject) => {
		const body = {} as any;

		if (renew) body.renew = renew;

		fetch(API_URL + '/user', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		})
			.then((response) => response.json().then((data) => resolve(data as UserResponse)))
			.catch((error) => reject(error));
	});
}

export default function Setup() {
	ipcMain.on('authenticate', (event, username, password) => {
		Login(username, password).then((response: UserResponse) =>
			event.reply('authenticate_response', response, response.error)
		);
	});

	ipcMain.on('auth_token', (event, token: string | undefined) => {
		FetchUser(token).then((response: UserResponse) =>
			event.reply('auth_token_response', response, response.error)
		);
	});
}