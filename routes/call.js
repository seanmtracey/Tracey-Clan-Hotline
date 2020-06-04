const debug = require('debug')('routes:call');
const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/:ROOM_ID', (req, res, next) => {
  
  res.render('call', { 
    title: `Call with ${req.params.ROOM_ID}` 
  });

});

module.exports = router;
