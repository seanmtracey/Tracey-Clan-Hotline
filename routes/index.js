const debug = require('debug')("routes:index");
const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
	res.render('index', { title: 'Express' });
});

router.get('/directory', (req, res, next) => {
	res.render('directory', { title: 'Directory', user: req.session.user, bodyid: "directory" });
});

module.exports = router;
