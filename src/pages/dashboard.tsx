import { useEffect, useState } from 'react';

import { GetUser } from '../lib/authentication';
import { useRouter } from '../private/router';
import type { Spot } from '../types/spots';
import type { User } from '../types/user';
import ElectronAPI from '../lib/electron';
import '../styles/dashboard.css';
import Card from '../components/card';

export default function Page() {
	const [user, setUser] = useState({} as User);
	const [spots, setSpots] = useState([] as Spot[]);

	const router = useRouter();

	useEffect(() => {
		GetUser()
			.then(setUser)
			.catch(() => router.Navigate('login'));

		ElectronAPI()
			.getMaps()
			.then((e) => {
				Promise.all(e.map((map) => ElectronAPI().getMap(map)));
			});
	}, []);

	if (!user.id) return <div className='parent dashboard__parent' />;

	return (
		<div className='parent dashboard__parent'>
			<h1 className='dashboard__header'>Welcome back, {user.username}</h1>
			<div className='container'>
				<div className='container__button_drawer'>
					<button className='container__button btn__normal'>Remove All</button>
					<button className='container__button btn__error'>Remove All</button>
				</div>

				<div className='container__cards'>
					<div className='cards__sandbox'>
						<Card />
						<Card />
						<Card />
						<Card />
						<Card />
						<Card />
						<Card />
						<Card />
						<Card />
						<Card />
					</div>
				</div>
			</div>
		</div>
	);
}
