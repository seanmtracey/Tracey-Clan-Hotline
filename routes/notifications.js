const debug = require('debug')('routes:notifications');
const express = require('express');
const router = express.Router();
const 

const webPush = require('web-push');
webPush.setGCMAPIKey(process.env.GCM_API_KEY);

// VAPID keys should only be generated only once. 
const vapidKeys = webPush.generateVAPIDKeys();
 
webPush.setVapidDetails(
	`mailto:${process.env.VAPID_EMAIL_CONTACT}`,
	process.env.VAPID_PUBLIC_KEY || vapidKeys.publicKey,
	process.env.VAPID_PRIVATE_KEY || vapidKeys.privateKey
);

const base64VapidPublicKey = new Buffer(process.env.VAPID_PUBLIC_KEY || vapidKeys.publicKey).toString('base64');

router.get('/get-public-key', (req, res, next) => {

    res.json({
        status : "ok",
        data : base64VapidPublicKey
    });

});

router.post('/register/:USER', (req, res, next) => {
    res.end();
});

module.exports = router;
