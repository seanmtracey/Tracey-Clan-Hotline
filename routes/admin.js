const debug = require('debug')('routes:admin');
const express = require('express');
const router = express.Router();

const users = require(`${__dirname}/../bin/lib/users`);

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('admin', { title: 'Manage Users' });
});

router.post('/add-user', (req, res, next) => {

    

});

module.exports = router;
