function createTables(db) {
	db.serialize(function() {
		db.run(`
            CREATE TABLE ITEM (
                id text primary key,
                type text,
                color text,
                size size_type,
                stock int,
                CHECK(size in ('S', 'M', 'L')), 
                UNIQUE(type, color, size)
            );
        `);

		db.run(`
            CREATE TABLE ORDER_TABLE (
                id text primary key,
                itemId string,
                quantity int,
                FOREIGN KEY(itemId) REFERENCES ITEM(id)
            );
        `);
	});
	return db;
}

exports.createTables = createTables;
