import { createRoot } from 'react-dom/client';

import App from '../pages/_app';

let staticInstance: Router | null = null;

type RouterOptions = {
	index?: string | undefined;
};

export class Router {
	root = createRoot(document.getElementById('_app'));
	currentPage: () => JSX.Element;

	constructor(options: RouterOptions = {}) {
		this.Navigate(options.index || 'index').then(() => {
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
