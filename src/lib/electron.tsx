import type { electronAPI } from '../types/electronAPI';

export default function GetElectronAPI(): electronAPI {
	return (window as any).electronAPI;
}
