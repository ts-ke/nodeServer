const config = require('../config.js');
const fetch = require('node-fetch');
const https = require('https');
const agent = new https.Agent({
	rejectUnauthorized: false,
});

describe('postItems tests', () => {
	test('normal postItems', async () => {
		const body = {
			items: [
				{ type: 'shirt', color: 'blue', size: 'S', stock: 5 },
				{ type: 'shirt', color: 'blue', size: 'S', stock: 5 },
				{ type: 'shirt', color: 'blue', size: 'S', stock: 5 },
				{ type: 'shirt', color: 'blue', size: 'M', stock: 5 },
			],
		};
		const url = config.TEST_URL + ':' + config.PORT.toString() + '/items';
		console.log(url);
		const res = await fetch(url, {
			agent,
			method: 'POST',
			headers: {
				Authorization: 'Bearer ' + config.TOKEN,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		});

		const json = await res.json();
		expect(json.success).toBeTruthy();
	});

	test('postItems - wrong item', async () => {
		const body = {
			items: [
				{ type: 'shirt', color: 'blue', size: 'S', stock: 5 },
				{ type: 'shirt', color: 10, size: 'S', stock: 5 },
				{ type: 'shirt', color: 'blue', size: 'S', stock: 5 },
				{ type: 'shirt', color: 'blue', size: 'M', stock: 5 },
			],
		};
		const url = config.TEST_URL + ':' + config.PORT.toString() + '/items';

		const res = await fetch(url, {
			agent,
			method: 'POST',
			headers: {
				Authorization: 'Bearer ' + config.TOKEN,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		});

		const json = await res.json();

		expect(res.status).toBe(400);
		expect(json.success).toBeFalsy();
	});
});
