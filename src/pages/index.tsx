import { motion } from 'framer-motion';

import Link from '../private/link';
import '../styles/index.css';

export default function Page() {
	return (
		<div className='parent parent-window'>
			<div className='container'>
				<div>
					<h1 className='container__text'>Welcome!</h1>
					<h1 className='container__subtext'>Please sign in to continue</h1>
				</div>
				<div>
					<Link href='/login'>
						<motion.a
							className='container__button'
							whileHover={{
								y: -4,
							}}
						>
							Login
						</motion.a>
					</Link>
				</div>
			</div>
		</div>
	);
}
