const debug = require('debug')('routes:call');
const express = require('express');
const router = express.Router();
const users = require(`${__dirname}/../bin/lib/users`);
const sendText = require(`${__dirname}/../bin/lib/send_text`)

/* GET home page. */
router.get('/:ROOM_ID', (req, res, next) => {
  
  users.get.byName(req.params.ROOM_ID)
    .then(data => {
      debug(data);


      if(req.session.user === "Mum"){
        const SMS_MSG = `Mum has started a video call with you on the Tracey Clan Hotline.\n\nTo join the call go to:\n\nhttps://tracey-clan-hotline.eu-gb.mybluemix.net/call/${req.params.ROOM_ID}`;
        sendText(SMS_MSG, data.number);
      }

      
      res.render('call', { 
        title: `Call with ${req.params.ROOM_ID}` 
      });


    })
    .catch(err => {
      debug(`Room err: ROOM_ID = "${req.params.ROOM_ID}"`, err);
      res.status(500);
      res.end();
    })
  ;


});

module.exports = router;
