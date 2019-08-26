function getOrders(db) {
	return (req, res) => {
		db.all('SELECT * from order_table', (err, rows) => {
			if (err) {
				throw new Error('selection failure');
			}

			res.json({
				success: true,
				items: rows,
			});
		});
	};
}

function getOrder(db) {
	return (req, res) => {
		db.all(
			'SELECT * from order_table WHERE id = ? LIMIT 1',
			[req.params.id],
			(err, rows) => {
				if (err) {
					throw new Error('selection failure');
				}
				if (rows.length === 1) {
					res.json({
						success: true,
						items: rows[0],
					});
				} else {
					res.json({
						success: false,
						message: 'Item could not be found',
					});
				}
			},
		);
	};
}

exports.getOrders = getOrders;
exports.getOrder = getOrder;
