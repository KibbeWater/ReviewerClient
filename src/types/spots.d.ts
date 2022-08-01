export type Spot = {
	name: string;
	throwType: string;
	grenadeType: GrenadeTypes;

	x: number;
	y: number;
	z: number;

	pitch: number;
	yaw: number;
};

export type GrenadeTypes = 'flashbang' | 'molotov' | 'smoke';
