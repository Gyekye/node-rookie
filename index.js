//** Root of our node application */

//* We will need to import the build in HTTP api for node

//* Importing it with @param 'require'

const  http     = require("http");
const  url      = require("url");
const stringDecoder = require("string_decoder").StringDecoder

// creating a server
const server = http.createServer((request, response) => {

    //** Get the request path and parse it */
    // the @param {true} : parses the request QueryStrings.
    const parsedUrl = url.parse(request.url, true);
    const pathName  = parsedUrl.pathname;

    // Trim the pathname to get rid of slashes for routing the request.
    const trimmedPathName =  pathName.replace(/^\/+|\/+$/g, '');


    //** Get the method on the Request */
    // the obj is converted to all CAPS to ensure consistency.
    const requestMethod = request.method.toUpperCase();


    //** Get the queryString on the incoming request as an Obj */
    // Since the queryString is on the @param {parsedUrl}, we wil get it from that variable.
    const requestQueryObj = parsedUrl.query;


    //** Get the Headers from the incoming Request*/
    const requestHeaders = request.headers;

    //** Get the request payLoad if any from the request */
    //
    const decoder = new stringDecoder("utf-8");
    let buffer = "";
    //add a listener to check if theres a data on the request.
    request.on("data",(data)=>{
        // appends the decoded bits of stream to { buffer }
        buffer += decoder.write(data);
    });

    //add a listener to check if bits streams coming in from the request has ended.
    request.on("end",() => {
        // ends the decoding of streams from the payLoad
        buffer += decoder.end();

        // Other Handling Logic Goes here
        console.log(`Request received with payload: `, buffer);
        response.end("Ended my request");
    });

});



// Server listens on port 8000 for requests ten triiger createSever method.
server.listen(8000, () => { console.log("Listening on port 8000")});