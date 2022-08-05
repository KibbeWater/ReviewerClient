import { app, BrowserWindow, ipcMain, dialog, nativeImage, Tray } from 'electron';
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

if (!app.requestSingleInstanceLock()) app.quit();
else {
	//const startupURL = process.argv.find((arg) => arg.startsWith(`${PROTOCOL}://`));

	app.on('second-instance', (event, argv) => {
		if (!mainWindow) return;

		const url = argv.find((arg) => arg.startsWith(PROTOCOL + '://'));
		if (url) {
			const [, newUrl] = url.split(PROTOCOL + '://');
			const [executionType, ...args] = newUrl.split('/');

			switch (executionType) {
				case 'loadmap':
					if (args.length !== 1) {
						FailedToLoad(mainWindow, 'Missing map name');
						break;
					}
					LoadMap(mainWindow, args[0])
						.then(() => {
							console.log('Loaded map');
						})
						.catch((error) => FailedToLoad(mainWindow, error));
					break;
				default:
					dialog.showErrorBox('URL', 'default');
					FailedToLoad(mainWindow, 'Unknown execution type');
					break;
			}
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
	console.log(path.join(__dirname, 'src/public/icons/win-icon.png'));
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

	Setup();
	mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
});
