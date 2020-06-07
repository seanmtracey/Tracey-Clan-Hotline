require('dotenv').config();

const debug = require('debug')('bin:lib:send_text');
const Nexmo = require('nexmo');

const nexmo = new Nexmo({
    apiKey: process.env.NEXMO_API_KEY,
    apiSecret: process.env.NEXMO_API_SECRET,
    applicationId: process.env.NEXMO_APP_ID
  }, { debug : true });

function sendMessage(message, recipient){

    if(!recipient){
        return Promise.reject("No recipient was passed.");
    } else if(!message){
        return Promise.reject("No message was passed.");
    } else {

        return new Promise( (resolve, reject) => {
    
            nexmo.message.sendSms("Tracey Clan Hotline", recipient, message, (err, responseData) => {
                if (err) {
                    debug(err);
                } else {
                    if(responseData.messages[0]['status'] === "0") {
                        debug("Message sent successfully.");
                    } else {
                        debug(`Message failed with error: ${responseData.messages[0]['error-text']}`);
                    }
                }
            });
    
        } );

    }


}

module.exports = sendMessage;