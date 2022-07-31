import Link from '../private/link';
import '../styles/navbar.css';

export default function Navbar() {
	return (
		<div className='navbar'>
			<div />
			<div>
				<div className='bubble center'>
					<Link href='/'>
						<a className='bubble__link'>Home</a>
					</Link>
				</div>
			</div>
			<div />
		</div>
	);
}
