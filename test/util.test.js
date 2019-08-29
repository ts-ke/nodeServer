const {
	validToken,
	isItems,
	checkPositiveInteger,
	checkStringInt,
	validItem,
	validOrder,
} = require('../src/util.js');

describe('validItem tests', () => {
	test('normal validItem', () => {
		const item = { type: 'shirt', color: 'blue', size: 'S', stock: 5 };
		const res = validItem(item);
		expect(res).toBeTruthy();
	});

	test('validItem wrong type - int', () => {
		const item = { type: 12, color: 'blue', size: 'S', stock: 5 };
		const res = validItem(item);
		expect(res).toBeFalsy();
	});

	test('validItem wrong type - obj', () => {
		const item = { type: {}, color: 'blue', size: 'S', stock: 5 };
		const res = validItem(item);
		expect(res).toBeFalsy();
	});

	test('validItem wrong type - empty string', () => {
		const item = { type: '', color: 'blue', size: 'S', stock: 5 };
		const res = validItem(item);
		expect(res).toBeFalsy();
	});

	test('validItem wrong type - null', () => {
		const item = { type: '', color: 'blue', size: 'S', stock: 5 };
		const res = validItem(item);
		expect(res).toBeFalsy();
	});

	test('validItem wrong size - string', () => {
		const item = { type: '', color: 'blue', size: 'SM', stock: 5 };
		const res = validItem(item);
		expect(res).toBeFalsy();
	});

	test('validItem wrong stock - float', () => {
		const item = { type: '', color: 'blue', size: 'SM', stock: 5.1 };
		const res = validItem(item);
		expect(res).toBeFalsy();
	});

	test('validItem wrong stock - null', () => {
		const item = { type: '', color: 'blue', size: 'SM', stock: null };
		const res = validItem(item);
		expect(res).toBeFalsy();
	});

	test('validItem wrong stock - undefined', () => {
		const item = { type: '', color: 'blue', size: 'SM', stock: undefined };
		const res = validItem(item);
		expect(res).toBeFalsy();
	});

	test('validItem wrong stock - negative int', () => {
		const item = { type: '', color: 'blue', size: 'SM', stock: -1 };
		const res = validItem(item);
		expect(res).toBeFalsy();
	});

	test('validItem wrong stock - string', () => {
		const item = { type: '', color: 'blue', size: 'SM', stock: 'a' };
		const res = validItem(item);
		expect(res).toBeFalsy();
	});

	test('validItem wrong stock - not exists', () => {
		const item = { type: '', color: 'blue', size: 'SM' };
		const res = validItem(item);
		expect(res).toBeFalsy();
	});
});

describe('checkStringInt tests', () => {
	test('normal checkStringInt', () => {
		const res = checkStringInt('123');
		expect(res).toBeTruthy();
	});

	test('wrong checkStringInt - neg', () => {
		const res = checkStringInt('-123');
		expect(res).toBeFalsy();
	});

	test('wrong checkStringInt - 0 start', () => {
		const res = checkStringInt('0123');
		expect(res).toBeFalsy();
	});

	test('wrong checkStringInt - float', () => {
		const res = checkStringInt('1.23');
		expect(res).toBeFalsy();
	});

	test('wrong checkStringInt - null', () => {
		const res = checkStringInt(null);
		expect(res).toBeFalsy();
	});

	test('wrong checkStringInt - undefined', () => {
		const res = checkStringInt(undefined);
		expect(res).toBeFalsy();
	});

	test('wrong checkStringInt - empty str', () => {
		const res = checkStringInt('');
		expect(res).toBeFalsy();
	});
});

describe('validOrder tests', () => {
	test('normal validOrder', () => {
		const item = { itemId: '12', id: '13', quantity: 13 };
		const res = validOrder(item);
		expect(res).toBeTruthy();
	});

	test('wrong validOrder - neg quan', () => {
		const item = { itemId: '12', id: '13', quantity: -13 };
		const res = validOrder(item);
		expect(res).toBeFalsy();
	});

	test('wrong validOrder - float quan', () => {
		const item = { itemId: '12', id: '13', quantity: 13.1 };
		const res = validOrder(item);
		expect(res).toBeFalsy();
	});
});
