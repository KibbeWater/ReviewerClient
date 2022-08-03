import fetch from 'node-fetch';
import { ipcMain } from 'electron';

import type { UserResponse } from './types/user';
import removeAllSpots, { addSpot, getAllSpots, getSpots, removeSpot } from './api/spots';

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
			.then((response) =>
				response
					.json()
					.then((data) => resolve(data as UserResponse))
					.catch(() => console.error(response))
			)
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
			.then((response) =>
				response
					.json()
					.then((data) => resolve(data as UserResponse))
					.catch(reject)
			)
			.catch((error) => reject(error));
	});
}

let navURL = 'index';

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

	ipcMain.on('navigate', (event, url) => (navURL = url));

	ipcMain.on('get_last_navigation', (event) => event.reply('get_last_navigation', navURL));

	ipcMain.on('get_maps', (event) => event.reply('get_maps', getAllSpots()));

	ipcMain.on('get_map', (event, map) =>
		getSpots(map as string).then((spot) => event.reply('get_map_' + map, spot))
	);

	ipcMain.on('add_spot', (event, spot, map) =>
		addSpot(spot, map).then((spots) => event.reply('add_spot_' + map, spots))
	);

	ipcMain.on('remove_spot', (event, spot, map) =>
		removeSpot(spot, map).then((spots) => event.reply('remove_spot_' + map, spots))
	);

	ipcMain.on('remove_all_spots', (event, map) =>
		event.reply('remove_all_spots', removeAllSpots(map))
	);
}
