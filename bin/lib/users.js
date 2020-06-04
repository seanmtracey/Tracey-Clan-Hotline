const debug = require('debug')("bin:lib:users");
const database = require('./database');

function getListOfUsers(){
    
    return database.query({
            "selector": {
                "uuid": {
                    "$exists": true
                }
            }
        }, process.env.USERS_DATABASE_NAME)
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

function getSpecificUserById(uuid){

    return database.query({
            "selector" : {
                "uuid" : uuid
            }
        }, process.env.USERS_DATABASE_NAME)
        .then(documents => {
            return documents[0];
        })    
    ;

}

function getSpecificUserByName(name){

    return database.query({
            "selector" : {
                "name" : name
            }
        }, process.env.USERS_DATABASE_NAME)
        .then(documents => {
            return documents[0];
        })    
    ;

}

function addUserToDatabase(userData){

    return database.add(userData, process.env.USERS_DATABASE_NAME)
        .catch(err => {
            debug(err);
            throw err;
        })
    ;

}

function deleteUserFromDatabase(uuid){

    return getSpecificUserById(uuid)
        .then(user => {
            return database.delete(user._id, user._rev, process.env.USERS_DATABASE_NAME);
        })
        .catch(err => {
            debug('err:', err);
            throw error;
        })
    ;

}

function updateUserInDatabase(uuid, newData){

    debug(uuid, newData);
    
    return getSpecificUserById(uuid)
        .then(userData => {

            debug(userData);

            Object.keys(newData).forEach(key => {
                userData[key] = newData[key];
            });

            debug('updated user data:', userData);
            debug(process.env.USERS_DATABASE_NAME);

            return database.update(userData, process.env.USERS_DATABASE_NAME);

        })
        .catch(err => {
            debug(err);
            throw err;
        })
    ;

}

module.exports = {
    list : getListOfUsers,
    get : {
       byID : getSpecificUserById,
       byName : getSpecificUserByName
    },
    add : addUserToDatabase,
    delete : deleteUserFromDatabase,
    update : updateUserInDatabase
};