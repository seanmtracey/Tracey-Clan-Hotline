const debug = require('debug')('routes:admin');
const express = require('express');
const router = express.Router();

const users = require(`${__dirname}/../bin/lib/users`);

/* GET home page. */
router.get('/', (req, res, next) => {

    users.list()
        .then(list => {
            
            res.render('admin', { 
                title : 'Manage Users',
                users : list 
            });

        })
        .catch(err => {
            debug(err);
            res.status(500);
            next();
        })
    ;


});

module.exports = router;
