const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');
const dbConfig = require('./db');
const test = require('./test/initTable.js');
const item = require('./src/item.js');
const order = require('./src/order.js');
const standard = require('./src/standard.js');
const config = require('./config.js');
const app = express();
const port = config.PORT;

var db = new sqlite3.Database(':memory:');
dbConfig.createTables(db);

//for testing
// test.initialTables(db);

app.use(bodyParser.json());
app.get('/items', item.getItems(db));
app.get('/item/:id', item.getItem(db));
app.get('/orders', order.getOrders(db));
app.get('/order/:id', order.getOrder(db));
app.post('/orders', order.postOrder(db));
app.post('/items', [standard.validateUser, item.postItems(db)]);
app.patch('/item/:id', [standard.validateUser, item.patchItem(db)]);
app.delete('/item/:id', [standard.validateUser, item.deleteItem(db)]);

var privateKey = fs.readFileSync('sslcert/key.pem', 'utf8');
var certificate = fs.readFileSync('sslcert/certificate.pem', 'utf8');
var credentials = { key: privateKey, cert: certificate };
https
	.createServer(credentials, app)
	.listen(port, () => console.log(`App listening on port ${port}!`));
