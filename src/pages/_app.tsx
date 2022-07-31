import Titlebar from '../components/titlebar';
import { Router } from '../private/router';
import '../styles/global.css';

type AppProps = {
	Component: () => JSX.Element;
	pageProps: any & { router: Router };
};

export default function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<Titlebar />
			<Component {...pageProps} />
		</>
	);
}
