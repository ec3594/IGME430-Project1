// pull in modules and files
const http = require('http');
const fs = require('fs');
const query = require('querystring');
const url = require('url');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

// set port
const port = process.env.PORT || process.env.NODE_PORT || 3000;

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
            jsonHandler.addCharacters(request, response);
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