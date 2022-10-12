// const users = {};
const data = require('./../data/data.json');

//function to respond with a json object
const respondJSON = (request, response, status, object) => {
    response.writeHead(status, { 'Content-Type': 'application/json' });
    response.write(JSON.stringify(object));
    response.end();
};

//function to respond without json body
const respondJSONMeta = (request, response, status) => {
    response.writeHead(status, { 'Content-Type': 'application/json' });
    response.end();
};

//return users object as JSON
const getCharacters = (request, response) => {
    console.log(data.characters);
    const responseJSON = data.characters;

    respondJSON(request, response, 200, responseJSON);
};

//function to add a character from a POST body
const addCharacter = (request, response, body) => {
    //default json message
    const responseJSON = {
        message: 'Name, Job, and Personality are all required.',
    };

    //If any fields are missing, send back an error message as a 400 badRequest
    if (!body.name || !body.job || !body.personality) {
        responseJSON.id = 'missingParams';
        return respondJSON(request, response, 400, responseJSON);
    }

    //default status code to 204 updated
    let responseCode = 204;

    //If the character doesn't exist yet
    if (!users[body.name]) {

        //Set the status code to 201 (created) and create an empty user
        responseCode = 201;
        users[body.name] = {};
    }

    //add or update fields for this character's name
    users[body.name].name = body.name;
    users[body.name].job = body.job;
    users[body.name].personality = body.personality;

    //if response is created, then set our created message
    //and sent response with a message
    if (responseCode === 201) {
        responseJSON.message = 'Created Successfully';
        return respondJSON(request, response, responseCode, responseJSON);
    }
    // 204 has an empty payload, just a success
    // It cannot have a body, so we just send a 204 without a message
    // 204 will not alter the browser in any way!!!
    return respondJSONMeta(request, response, responseCode);
};

module.exports = {
    getCharacters,
    addCharacter,
};