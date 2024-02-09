const express = require('express');
const favicon = require('./index.js');
const port = 3000;

const app = express();
app.use(favicon(__dirname + '/test/favicon.png'));

app.get('/', (req, res) => {
	res.send('<h1>Hello World!</h1>');
});

app.listen(port, () => {
	console.log(`Example app is ready on http://127.0.0.1:${port}`);
});