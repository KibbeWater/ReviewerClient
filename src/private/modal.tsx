import { Router, RouterOptions } from './router';
import ElectronAPI from '../lib/electron';
import App from '../modals/_app';
import { createRoot, Root } from 'react-dom/client';

let staticInstance: ModalRouter | null = null;

export class ModalRouter {
	root: null | Root = null;
	currentPage: () => JSX.Element;

	constructor(options: RouterOptions = {}) {
		options.dom = '_modal';

		if (options.dom) this.root = createRoot(document.getElementById(options.dom));
		else this.root = createRoot(document.getElementById('_app'));
	}

	Show(modal: string): Promise<void> {
		return new Promise<void>((resolve) => {
			import(`../modals/${modal}`).then((module) => {
				this.currentPage = module.default;
				this.render();
				ElectronAPI().navigate(modal);
				resolve();
			});
		});
	}

	render(): void {
		this.root.render(<App Component={this.currentPage} pageProps={{ router: this } as any} />);
	}

	DisableActiveModal() {
		this.currentPage = () => null;
		this.render();
	}
}

export function useModalRouter(): ModalRouter {
	return staticInstance as ModalRouter;
}

export default function (options: RouterOptions = {}): ModalRouter {
	if (!staticInstance) return (staticInstance = new ModalRouter(options));
	else return staticInstance;
}
