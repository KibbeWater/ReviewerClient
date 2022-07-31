import '../styles/titlebar.css';

export default function Titlebar() {
	return (
		<div className='titlebar'>
			<div
				className='titlebar__button btn__maximise'
				onClick={() => (window as any).electronAPI.maximiseWindow()}
			/>
			<div
				className='titlebar__button btn__minimise'
				onClick={() => (window as any).electronAPI.minimiseWindow()}
			/>
			<div
				className='titlebar__button btn__close'
				onClick={() => (window as any).electronAPI.quitProgram()}
			/>
		</div>
	);
}
