const debug = require('debug')("routes:users");
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const users = require(`${__dirname}/../bin/lib/users`);

router.post('/login', (req, res, next) => {

	const user = req.body.name;
	const pass = req.body.password;

	users.get.byName(user)
		.then(data => {
			debug('User Data:', data);

			if(!data){
				res.status(401);
				res.end();
			} else {

				const storedPassword = data.password;

				bcrypt.compare(pass, storedPassword, function(err, match) {

					if(err){
						res.status(500);
						debug('bcrypt err:', err);
					}

					console.log('Matching?', match);

					if(match){
						req.session = {};
						req.session.user = req.body.name;
						debug('account req.session:', req.session);
						res.redirect('/directory');
					} else {
						res.status(401);
						res.redirect('/');
					}

				});

			}

		})
	;

});

router.get('/logout', (req, res, next) => {

	req.session = null;
	res.redirect('/');

});

module.exports = router;
