const debug = require('debug')('bin:lib:check-session');

function checkCreds(req, res, next) {
    
    console.log("checkCreds:", req.session);
    debug('check req.session:', req.session);
    if(!req.session.user){
        res.redirect('/')
    } else {
        next();
    }

}

module.exports = checkCreds;