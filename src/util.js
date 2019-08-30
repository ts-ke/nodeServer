const check = require('check-types');
const sizeOptions = ['S', 'M', 'L'];

const TOKEN =
	'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE1NjI1NzI0NjQsImV4cCI6MTU5NDEwODQ2OSwiYXVkIjoid3d3LnN0dWRlbnRzLjJoYXRzLmNvbS5hdSIsInN1YiI6InVzZXJAMmhhdHMuY29tLmF1IiwiR2l2ZW5OYW1lIjoiSm9obiIsIlN1cm5hbWUiOiJTbm93IiwiRW1haWwiOiJqb2huc25vd0AyaGF0cy5jb20uYXUiLCJSb2xlIjoiSmFuaXRvciJ9.BEEqb2ihfP0ec8TBu91T9lk0kcBKpz1NkJv4PpyjxdE';

function formatInterfaceItem(item) {
	return {
		...item,
		id: item.id.toString(),
	};
}

function formatInterfaceOrder(order) {
	return {
		...order,
		id: order.id.toString(),
		itemId: order.itemId.toString(),
	};
}

function validToken(token) {
	return token.substring(7) === TOKEN;
}

function isItems(items) {
	if (!Array.isArray(items)) {
		return false;
	}
	return check.all(items.map(validItem));
}

function checkPositiveInteger(x) {
	return check.integer(x) && check.positive(x);
}

function checkNonNegativeInteger(x) {
	return check.integer(x) && !check.negative(x);
}

function checkStringInt(str) {
	const regex = new RegExp('^[1-9][0-9]*$');
	return check.nonEmptyString(str) && check.match(str, regex);
}

function checkSize(size) {
	return (
		check.nonEmptyString(size) &&
		size.length === 1 &&
		check.contains(sizeOptions, size)
	);
}

function validItem(item) {
	const obj = check.map(item, {
		type: check.nonEmptyString,
		color: check.nonEmptyString,
		size: checkSize,
		stock: checkPositiveInteger,
	});
	return check.all(obj) && Object.keys(item).length === 4;
}

function validOrder(order) {
	const obj = check.map(order, {
		id: checkStringInt,
		itemId: checkStringInt,
		quantity: checkPositiveInteger,
	});
	return check.all(obj) && Object.keys(order).length === 3;
}

function validPatchItemBody(body) {
	const obj = check.map(body, {
		stock: checkNonNegativeInteger,
	});
	return check.all(obj) && Object.keys(obj).length === 1;
}

function validPostOrderBody(body) {
	const obj = check.map(body, {
		itemId: check.nonEmptyString,
		quantity: checkPositiveInteger,
	});
	return check.all(obj) && Object.keys(obj).length === 2;
}

exports.validToken = validToken;
exports.isItems = isItems;
exports.checkPositiveInteger = checkPositiveInteger;
exports.checkNonNegativeInteger = checkNonNegativeInteger;
exports.checkStringInt = checkStringInt;
exports.validItem = validItem;
exports.validOrder = validOrder;
exports.formatInterfaceItem = formatInterfaceItem;
exports.formatInterfaceOrder = formatInterfaceOrder;
exports.checkSize = checkSize;
exports.validPatchItemBody = validPatchItemBody;
exports.validPostOrderBody = validPostOrderBody;
