// pull in modules and files
const http = require('http');
const fs = require('fs');
const query = require('querystring');
const url = require('url');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

// set port
const port = process.env.PORT || process.env.NODE_PORT || 3000;

//handle POST requests
const handlePost = (request, response, parsedUrl) => {

    //If they go to /addUser
    if (parsedUrl.pathname === '/addCharacter') {

        //Call our below parseBody handler, and in turn pass in the
        //jsonHandler.addUser function as the handler callback function.
        parseBody(request, response, jsonHandler.addCharacter);
    }
};

//Recompiles the body of a request, and then calls the appropriate handler once completed
const parseBody = (request, response, handler) => {

    const body = [];

    request.on('error', (err) => {
        console.dir(err);
        response.statusCode = 400;
        response.end();
    });

    request.on('data', (chunk) => {
        body.push(chunk);
    });

    request.on('end', () => {
        const bodyString = Buffer.concat(body).toString();
        const bodyParams = query.parse(bodyString);

        handler(request, response, bodyParams);
    });
};

// randomly generate affirmations
const respond = () => {
    fetch('http://www.affirmations.dev/').then(res => res.json()).then(data => console.log(data));
}

const loadData = async() => {
    let obj = await fetch('https://reqres.in/api/users%27');
    let json = await obj.json();
    console.log(json.page);
    console.log(json.per_page);
    console.log(json.total);
    console.log(json.data[0]);
    console.log(json.data[0].id);
}

// or const asyncFunction = async function(){ // Old school function keyword? I like it! }

const onRequest = (request, response) => {
    const parsedUrl = url.parse(request.url);

    console.log("request: " + parsedUrl.pathname);

    // route to the functions according to the requested url
    switch (parsedUrl.pathname) {
        case '/':
            htmlHandler.getIndex(request, response);
            break;

        case '/style.css':
            htmlHandler.getStyle(request, response);
            break;

        case '/getCharacters':
            jsonHandler.getCharacters(request, response);
            break;

        case '/addCharacter':
            handlePost(request, response, parsedUrl);
            break;

        default:
            response.writeHead(200, { 'Content-Type': 'application/json' });
            // const res = fetch('https://reqres.in/api/users%27');
            //console.log("res: " + res);
            // const data = res.json();
            // console.log("data: " + data);

            // const data = fetch('https://reqres.in/api/users%27').then(res => res.json());
            //console.log(obj);
            //console.log(response);
            //loadData();
            response.end();
            break;

    }
}

http.createServer(onRequest).listen(port, () => {
    console.log(`Listening on port: ${port}`);
})