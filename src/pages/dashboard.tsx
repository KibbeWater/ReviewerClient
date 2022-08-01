import { useEffect, useState } from 'react';

import { GetUser } from '../lib/authentication';
import { useRouter } from '../private/router';
import type { Spot } from '../types/spots';
import type { User } from '../types/user';
import '../styles/dashboard.css';
import ElectronAPI from '../lib/electron';

export default function Page() {
	const [user, setUser] = useState({} as User);
	const [spots, setSpots] = useState([] as Spot[]);

	const router = useRouter();

	useEffect(() => {
		GetUser()
			.then(setUser)
			.catch(() => router.Navigate('login'));

		const benchStart = Date.now();
		ElectronAPI()
			.getMaps()
			.then((e) => {
				Promise.all(e.map((map) => ElectronAPI().getMap(map)))
					.then((maps) => {
						console.log(`Fetched maps in ${Date.now() - benchStart}ms`, maps);
					})
					.catch((e) => {
						console.error(e);
					});
			});
	}, []);

	if (!user.id) return <div className='parent dashboard__parent' />;

	return (
		<div className='parent dashboard__parent'>
			<h1>Welcome back, {user.username}</h1>
		</div>
	);
}
