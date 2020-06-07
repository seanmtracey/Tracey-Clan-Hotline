const debug = require('debug')("routes:index");
const express = require('express');
const router = express.Router();

const checkSession = require(`${__dirname}/../bin/lib/check-session`);

/* GET home page. */
router.get('/', (req, res, next) => {
	
	debug('index req.session:', req.session);

	if(req.session.user){
		res.redirect('/directory');
	} else {
		res.render('index', { title: 'Login' });
	}

});

router.get('/directory', [checkSession], (req, res, next) => {
	debug('directory req.session:', req.session);
	res.render('directory', { title: 'Directory', user: req.session.user, bodyid: "directory" });
});

module.exports = router;
