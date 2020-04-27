const debug = require('debug')("bin:lib:users");
const database = require('./database');

function getListOfUsers(){
    
    return database.query({
            "selector": {
                "uuid": {
                    "$exists": true
                }
            }
        }, process.env.DEFAULT_DB_NAME)
        .then(results => {
            debug(results);
            return results;
        })
        .catch(err => {
            debug(err);
            throw err;
        })
    ;

}

function getSpecificUser(uuid){

    return database.query({
            "selector" : {
                "uuid" : uuid
            }
        }, process.env.DEFAULT_DB_NAME)
        .then(documents => {
            return documents[0];
        })    
    ;

}

function addUserToDatabase(userData){

    return database.add(userData, process.env.DEFAULT_DB_NAME)
        .catch(err => {
            debug(err);
            throw err;
        })
    ;

}

function deleteUserFromDatabase(){

}

function updateUserInDatabase(uuid, newData){

    debug(uuid, newData);

    return getSpecificUser(uuid)
        .then(userData => {

            debug(userData);

            Object.keys(newData).forEach(key => {
                userData[key] = newData[key];
            });

            debug('updated user data:', userData);
            debug(process.env.DEFAULT_DB_NAME);

            return database.update(userData, process.env.DEFAULT_DB_NAME);

        })
        .catch(err => {
            debug(err);
            throw err;
        })
    ;

}

module.exports = {
    list : getListOfUsers,
    get : getSpecificUser,
    add : addUserToDatabase,
    delete : deleteUserFromDatabase,
    update : updateUserInDatabase
};