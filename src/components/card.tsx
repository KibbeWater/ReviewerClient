import '../styles/card.css';

function Loading() {
	return <div className='card__loading' />;
}

export default function Card() {
	return (
		<div className='card'>
			<div />
			<div />
			<div className='card__buttons' />
		</div>
	);
}
