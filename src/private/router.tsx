import { createRoot } from 'react-dom/client';
import ElectronAPI from '../lib/electron';

import App from '../pages/_app';

let staticInstance: Router | null = null;

type RouterOptions = {
	index?: string | undefined;
};

export class Router {
	root = createRoot(document.getElementById('_app'));
	currentPage: () => JSX.Element;

	constructor(options: RouterOptions = {}) {
		if (!options.index)
			ElectronAPI()
				.getLastNavigation()
				.then((url) => {
					console.log('Navigating to ' + url);
					this.Navigate(url).then(() => {
						this.render();
					});
				});
		else
			this.Navigate(options.index).then(() => {
				this.render();
			});
	}

	render() {
		this.root.render(<App Component={this.currentPage} pageProps={{ router: this }} />);
	}

	Navigate(page: string) {
		return new Promise<void>((resolve) => {
			import(`../pages/${page}`).then((module) => {
				this.currentPage = module.default;
				this.render();
				ElectronAPI().navigate(page);
				resolve();
			});
		});
	}
}

export function useRouter(): Router {
	// This is literally impossible to call unless you actually do it in the pages files later
	return staticInstance as Router;
}

export default (options: RouterOptions = {}): Router => {
	if (!staticInstance) return (staticInstance = new Router(options));
	else return staticInstance;
};
