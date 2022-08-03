import path from 'path';
import fs from 'fs';
import type { Spot } from '../types/spots';

const FILESFORLUA_RELATIVE = 'INTERIUM/CSGO/FilesForLua';
const APPDATA_PATH = path.join(
	process.env.APPDATA ||
		(process.platform === 'darwin' ? process.env.HOME + '/Library/Preferences' : '/var/local'),
	FILESFORLUA_RELATIVE
);

const SPOTS_REVIEWER_PATH = path.join(APPDATA_PATH, 'kibbewater/Grenade Helper/');

export function parseSpots(spots: string, map: string): Spot[] {
	// Remove <br> tags and replace with newlines
	const spotsWithoutBreaks = spots.replace(/<br>/g, '\n');

	// Split into lines
	const lines = spotsWithoutBreaks.split('\n');

	return lines.map((line) => {
		// Parse each line by * space-separated values
		const [name, throwType, grenadeType, x, y, z, pitch, yaw] = line.split('*');

		return {
			name,
			throwType,
			grenadeType: grenadeType.toLocaleLowerCase(),

			map: map,

			x: parseFloat(x),
			y: parseFloat(y),
			z: parseFloat(z),

			pitch: parseFloat(pitch),
			yaw: parseFloat(yaw),
		} as Spot;
	});
}

export function getAllSpots(): string[] {
	const files = fs.readdirSync(SPOTS_REVIEWER_PATH);
	const spotFiles = files.reduce((prev, cur) => {
		if (cur.endsWith('_review.txt')) prev.push(cur.replace('_review.txt', ''));
		return prev;
	}, [] as string[]);
	return spotFiles;
}

export function getSpots(map: string): Promise<Spot[]> {
	return new Promise((resolve, reject) => {
		if (!fs.existsSync(path.join(SPOTS_REVIEWER_PATH, map + '_review.txt')))
			return reject('Invalid map');

		const spots = fs.readFileSync(path.join(SPOTS_REVIEWER_PATH, map + '_review.txt'));
		resolve(parseSpots(spots.toString(), map));
	});
}

export function addSpot(map: string, spot: Spot): Promise<Spot[]> {
	return new Promise((resolve, reject) => {
		// If map does not exist, create it
		if (!fs.existsSync(path.join(SPOTS_REVIEWER_PATH, map + '_review.txt')))
			fs.writeFileSync(path.join(SPOTS_REVIEWER_PATH, map + '_review.txt'), '');

		getSpots(map)
			.then((spots) => {
				const newSpots = [...spots, spot];
				fs.writeFileSync(
					path.join(SPOTS_REVIEWER_PATH, map + '_review.txt'),
					newSpots.join('\n')
				);
				resolve(newSpots);
			})
			.catch(reject);
	});
}

export function removeSpot(map: string, spot: Spot): Promise<Spot[]> {
	return new Promise((resolve, reject) => {
		getSpots(map)
			.then((spots) => {
				const newSpots = spots.filter(
					(s) =>
						s.x !== spot.x && s.y !== spot.y && s.z !== spot.z && s.name !== spot.name
				);
				fs.writeFileSync(
					path.join(SPOTS_REVIEWER_PATH, map + '_review.txt'),
					newSpots.join('\n')
				);
				resolve(newSpots);
			})
			.catch(reject);
	});
}

export default function removeAllSpots(map: string) {
	fs.rmSync(path.join(SPOTS_REVIEWER_PATH, map + '_review.txt'));
}
