import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Authenticate } from '../lib/authentication';

import '../styles/login.css';

export default function Page() {
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [btnDisabled, setBtnDisabled] = useState(true);

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const loginBtn = () => {
		setLoading(true);
		Authenticate(username, password)
			.then((response) => {
				setLoading(false);
			})
			.catch(() => setLoading(false));
	};

	useEffect(() => {
		if (error || loading) setBtnDisabled(true);
		else if (!username || !password) setBtnDisabled(true);
		else setBtnDisabled(false);
	});

	useEffect(() => {
		if (error)
			return () =>
				clearTimeout(
					setTimeout(() => {
						setError('');
					}, 3000)
				);
	}, [error]);

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
