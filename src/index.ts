import { app, BrowserWindow, ipcMain, session } from 'electron';
import Update from 'update-electron-app';
import path from 'path';

import Setup, { FailedToLoad, LoadMap } from './ipc';
import './api/spots';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

const PROTOCOL = 'grenaderc';
let mainWindow: BrowserWindow | null = null;

Update();
if (require('electron-squirrel-startup')) app.quit();

if (process.defaultApp) {
	if (process.argv.length >= 2)
		app.setAsDefaultProtocolClient(PROTOCOL, process.execPath, [path.resolve(process.argv[1])]);
} else app.setAsDefaultProtocolClient(PROTOCOL);

function ExecuteURL(args: string[], mod = false) {
	const [executionType, ...executionArgs] = args;

	switch (executionType) {
		case 'mod':
			ExecuteURL(executionArgs, true);
			break;
		case 'loadmap':
			if (executionArgs.length !== 1) {
				FailedToLoad(mainWindow, 'Missing map name');
				break;
			}
			LoadMap(mainWindow, executionArgs[0], mod).catch((error) =>
				FailedToLoad(mainWindow, error)
			);
			break;
		case 'loadmaps':
			if (executionArgs.length < 1) {
				FailedToLoad(mainWindow, 'Missing map name');
				break;
			}
			executionArgs.forEach((map) => {
				LoadMap(mainWindow, map, mod).catch((error) => {
					console.error(error);
					FailedToLoad(mainWindow, error);
				});
			});
			break;
		default:
			FailedToLoad(mainWindow, 'Unknown execution type');
			break;
	}
}

if (!app.requestSingleInstanceLock()) app.quit();
else {
	//const startupURL = process.argv.find((arg) => arg.startsWith(`${PROTOCOL}://`));

	app.on('second-instance', (event, argv) => {
		if (!mainWindow) return;

		const url = argv.find((arg) => arg.startsWith(PROTOCOL + '://'));
		if (url) {
			const [, newUrl] = url.split(PROTOCOL + '://');
			const [executionType, ...args] = newUrl.split('/');

			ExecuteURL([executionType, ...args]);
		}

		if (mainWindow.isMinimized()) mainWindow.restore();
		mainWindow.focus();
	});

	let tray;
	app.whenReady().then(() => {
		createWindow();
	});
}

function createWindow() {
	mainWindow = new BrowserWindow({
		height: 800,
		width: 1200,
		titleBarStyle: 'hidden',
		webPreferences: {
			preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
			nodeIntegration: true,
		},
		icon: path.join(__dirname, 'src/public/icons/win-icon.png'),
	});

	ipcMain.on('quit', () => {
		app.quit();
	});

	ipcMain.on('maximise', () => {
		mainWindow.isMaximized() ? mainWindow.restore() : mainWindow.maximize();
	});

	ipcMain.on('minimise', () => {
		mainWindow.minimize();
	});

	session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
		callback({
			responseHeaders: {
				...details.responseHeaders,
				'Content-Security-Policy':
					`script-src 'self' 'unsafe-eval' 'unsafe-inline' https://apis.google.com https://www.google.com https://www.gstatic.com; frame-src https://apis.google.com https://www.google.com https://www.gstatic.com; ` +
					details.responseHeaders['Content-Security-Policy'],
			},
		});
	});

	Setup();
	mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
});
