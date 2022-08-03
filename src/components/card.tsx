import type { Spot } from '../types/spots';
import '../styles/card.css';

function Loading() {
	return <div className='card__loading' />;
}

interface CardProps {
	loading?: boolean;
	spot?: Spot;
}

export default function Card(options: CardProps = {}) {
	if (!options.spot || options.loading) return <Loading />;

	return (
		<div className='card'>
			<div className='card__headers'>
				<h1 className='card__title'>
					{options.spot.name} - {options.spot.map}
				</h1>
			</div>
			<div className='card__buttons'>
				<div className='button__container'>
					<button className='card__button'>Approve</button>
					<button className='card__button button__red'>Reject</button>
					<button className='card__button card__button__full button__red'>Remove</button>
				</div>
			</div>
		</div>
	);
}
