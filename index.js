var sqlite3 = require('sqlite3').verbose();
const express = require('express');
var bodyParser = require('body-parser');
const dbConfig = require('./db/index.js');
const test = require('./test/initTable.js');
const item = require('./src/item.js');
const order = require('./src/order.js');
const standard = require('./src/standard.js');
const app = express();
const port = 3000;

var db = new sqlite3.Database(':memory:');
dbConfig.createTables(db);

//for testing
// test.initialTables(db);

// app.get('/', (req, res) => res.send('Hello World!'));
app.use(bodyParser.json());
app.get('/items', item.getItems(db));
app.get('/item/:id', item.getItem(db));
app.get('/orders', order.getOrders(db));
app.get('/order/:id', order.getOrder(db));
app.post('/orders', order.postOrder(db));
app.post('/items', [standard.validateUser, item.postItems(db)]);
app.patch('/item/:id', [standard.validateUser, item.patchItem(db)]);
app.delete('/item/:id', [standard.validateUser, item.deleteItem(db)]);

app.listen(port, () => console.log(`App listening on port ${port}!`));
