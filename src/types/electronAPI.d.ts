export type electronAPI = {
	quitProgram: () => void;
	maximiseWindow: () => void;
	minimiseWindow: () => void;

	login: (username: string, password: string) => Promise<UserResponse>;
	fetchUser: (token: string | undefined) => Promise<UserResponse>;

	navigate: (url: string) => void;
	getLastNavigation: () => Promise<string>;

	getMaps: () => Promise<string[]>;
	getMap: (map: string) => Promise<Spot[]>;
	addSpot: (map: string, spot: Spot) => Promise<Spot[]>;
	removeSpot: (map: string, spot: Spot) => Promise<Spot[]>;
	removeAllSpots: (map: string) => void;
};
