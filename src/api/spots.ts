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

export function parseObjectSpot(spot: any): Spot & { id: string } {
	return {
		id: spot.ID,
		map: spot.Map,
		name: spot.Location,

		throwType: spot['Throw Type'],
		grenadeType: spot['Grenade Type'],

		x: spot.X,
		y: spot.Y,
		z: spot.Z,
		pitch: spot.Pitch,
		yaw: spot.Yaw,

		mod: spot.mod,
	} as Spot & { id: string };
}

export function parseSpots(spots: string, map: string): Spot[] {
	// Remove <br> tags and replace with newlines
	const spotsWithoutBreaks = spots.replace(/<br>/g, '\n');

	// Split into lines
	const lines = spotsWithoutBreaks.split('\n');

	if (lines.length === 0) return [];

	const spots2 = lines.map((line) => {
		// Parse each line by * space-separated values
		const [name, throwType, grenadeType, x, y, z, pitch, yaw, mod] = line.split('*');

		if (grenadeType !== undefined)
			return {
				name,
				throwType,
				grenadeType: grenadeType.toLowerCase(),

				map: map,

				x: parseFloat(x),
				y: parseFloat(y),
				z: parseFloat(z),

				pitch: parseFloat(pitch),
				yaw: parseFloat(yaw),

				mod: mod === 'true',
			} as Spot;
	});

	return spots2;
}

export function serializeSpots(spots: Array<Spot>): string {
	return spots
		.map((spot) => {
			if (spot !== undefined)
				return `${spot.name}*${spot.throwType}*${spot.grenadeType}*${spot.x}*${spot.y}*${
					spot.z
				}*${spot.pitch}*${spot.yaw}*${spot.mod === true ? 'true' : 'false'}`;
		})
		.filter((line) => line !== undefined)
		.join('\n');
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
			fs.writeFileSync(path.join(SPOTS_REVIEWER_PATH, map + '_review.txt'), '');

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
					serializeSpots(newSpots)
				);
				resolve(newSpots);
			})
			.catch(reject);
	});
}

export function addSpots(map: string, spots: Spot[]): Promise<Spot[]> {
	return new Promise((resolve, reject) => {
		// If map does not exist, create it
		if (!fs.existsSync(path.join(SPOTS_REVIEWER_PATH, map + '_review.txt')))
			fs.writeFileSync(path.join(SPOTS_REVIEWER_PATH, map + '_review.txt'), '');

		getSpots(map)
			.then((curSpots) => {
				const newSpots = [...curSpots, ...spots];
				fs.writeFileSync(
					path.join(SPOTS_REVIEWER_PATH, map + '_review.txt'),
					serializeSpots(newSpots)
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
				const newSpots = spots.filter((s) => s.name !== spot.name);
				if (newSpots.length === 0) {
					fs.rmSync(path.join(SPOTS_REVIEWER_PATH, map + '_review.txt'));
					return resolve(newSpots);
				}
				fs.writeFileSync(
					path.join(SPOTS_REVIEWER_PATH, map + '_review.txt'),
					serializeSpots(newSpots)
				);
				resolve(newSpots);
			})
			.catch(reject);
	});
}

export default function removeAllSpots(map: string) {
	fs.rmSync(path.join(SPOTS_REVIEWER_PATH, map + '_review.txt'));
}
