const express = require('express');
const favicon = require('../index.js');
const fs = require('fs');
const path = require('path');
const http = require('http');
const assert = require('assert');

const file = path.join(__dirname, 'favicon.png');
const port = process.env.PORT || 7860;

const app = express();
app.use(favicon(file));

function runTest() {
	const testRequest = http.get(`http://127.0.0.1:${port}/meow/computer-cat/favicon.png`, res => {
		const chunks = [];

		res.on('data', chunk => {
			chunks.push(chunk);
		});

		res.on('end', () => {
			const contentType = res.headers['content-type'];

			assert.equal(contentType, 'image/png', `Wrong mime type: ${contentType}`);
			const receivedBuffer = Buffer.concat(chunks);
			const expectedBuffer = fs.readFileSync(file);
			assert.ok(receivedBuffer.equals(expectedBuffer), 'Received data is not equal');

			console.info('Test passed.');
			closeServer();
		});
	});

	testRequest.on('error', err => {
		console.error('Error in HTTP request:', err);
		closeServer(1);
	});
}

const server = app.listen(port, () => {
	console.info(`Server is running on port ${port}.`);
	runTest();
});

function closeServer(exitCode = 0) {
	server.close(() => {
		console.info('Server closed.');
		process.exit(exitCode);
	});
}