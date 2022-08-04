import type { Spot } from '../types/spots';
import '../styles/card.css';
import GetElectronAPI from '../lib/electron';

function Loading() {
	return <div className='card__loading' />;
}

interface CardProps {
	loading?: boolean;
	spot?: Spot;
	action?: (action: string, spot: Spot) => void;
}

export default function Card(options: CardProps = {}) {
	if (!options.spot || options.loading) return <Loading />;

	const action = options.action;

	return (
		<div className='card'>
			<div className='card__headers'>
				<h1 className='card__title'>
					{options.spot.name} - {options.spot.map}
				</h1>
			</div>
			<div className='card__buttons'>
				<div className='button__container'>
					<button
						className='card__button'
						onClick={() => action('approve', options.spot)}
					>
						Approve
					</button>
					<button
						className='card__button button__red'
						onClick={() => action('reject', options.spot)}
					>
						Reject
					</button>
					<button
						className='card__button card__button__full button__red'
						onClick={() => {
							GetElectronAPI().removeSpot(options.spot.map, options.spot);
							action('remove', options.spot);
						}}
					>
						Remove
					</button>
				</div>
			</div>
		</div>
	);
}
