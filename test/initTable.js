const mockItemData = [
	['sporty', 'red', 'S', 2],
	['sporty', 'blue', 'M', 1],
	['sporty', 'red', 'M', 5],
	['tshirt', 'blue', 'S', 2],
	['tshirt', 'red', 'S', 7],
	['tshirt', 'red', 'L', 1],
];

const mockOrderData = [['1', 2], ['1', 3], ['5', 4]];

function initialTables(db) {
	db.serialize(function() {
		// db.run('DROP TABLE ITEM');
		// db.run('DROP TABLE ORDER_TABLE');

		const insertItem = db.prepare(
			'INSERT INTO ITEM( type, color, size, stock) VALUES ( ?, ?, ?, ?)',
		);

		mockItemData.forEach(d => {
			insertItem.run(d);
		});

		insertItem.finalize();

		const insertOrder = db.prepare(
			'INSERT INTO order_table( itemId, quantity) VALUES ( ?, ?)',
		);

		mockOrderData.forEach(d => {
			insertOrder.run(d);
		});

		insertOrder.finalize();

		db.each('SELECT * from item', function(err, row) {
			console.log(row);
		});

		db.each('SELECT * from order_table', function(err, row) {
			console.log(row);
		});
	});
	return db;
}

exports.initialTables = initialTables;
