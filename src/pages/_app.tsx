import '../styles/global.css';

type AppProps = {
	Component: () => JSX.Element;
	pageProps: any;
};

export default function App({ Component, pageProps }: AppProps) {
	return <Component {...pageProps} />;
}
