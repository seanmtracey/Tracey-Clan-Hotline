const debug = require('debug')("routes:users");
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const admin_auth = require(`${__dirname}/../bin/lib/admin_auth`);
const uuid = require('uuid/v4');

const saltRounds = process.env.SALT_ROUNDS || 10;

const users = require(`${__dirname}/../bin/lib/users`);

const UUIDRegex = `[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}`;

router.use(admin_auth);

router.post(`/update/:UUID(${UUIDRegex})`, (req, res, next) => {

	debug(req.body, req.params.UUID);

	const newName = req.body.name;
	const newPassword = req.body.password;

	const operations = [];

	if(newName){
		operations.push( Promise.resolve(newName) );
	} else {
		operations.push( Promise.resolve() );
	}

	if(newPassword){

		operations.push(bcrypt.hash(newPassword, saltRounds));

	} else {
		operations.push( Promise.resolve() );
	}

	Promise.all(operations)
		.then(ops => {
			
			debug('ops:', ops);

			const newUserData = {};

			if(ops[0]){
				newUserData.name = ops[0]
			}

			if(ops[1]){
				newUserData.password = ops[1];
			}

			debug(req.params.UUID, newUserData);

			return users.update(req.params.UUID, newUserData);

		})
		.then(function(){
			res.redirect('/admin');
		})
		.catch(err => {

			debug(err);
			res.status(500);
			next();

		})
	;

});

router.post(`/add`, [admin_auth], (req, res, next) => {

	if(req.body.name && req.body.password){

		bcrypt.hash(req.body.password, saltRounds)
			.then(passwordHash => {

				const userData = {
					name : req.body.name,
					password : passwordHash,
					uuid : uuid()
				};

				users.add(userData)
					.then(result => {
						debug(result);
						res.redirect('/admin');
					})
					.catch(err => {
						debug(err);
						res.status(500);
						next();
					})
				;

			})
		;

	} else {
		res.status(422);
		next();
	}

});

router.post(`/delete/:UUID(${UUIDRegex})`, (req, res, next) => {

	users.delete(req.params.UUID)
		.then(result => {
			debug(result);
			res.redirect('/admin');
		})
		.catch(err => {
			debug(err);
			res.status(500);
			next();
		})
	;

});

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
						req.session.user = req.body.name;
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
