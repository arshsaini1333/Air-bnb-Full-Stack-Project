'use strict';

const fs = require('fs');
const path = require('path');

const mime = {
	'.png': 'image/png',
	'.ico': 'image/x-icon',
};

module.exports = (iconPath, pattern) => {
	if (!iconPath) throw new Error('Icon path was not provided.');

	iconPath = path.resolve(iconPath);
	pattern = pattern || /\/favicon\.(png|ico)$/;

	return (req, res, next) => {
		if (pattern.test(req.url)) {
			const ext = path.extname(iconPath);

			const maxAge = 12 * 24 * 60 * 60; // 12 days
			const now = new Date();
			const twelveDaysFromNow = new Date(now.getTime() + maxAge * 1000);

			res.set('Content-Type', mime[ext]);
			res.set('Cache-Control', `public, max-age=${maxAge}`);
			res.set('Expires', twelveDaysFromNow.toUTCString());

			const fileStream = fs.createReadStream(iconPath);
			fileStream.pipe(res);
		} else {
			next();
		}
	};
};