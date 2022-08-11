import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import Titlebar from '../components/titlebar';
import { Router } from '../private/router';
import '../styles/global.css';

type AppProps = {
	Component: () => JSX.Element;
	pageProps: any & { router: Router };
};

export default function App({ Component, pageProps }: AppProps) {
	return (
		<GoogleReCaptchaProvider reCaptchaKey='6Ld5jGUhAAAAABEWSZLT5BSU0OrW1u7LkfTQHVe-'>
			<Titlebar />
			<Component {...pageProps} />
		</GoogleReCaptchaProvider>
	);
}
