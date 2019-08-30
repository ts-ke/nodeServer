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

const { validateUser, logRequestStart } = standard;
//for testing
// test.initialTables(db);

app.use(bodyParser.json());
app.get('/items', [logRequestStart, item.getItems(db)]);
app.get('/item/:id', [logRequestStart, item.getItem(db)]);
app.get('/orders', [logRequestStart, order.getOrders(db)]);
app.get('/order/:id', [logRequestStart, order.getOrder(db)]);
app.post('/orders', [logRequestStart, order.postOrder(db)]);
app.post('/items', [logRequestStart, validateUser, item.postItems(db)]);
app.patch('/item/:id', [logRequestStart, validateUser, item.patchItem(db)]);
app.delete('/item/:id', [logRequestStart, validateUser, item.deleteItem(db)]);

var privateKey = fs.readFileSync('sslcert/key.pem', 'utf8');
var certificate = fs.readFileSync('sslcert/certificate.pem', 'utf8');
var credentials = { key: privateKey, cert: certificate };
https
	.createServer(credentials, app)
	.listen(port, () => console.log(`App listening on port ${port}!`));
