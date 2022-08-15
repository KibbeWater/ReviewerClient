import fetch from 'node-fetch';
import { BrowserWindow, ipcMain } from 'electron';
import { Cookie } from 'tough-cookie';

import type { UserResponse } from './types/user';
import removeAllSpots, { addSpot, getAllSpots, getSpots, removeSpot } from './api/spots';
import type { Spot } from './types/spots';

const API_URL = 'https://grenade.kibbewater.com/api';
let lastToken = '';

function Login(username: string, password: string): Promise<UserResponse> {
	return new Promise((resolve, reject) => {
		fetch(API_URL + '/user', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'User-Agent': 'GrenadeRC',
			},
			body: JSON.stringify({
				username: username,
				password: password,
			}),
		})
			.then((response) =>
				response
					.json()
					.then((data) => {
						if (response.headers.has('Set-Cookie')) {
							// Loop through all cookies
							const cookies = response.headers
								.get('Set-Cookie')!
								.split(';')
								.map((cookie) => {
									return Cookie.parse(cookie);
								});

							// Find the token cookie
							const tokenCookie = cookies.find((cookie) => cookie.key === 'token');

							if (tokenCookie) lastToken = tokenCookie.value;
						}
						resolve(data as UserResponse);
					})
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
					.then((data) => {
						if (response.headers.has('Set-Cookie')) {
							// Loop through all cookies
							const cookies = response.headers
								.get('Set-Cookie')!
								.split(';')
								.map((cookie) => {
									return Cookie.parse(cookie);
								});

							// Find the token cookie
							const tokenCookie = cookies.find((cookie) => cookie.key === 'token');

							if (tokenCookie) lastToken = tokenCookie.value;
						}
						resolve(data as UserResponse);
					})
					.catch(reject)
			)
			.catch((error) => reject(error));
	});
}

function RateSubmission(id: number, rating: boolean, isMod: boolean) {
	return new Promise((resolve, reject) => {
		fetch(API_URL + '/rate/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				cookie: 'token=' + lastToken + ';',
			},
			body: JSON.stringify({
				suggestion: id,
				rating,
				isModReview: isMod,
			}),
		})
			.then((response) =>
				response
					.json()
					.then((data) => resolve(data))
					.catch(() => reject('Unable to add review'))
			)
			.catch(() => reject('Unable to add review'));
	});
}

export function LoadMap(window: BrowserWindow, id: string, isMod?: boolean) {
	return new Promise((resolve, reject) => {
		fetch(API_URL + '/submissions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				id: id,
			}),
		})
			.then((response) =>
				response
					.json()
					.then((result: { result: Array<Spot & { id: number; location: string }> }) => {
						const data = result.result[0] as Spot & { id: number; location: string };
						if (!data) return reject('No map found');

						data.name = `${data.id} - ${data.location}`;
						data.mod = isMod;
						delete data.id;
						delete data.location;

						addSpot(data.map, data).then(() => {
							window.webContents.send('map_loaded', data);
							resolve(data);
						});
					})
					.catch(reject)
			)
			.catch((error) => reject(error));
	});
}

let navURL = 'index';

export default function Setup() {
	ipcMain.on('authenticate', (event, username, password) =>
		Login(username, password).then((response: UserResponse) =>
			event.reply('authenticate_response', response, response.error)
		)
	);

	ipcMain.on('auth_token', (event, token: string | undefined) =>
		FetchUser(token).then((response: UserResponse) =>
			event.reply('auth_token_response', response, response.error)
		)
	);

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
		event.reply('remove_all_spots_' + map, removeAllSpots(map))
	);

	ipcMain.on('rate_spot', (event, id, rating, isMod) =>
		RateSubmission(id, rating, isMod)
			.then((res: { success: boolean }) => event.reply('rate_spot_' + id, res.success))
			.catch(() => event.reply('rate_spot_' + id, false))
	);
}

export function FailedToLoad(window: BrowserWindow, error?: string) {
	window.webContents.send('failed_to_load', error || 'Unknown error');
}
