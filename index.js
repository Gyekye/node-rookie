//** Root of our node application */

//* We will need to import the build in HTTP api for node

//* Importing it with @param 'require'

const http = require("http");
const url = require("url");

// creating a server

const server = http.createServer((request, response) => {
    const parsedUrl = url.parse(request.url, true);
    //response.write(`${parsedUrl}`)
    console.log(parsedUrl);
    response.end("Ended my request");
});

server.listen(3000, () => { console.log("Listening on port 3000")});