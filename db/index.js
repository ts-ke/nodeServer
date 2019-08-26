function createTables(db) {
	db.serialize(function() {
		db.run(`
            CREATE TABLE ITEM (
                id integer primary key AUTOINCREMENT,
                type text,
                color text,
                size size_type,
                stock integer,
                CHECK(size in ('S', 'M', 'L')), 
                UNIQUE(type, color, size)
            );
        `);

		db.run(`
            CREATE TABLE ORDER_TABLE (
                id integer primary key AUTOINCREMENT,
                itemId integer,
                quantity integer,
                FOREIGN KEY(itemId) REFERENCES ITEM(id)
            );
        `);
	});
	return db;
}

function dbAll(db, q, params) {
	return new Promise((resolve, reject) => {
		db.all(q, params, (err, rows) => {
			if (err) {
				reject(err);
			}
			resolve(rows);
		});
	});
}

function dbGet(db, q, params) {
	return new Promise((resolve, reject) => {
		db.get(q, params, (err, row) => {
			if (err) {
				reject(err);
			}
			resolve(row);
		});
	});
}

function dbRun(db, q, params) {
	return new Promise((resolve, reject) => {
		db.run(q, params, function(err) {
			if (err) {
				reject(err);
			}
			resolve(this);
		});
	});
}

exports.createTables = createTables;
exports.dbAll = dbAll;
exports.dbGet = dbGet;
exports.dbRun = dbRun;
