import axios from 'axios';

axios.defaults.adapter = require('axios/lib/adapters/http');

const API_URL = 'https://grenade.kibbewater.com/api';

export function Authenticate(username: string, password: string) {
	return new Promise((resolve, reject) => {
		axios
			.post(
				API_URL + '/user',
				{ username: username, password: password },
				{ adapter: require('axios/lib/adapters/http') }
			)
			.then((response) => {
				console.log(response);
			})
			.catch(reject);
	});
}
