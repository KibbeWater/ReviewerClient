import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useRouter } from '../private/router';
import { Authenticate, GetUser } from '../lib/authentication';
import { GoogleReCaptcha } from 'react-google-recaptcha-v3';

import '../styles/login.css';

export default function Page() {
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [btnDisabled, setBtnDisabled] = useState(true);

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const [token, setToken] = useState('');

	const router = useRouter();

	const loginBtn = () => {
		setLoading(true);
		Authenticate(username, password, token)
			.then(() => router.Navigate('dashboard'))
			.catch((e) => {
				setError(e);
				setLoading(false);
				console.error(e);
			});
	};

	useEffect(() => {
		if (error || loading || !token) setBtnDisabled(true);
		else if (!username || !password) setBtnDisabled(true);
		else setBtnDisabled(false);
	}, [error, username, password, loading, token]);

	useEffect(() => {
		if (error) {
			const timeout = setTimeout(() => {
				setError('');
			}, 3000);
			return () => clearTimeout(timeout);
		}
	}, [error]);

	useEffect(() => {
		GetUser()
			.then(() => router.Navigate('dashboard'))
			.catch((e) => console.error('User was not previously logged in', e));
	}, []);

	return (
		<div className='parent parent__flex'>
			<div className='login__container shadow-xl'>
				<div className='login__grid'>
					<div className='login__grid__header'>
						<h1>Login</h1>
					</div>
					<div className='login__grid__body'>
						<input
							type={'text'}
							placeholder='Username...'
							onChange={(e) => setUsername(e.target.value)}
							value={username}
						/>
						<input
							type={'password'}
							placeholder='Password...'
							onChange={(e) => setPassword(e.target.value)}
							value={password}
						/>
					</div>
					<GoogleReCaptcha onVerify={setToken} />
					<motion.button
						className='login__grid__button'
						style={{ backgroundColor: '#0369A1' }}
						whileHover={{
							y: !btnDisabled ? -4 : 0,
						}}
						whileFocus={{
							y: !btnDisabled ? -4 : 0,
						}}
						animate={btnDisabled ? 'disabled' : 'enabled'}
						variants={{
							enabled: {
								backgroundColor: '#0EA5E9', //Sky 500
							},
							disabled: {
								backgroundColor: '#0369A1', //Sky 700,
							},
						}}
						onClick={loginBtn}
						disabled={btnDisabled}
					>
						{!error ? 'Login' : error}
					</motion.button>
				</div>
			</div>
		</div>
	);
}
