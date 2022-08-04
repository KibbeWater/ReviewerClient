import { createRoot } from 'react-dom/client';
import App from '../modals/_app';

let staticInstance: ModalRouter | null = null;

export class ModalRouter {
	root = createRoot(document.getElementById('_modal'));
	currentPage: () => JSX.Element | null;

	//constructor(options: RouterOptions = {}) {}

	Show(modal: string): Promise<void> {
		return new Promise<void>((resolve) => {
			import(`../modals/${modal}`).then((module) => {
				this.currentPage = module.default;
				this.render();
				resolve();
			});
		});
	}

	render(): void {
		this.root.render(<App Component={this.currentPage} pageProps={{ router: this } as any} />);
	}

	DisableActiveModal() {
		this.currentPage = null;
		this.render();
	}

	HasModalActive() {
		return this.currentPage !== null;
	}
}

export function useModalRouter(): ModalRouter {
	return staticInstance as ModalRouter;
}

export default function (): ModalRouter {
	if (!staticInstance) return (staticInstance = new ModalRouter());
	else return staticInstance;
}
