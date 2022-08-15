export type Spot = {
	name: string;
	throwType: string;
	grenadeType: GrenadeTypes;

	map: string;

	x: number;
	y: number;
	z: number;

	pitch: number;
	yaw: number;

	mod?: boolean;
};

export type GrenadeTypes = 'flashbang' | 'molotov' | 'smoke';
