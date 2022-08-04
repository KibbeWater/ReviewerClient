import { motion } from 'framer-motion';
import { useModalRouter } from '../private/modal';

export default function Modal() {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',

				width: '100%',
				height: '100%',
			}}
		>
			<motion.div
				style={{
					backgroundColor: '#334155',
					width: '40vw',
					borderRadius: '0.5rem',
				}}
			>
				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<div>
						<h1 style={{ color: 'white', textAlign: 'center', marginBottom: '0' }}>
							Unexpected Error
						</h1>
						<p
							style={{
								color: '#e4e4e7',
								textAlign: 'center',
								marginTop: '3px',
								marginInline: '10px',
							}}
						>
							Try restarting the client or contact the developer.
						</p>
					</div>
					<div
						style={{
							width: '100%',
							height: '2px',
							marginBlock: '5px',
							backgroundColor: '#2f3b4d',
						}}
					/>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							width: '100%',
							marginBlock: '5px',
						}}
					>
						<button
							style={{
								paddingInline: '50px',
								paddingBlock: '4px',
								color: 'white',
								backgroundColor: '#0284c7',
								border: '0',
								borderRadius: '0.25rem',
								cursor: 'pointer',
							}}
							onClick={() => {
								useModalRouter().DisableActiveModal();
							}}
						>
							Close
						</button>
					</div>
				</div>
			</motion.div>
		</div>
	);
}
