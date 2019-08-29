const check = require('check-types');
const myDb = require('../db/index.js');
const util = require('./util.js');
const { dbGet, dbRun, dbAll } = myDb;
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
			res.status(500);
			res.json({ success: false });
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
				res.status(404);
				res.json({
					success: false,
					message: 'Item could not be found',
				});
			}
		} catch (error) {
			res.status(500);
			res.json({ success: false });
		}
	};
}

function postItems(db) {
	return async (req, res) => {
		try {
			const { items } = req.body;

			if (!items || !isItems(items)) {
				res.status(400);
				res.json({ success: false, message: 'Invalid request' });
				return;
			}
			const q = `
			INSERT INTO item(type, color, size, stock) values (?, ?, ?, ?)
			ON CONFLICT(type, color, size) DO UPDATE SET stock = stock + ?
			`;

			const idQ =
				'select id from item where type = ? and color = ? and size = ?';

			db.serialize(async function() {
				try {
					db.run('BEGIN');
					const promises = [];
					for (const item of items) {
						const { type, color, size, stock } = item;
						const insert = await dbRun(db, q, [
							type,
							color,
							size,
							stock,
							stock,
						]);
						const { id } = await dbGet(db, idQ, [
							type,
							color,
							size,
						]);

						promises.push({
							id,
							changes: insert.changes,
						});
					}

					// const inserts = await Promise.all(promises);
					const inserts = promises;

					if (check.all(inserts.map(d => d.changes !== 0))) {
						db.run('COMMIT');
						res.json({
							success: true,
							itemIds: inserts.map(v => v.id.toString()),
						});
					} else {
						db.run('ROLLBACK');
						res.status(400);
						res.json({
							success: false,
							message: 'One (or more) items are invalid',
						});
					}
				} catch (error) {
					res.status(400);
					res.json({
						success: false,
						message: 'One (or more) items are invalid',
					});
				}
			});
		} catch (error) {
			db.run('ROLLBACK');
			res.status(500);
			res.json({ success: false });
		}
	};
}

function patchItem(db) {
	return async (req, res, next) => {
		try {
			const { id } = req.params;
			const { stock } = req.body;
			if (!id || !stock) {
				res.status(400);
				res.json({ success: false });
				return;
			}

			const q = 'UPDATE item SET stock = ? where id = ?';
			await dbRun(db, q, [stock, id]);
			res.json({ success: true });
		} catch (error) {
			res.status(500);
			res.json({ success: false });
		}
	};
}

function deleteItem(db) {
	return async (req, res, next) => {
		try {
			const { id } = req.params;
			if (!id) {
				res.status(400);
				res.json({ success: false });
				return;
			}
			const q = 'DELETE FROM item where id = ?';
			const result = await dbRun(db, q, [id]);

			if (result.changes === 0) {
				res.status(400);
				res.json({
					success: false,
					message: 'Item could not be found',
				});
				return;
			}

			res.json({ success: true });
		} catch (error) {
			res.status(500);
			res.json({ success: false });
		}
	};
}

exports.getItems = getItems;
exports.getItem = getItem;
exports.postItems = postItems;
exports.patchItem = patchItem;
exports.deleteItem = deleteItem;
