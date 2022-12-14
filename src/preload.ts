import { contextBridge, IpcRenderer, ipcRenderer } from 'electron';
import type { Spot } from './types/spots';

contextBridge.exposeInMainWorld('electronAPI', {
	quitProgram: () => ipcRenderer.send('quit'),
	maximiseWindow: () => ipcRenderer.send('maximise'),
	minimiseWindow: () => ipcRenderer.send('minimise'),

	login: (username: string, password: string) => {
		return new Promise((resolve, reject) => {
			ipcRenderer.send('authenticate', username, password);
			ipcRenderer.once('authenticate_response', (event, user, error) => {
				if (error) reject(error);
				else resolve(user);
			});
		});
	},

	fetchUser: (token: string | undefined) => {
		return new Promise((resolve, reject) => {
			ipcRenderer.send('auth_token', token);
			ipcRenderer.once('auth_token_response', (event, user, error) => {
				if (error) reject(error);
				else resolve(user);
			});
		});
	},

	navigate: (url: string) => ipcRenderer.send('navigate', url),
	getLastNavigation: () => {
		return new Promise((resolve, reject) => {
			ipcRenderer.send('get_last_navigation');
			ipcRenderer.once('get_last_navigation', (event, url) => {
				resolve(url);
			});
		});
	},

	getMaps: () => {
		return new Promise((resolve, reject) => {
			ipcRenderer.send('get_maps');
			ipcRenderer.once('get_maps', (event, maps: string[]) => resolve(maps));
		});
	},

	getMap: (map: string) => {
		return new Promise((resolve, reject) => {
			ipcRenderer.send('get_map', map);
			ipcRenderer.once('get_map_' + map, (event, spots: Spot[]) => resolve(spots));
		});
	},

	addSpot: (map: string, spot: Spot) => {
		return new Promise((resolve, reject) => {
			ipcRenderer.send('add_spot', map, spot);
			ipcRenderer.once('add_spot_' + map, (event, spots: Spot[]) => resolve(spots));
		});
	},

	removeSpot: (map: string, spot: Spot) => {
		return new Promise((resolve, reject) => {
			ipcRenderer.send('remove_spot', map, spot);
			ipcRenderer.once('remove_spot_' + map, (event, spots: Spot[]) => resolve(spots));
		});
	},

	removeAllSpots: (map: string): Promise<void> => {
		return new Promise((resolve, reject) => {
			ipcRenderer.send('remove_all_spots', map);
			ipcRenderer.once('remove_all_spots_' + map, (event, spots: Spot[]) => resolve());
		});
	},

	onMapLoaded: (callback: (spot: Spot) => void) =>
		ipcRenderer.on('map_loaded', (event, spot) => callback(spot)),

	onFailedToLoad: (callback: (error: string) => void) =>
		ipcRenderer.on('failed_to_load', (event, error) => callback(error)),

	onError: (callback: (error: string) => void) =>
		ipcRenderer.on('error', (event, error) => callback(error)),

	rateSpot: (id: number, rating: boolean, isMod: boolean): Promise<void> => {
		return new Promise((resolve, reject) => {
			ipcRenderer.send('rate_spot', id, rating, isMod);
			ipcRenderer.once('rate_spot_' + id, (event, success) => {
				if (success) resolve();
				else reject();
			});
		});
	},
});
