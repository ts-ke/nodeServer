const TOKEN =
	'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE1NjI1NzI0NjQsImV4cCI6MTU5NDEwODQ2OSwiYXVkIjoid3d3LnN0dWRlbnRzLjJoYXRzLmNvbS5hdSIsInN1YiI6InVzZXJAMmhhdHMuY29tLmF1IiwiR2l2ZW5OYW1lIjoiSm9obiIsIlN1cm5hbWUiOiJTbm93IiwiRW1haWwiOiJqb2huc25vd0AyaGF0cy5jb20uYXUiLCJSb2xlIjoiSmFuaXRvciJ9.BEEqb2ihfP0ec8TBu91T9lk0kcBKpz1NkJv4PpyjxdE';

function validToken(token) {
	return token.substring(7) === TOKEN;
}

function isItems(items) {
	if (!Array.isArray(items)) {
		return false;
	}

	const isTrue = v => v;
	const sizeOptions = ['S', 'M', 'L'];
	const isSchema = r =>
		r.type && r.color && sizeOptions.includes(r.size) && r.stock;
	return items.map(isSchema).every(isTrue);
}

exports.validToken = validToken;
exports.isItems = isItems;
