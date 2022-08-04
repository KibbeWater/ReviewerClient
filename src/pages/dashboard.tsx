import { useEffect, useState } from 'react';

import { GetUser } from '../lib/authentication';
import { useRouter } from '../private/router';
import type { Spot } from '../types/spots';
import type { User } from '../types/user';
import ElectronAPI from '../lib/electron';
import '../styles/dashboard.css';
import Card from '../components/card';
import { useModalRouter } from '../private/modal';

export default function Page() {
	const [user, setUser] = useState({} as User);
	const [spots, setSpots] = useState([] as Spot[]);

	const router = useRouter();

	useEffect(() => {
		GetUser()
			.then(setUser)
			.catch(() => router.Navigate('login'));

		reloadMaps();

		ElectronAPI().onMapLoaded((spot) => {
			console.log('Loaded new spot: ', spot);

			ElectronAPI()
				.getMaps()
				.then((e) => {
					Promise.all(e.map((map) => ElectronAPI().getMap(map))).then((maps) => {
						setSpots([].concat(...maps));
					});
				});
		});
	}, []);

	const reloadMaps = () => {
		ElectronAPI()
			.getMaps()
			.then((e) => {
				Promise.all(e.map((map) => ElectronAPI().getMap(map))).then((maps) => {
					setSpots([].concat(...maps));
				});
			});
	};

	const removeAll = () => {
		ElectronAPI()
			.getMaps()
			.then((e) => {
				Promise.all(e.map((map) => ElectronAPI().removeAllSpots(map))).then(() => {
					reloadMaps();
				});
			});
	};

	const removeSpot = (spot: Spot) => {
		setSpots((prev) => prev.filter((s) => s.map !== spot.map || s.name !== spot.name));
		ElectronAPI()
			.removeSpot(spot.map, spot)
			.then(() => {
				reloadMaps();
			});
	};

	const action = (action: string, spot: Spot) => {
		switch (action) {
			case 'remove':
				removeSpot(spot);
				break;
			case 'approve':
				ElectronAPI()
					.rateSpot(~~(Number(spot.name.split(' - ')[0]) || -1), true, false)
					.then(() => {
						removeSpot(spot);
					})
					.catch(() => useModalRouter().Show('error'));

				break;
			case 'reject':
				ElectronAPI()
					.rateSpot(~~(Number(spot.name.split(' - ')[0]) || -1), false, false)
					.then(() => {
						removeSpot(spot);
					})
					.catch(() => useModalRouter().Show('error'));
				break;
		}
	};

	if (!user.id) return <div className='parent dashboard__parent' />;

	return (
		<div className='parent dashboard__parent'>
			<h1 className='dashboard__header'>Welcome back, {user.username}</h1>
			<div className='dash__container'>
				<div className='dash__container__button_drawer'>
					<button className='dash__container__button btn__error' onClick={removeAll}>
						Remove All
					</button>
				</div>

				<div className='dash__container__cards'>
					<div className='cards__sandbox'>
						{spots.map((spot, idx) => {
							return <Card key={idx} spot={spot} action={action} />;
						})}
					</div>
				</div>
			</div>
		</div>
	);
}
