import { useModalRouter } from '../private/modal';
import { Router } from '../private/router';
import '../styles/modal.css';

type AppProps = {
	Component: () => JSX.Element;
	pageProps: any & { router: Router };
};

export default function App({ Component, pageProps }: AppProps) {
	const router = useModalRouter();
	return (
		<div className={router.HasModalActive() ? 'modal_parent' : ''}>
			<Component {...pageProps} />
		</div>
	);
}
