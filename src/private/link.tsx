import * as React from 'react';
import { useRouter } from './router';

interface Props {
	children: JSX.Element | string;
	href: string;
}

function HandleClick(page: string) {
	// Convert the link to a file path, if it is / then it is 'index' otherwise remove the leading '/'
	console.log('Navigate to ' + page);
	const path = page === '/' ? 'index' : page.substring(1);
	console.log('Translated to ' + path);

	// If it is an external link, then open it in a new tab
	if (page.startsWith('http')) {
		window.open(page, '_blank');
		return;
	}

	useRouter()
		.Navigate(path)
		.then(() => {
			console.log('Navigated to ' + path);
		})
		.catch(() => {
			console.error('Failed to navigate to page: ' + page);
		});
}

export default function Link({ children, href }: Props) {
	if (typeof children === 'string')
		return (
			<a onClick={() => HandleClick(href)} style={{ cursor: 'pointer' }}>
				{children}
			</a>
		);
	else
		return React.cloneElement(children, {
			onClick: () => HandleClick(href),
			style: { cursor: 'pointer' },
		});
}
