import { useEffect, useState } from 'react';

import { useRouter } from '../private/router';
import { GetUser } from '../lib/authentication';
import '../styles/dashboard.css';
import type { User } from '../types/user';

export default function Page() {
	const [user, setUser] = useState({} as User);

	const router = useRouter();

	useEffect(() => {
		GetUser()
			.then(setUser)
			.catch(() => router.Navigate('login'));
	}, []);

	if (!user.id) return <div className='parent dashboard__parent' />;

	return (
		<div className='parent dashboard__parent'>
			<h1>Welcome back, {user.username}</h1>
		</div>
	);
}
