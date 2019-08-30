const myDb = require('../db/index.js');
const util = require('./util.js');
const { dbGet, dbRun, dbAll } = myDb;
const {
	isItems,
	checkStringInt,
	checkPositiveInteger,
	formatInterfaceOrder,
	validPostOrderBody,
} = util;
function getOrders(db) {
	return async (req, res, next) => {
		try {
			const q = 'SELECT id, itemId, quantity from order_table';
			const rows = await dbAll(db, q, []);
			res.json({
				success: true,
				items: rows.map(formatInterfaceOrder),
			});
		} catch (error) {
			console.error(error);
			res.status(500);
			res.json({ sucess: false });
		}
	};
}

function getOrder(db) {
	return async (req, res, next) => {
		try {
			const { id } = req.params;
			if (!checkStringInt(id)) {
				res.status(400);
				res.json({
					success: false,
					message: 'Invalid request',
				});
				return;
			}

			const q =
				'SELECT id, itemId, quantity from order_table WHERE id = ? LIMIT 1';
			const row = await dbGet(db, q, [id]);

			if (row) {
				res.json({
					success: true,
					items: formatInterfaceOrder(row),
				});
			} else {
				res.status(404);
				res.json({
					success: false,
					message: 'Item could not be found',
				});
			}
		} catch (error) {
			console.error(error);
			res.status(500);
			res.json({ success: false });
		}
	};
}

function postOrder(db) {
	return async (req, res, next) => {
		try {
			const { body } = req;
			if (!validPostOrderBody(body)) {
				res.status(400);
				res.json({
					success: false,
					message: 'Invalid request',
				});
				return;
			}

			const { itemId, quantity } = body;

			if (!checkStringInt(itemId)) {
				res.status(404);
				res.json({
					success: false,
					message: 'Item could not be found',
				});
				return;
			}

			const row = await dbGet(db, 'SELECT stock from item where id = ?', [
				itemId,
			]);

			if (!row) {
				res.status(404);
				res.json({
					success: false,
					message: 'Item could not be found',
				});
				return;
			}

			if (row.stock < quantity) {
				res.status(400);
				res.json({
					success: false,
					message: 'Item does not have enough stock',
				});
				return;
			}

			db.serialize(async function() {
				try {
					db.run('BEGIN');
					const { lastID } = await dbRun(
						db,
						'INSERT INTO order_table(itemId, quantity) values (?,?)',
						[itemId, quantity],
					);
					await dbRun(
						db,
						'UPDATE item SET stock = stock - ? where id = ?',
						[quantity, itemId],
					);
					const order = await dbGet(
						db,
						'SELECT id, itemId, quantity from order_table where id = ?',
						[lastID],
					);
					db.run('COMMIT');
					res.json({
						success: true,
						order: formatInterfaceOrder(order),
					});
				} catch (error) {
					res.status(500);
					res.json({ success: false });
				}
			});
		} catch (error) {
			console.error(error);
			res.status(500);
			res.json({ success: false });
		}
	};
}

exports.getOrders = getOrders;
exports.getOrder = getOrder;
exports.postOrder = postOrder;
