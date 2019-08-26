const myDb = require('../db/index.js');
const { dbGet, dbRun, dbAll } = myDb;
const util = require('./util.js');
const { isItems } = util;

function getItems(db) {
	return async (req, res, next) => {
		try {
			const q = 'SELECT * from item';
			const rows = await dbAll(db, q, []);
			res.json({
				success: true,
				items: rows,
			});
		} catch (error) {
			next(error);
		}
	};
}

function getItem(db) {
	return async (req, res, next) => {
		try {
			const { id } = req.params;
			const q = 'SELECT * from item WHERE id = ? LIMIT 1';
			const row = await dbGet(db, q, [id]);

			if (row) {
				res.json({
					success: true,
					items: row,
				});
			} else {
				res.json({
					success: false,
					message: 'Item could not be found',
				});
			}
		} catch (error) {
			next(error);
		}
	};
}

function postItems(db) {
	return async (req, res, next) => {
		try {
			const { items } = req.body;
			if (!items || !isItems(items)) {
				res.json({ success: false, message: 'Invalid request' });
				return;
			}

			const q =
				'INSERT INTO item(type, color, size, stock) values (?, ?, ?, ?)';
			db.serialize(async function() {
				try {
					const promises = [];
					items.forEach(item => {
						const { type, color, size, stock } = item;
						promises.push(dbRun(db, q, [type, color, size, stock]));
					});
					const inserts = await Promise.all(promises);
					res.json({
						success: true,
						itemIds: inserts.map(v => v.lastID.toString()),
					});
				} catch (error) {
					res.json({
						success: false,
						message: 'One (or more) items are invalid',
					});
				}
			});
		} catch (error) {
			next(error);
		}
	};
}

exports.getItems = getItems;
exports.getItem = getItem;
exports.postItems = postItems;
