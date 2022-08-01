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

export function parseSpots(spots: string): Spot[] {
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

			x: parseFloat(x),
			y: parseFloat(y),
			z: parseFloat(z),

			pitch: parseFloat(pitch),
			yaw: parseFloat(yaw),
		} as Spot;
	});
}

export function getAllSpots(): string[] {
	return fs.readdirSync(SPOTS_REVIEWER_PATH).map((spotFile) => {
		if (spotFile.endsWith('_review.txt')) return spotFile.replace('_review.txt', '');
	});
}

export function getSpots(map: string): Promise<Spot[]> {
	return new Promise((resolve, reject) => {
		if (!fs.existsSync(path.join(SPOTS_REVIEWER_PATH, map + '_review.txt')))
			return reject('Invalid map');

		const spots = fs.readFileSync(path.join(SPOTS_REVIEWER_PATH, map + '_review.txt'));
		resolve(parseSpots(spots.toString()));
	});
}

export function addSpot(map: string, spot: Spot) {
	// If map does not exist, create it
	if (!fs.existsSync(path.join(SPOTS_REVIEWER_PATH, map + '_review.txt')))
		fs.writeFileSync(path.join(SPOTS_REVIEWER_PATH, map + '_review.txt'), '');

	// if the file empty
	const isEmpty =
		fs.readFileSync(path.join(SPOTS_REVIEWER_PATH, map + '_review.txt')).toString().length ===
		0;

	// Append spot to map
	fs.appendFileSync(
		path.join(SPOTS_REVIEWER_PATH, map + '_review.txt'),
		`${isEmpty ? '' : '\n'}${spot.name}*${spot.throwType}*${spot.grenadeType}*${spot.x}*${
			spot.y
		}*${spot.z}*${spot.pitch}*${spot.yaw}`
	);
}
