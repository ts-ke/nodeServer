const check = require('check-types');
const sizeOptions = ['S', 'M', 'L'];

const TOKEN =
	'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE1NjI1NzI0NjQsImV4cCI6MTU5NDEwODQ2OSwiYXVkIjoid3d3LnN0dWRlbnRzLjJoYXRzLmNvbS5hdSIsInN1YiI6InVzZXJAMmhhdHMuY29tLmF1IiwiR2l2ZW5OYW1lIjoiSm9obiIsIlN1cm5hbWUiOiJTbm93IiwiRW1haWwiOiJqb2huc25vd0AyaGF0cy5jb20uYXUiLCJSb2xlIjoiSmFuaXRvciJ9.BEEqb2ihfP0ec8TBu91T9lk0kcBKpz1NkJv4PpyjxdE';

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

function checkStringInt(str) {
	const regex = new RegExp('^[1-9][0-9]*$');
	return check.nonEmptyString(str) && check.match(str, regex);
}

function validItem(item) {
	const obj = check.map(item, {
		type: check.nonEmptyString,
		color: check.nonEmptyString,
		size: s => check.contains(sizeOptions, s),
		stock: checkPositiveInteger,
	});
	return check.all(obj);
}

function validOrder(order) {
	const obj = check.map(order, {
		id: checkStringInt,
		itemId: checkStringInt,
		quantity: checkPositiveInteger,
	});
	return check.all(obj);
}

exports.validToken = validToken;
exports.isItems = isItems;
exports.checkPositiveInteger = checkPositiveInteger;
exports.checkStringInt = checkStringInt;
exports.validItem = validItem;
exports.validOrder = validOrder;
