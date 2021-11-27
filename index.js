//** Root of our node application */

//* We will need to import the build in HTTP api for node

//* Importing it with @param 'require'

const  env      = require("./config");
const  http     = require("http");
const  https    = require("https");
const  url      = require("url");
const fileSys   = require("fs");
const  stringDecoder = require("string_decoder").StringDecoder;






//====================== HTTP SERVER ====================

// creating a server
const httpServer = http.createServer((request, response) => {

    // calling the { MainServer } to create an http Server
    mainServer(request,response);
});

// Server listens on port 5000 for requests ten triiger createSever method.
httpServer.listen(env.httpPort, () => {

    console.log("Listening on port "+env.httpPort+ " "+env.envName)

});

//=====================END OF HTTP SERVER====================









//====================== HTTPS SERVER ====================

//** Reading the config files { cert } and { key } for the https Server */

const httpsServerOptions = {
    'cert': fileSys.readFileSync("./https/cert.pem"),
    'key':fileSys.readFileSync("./https/key.pem"),
}

// creating a server
const httpsServer = https.createServer(httpsServerOptions, (request,response) =>{

    // calling the { mainServer } to create an https Server
    mainServer(request, response);
});

// Server listens on port 5000 for requests ten triiger createSever method.
httpsServer.listen(env.httpsPort, () => {

    console.log("Listening on port "+env.httpsPort+ " "+env.envName)

});

//=====================END OF HTTPS SERVER====================











//=============== ROUTERS ====================

// Defining Router Handlers
const routeHandlers = {

    // method to handle the { sample } route.
    sampleHandler:(data,callback)=>{
        callback(200, {"name":"sample Handler Here."});
    },


    //method to handle ping route
    pingHandler:(data,callback) =>{
        callback(200, {"server":"Server is up and running"});
    },


    // method to handle 404: no route found.
    notFoundHandler:(data,callback)=>{
       callback(404,{"error": "Not Found"});
    },
};


// destructuring { routeHandlers }
const { sampleHandler, pingHandler, notFoundHandler } = routeHandlers;


// Router Request
const routes = {
    "sample":sampleHandler,
    "ping":pingHandler,
};

// ===================== END OF ROUTERS ================















///*** Main Server Logic */
const mainServer = (request,response) => {

    //? Main Server { irrespective of http or https }
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

        //** Directing the {trimmedPathNAme } to it's correct handler */
        const correctHandler = typeof(routes[trimmedPathName]) !== "undefined" ? routes[trimmedPathName]: notFoundHandler;

        // Data to send to handler
        const data = {
            'headers': requestHeaders,
            'method': requestMethod,
            'trimmedPath':trimmedPathName,
            'queryStringObject':requestQueryObj,
            'payLoad':buffer,
        };

        //Routing Request to the specified Handler

        correctHandler(data, (statusCode,payLoad) =>{
            // status code called back by the handler.
            statusCode = typeof(statusCode) === "number" ? statusCode : 200;

            // payload called back by the handler.
            payLoad = typeof(payLoad) === "object" ? payLoad : {};

            //convert { payload } to a string to be able to send it to the user.
            const stringifiedPayLoad = JSON.stringify(payLoad);

            //send payload bacn to user
            response.setHeader("Content-Type","application/json");
            response.writeHead(statusCode);
            response.end(stringifiedPayLoad);

            // Other Handling Logic Goes here
            console.log(`Response returned with payload: `, stringifiedPayLoad);
        });

    });

};