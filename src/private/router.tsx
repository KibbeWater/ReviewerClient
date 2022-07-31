import { createRoot } from 'react-dom/client';

import App from '../pages/_app';

let currentPage: () => JSX.Element;

export function Navigate(page: string) {
	return new Promise<void>((resolve) => {
		import(`../pages/${page}`).then((module) => {
			console.log('Sucessfully loaded page: ' + page);
			console.log(module);
			currentPage = module.default;
			resolve();
		});
	});
}

export default function Router() {
	Navigate('index').then(() => {
		const root = createRoot(document.getElementById('_app'));
		root.render(<App Component={currentPage} pageProps={{}} />);
	});
}
