var sqlite3 = require('sqlite3').verbose();
const express = require('express');
const dbConfig = require('./db/index.js');
const test = require('./test/initTable.js');
const item = require('./src/item.js');
const order = require('./src/order.js');
const app = express();
const port = 3000;

var db = new sqlite3.Database(':memory:');
dbConfig.createTables(db);
test.initialTables(db);

// app.get('/', (req, res) => res.send('Hello World!'));
app.get('/items', item.getItems(db));
app.get('/item/:id', item.getItem(db));
app.get('/orders', order.getOrders(db));
app.get('/order/:id', order.getOrder(db));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
