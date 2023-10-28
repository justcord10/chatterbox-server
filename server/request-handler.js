// These headers will allow Cross-Origin Resource Sharing (CORS).
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS', //should test with removing PUT DELETE and OPTIONS
  'access-control-allow-headers': 'content-type, accept, authorization',
  'access-control-max-age': 10 // Seconds.
};
//will push a message here on POST
var messages = [];

var requestHandler = function(request, response) {
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  // The outgoing status.
  // var statusCode = 200;

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;

  if (request.url === '/classes/messages') {
    if (request.method === 'GET') {
      //set headers
      headers['Content-Type'] = 'application/json';
      //write the headers using writeHead
      response.writeHead(200, headers);
      //attach the messages to the body
      response.end(JSON.stringify(messages));
    //what to do if its a POST Request
    } else if (request.method === 'POST') {
      //create an empty body string,
      var bodyString = '';
      //since data stream comes in one by one as a string, put in an array, concat to a string and store in our empty body string
      request.on('data', function (chunk) {
        // bodyString = bodyString.concat('', chunk);
        bodyString += chunk;
      });
      //when our data stream ends
      request.on('end', function () {
        //JSON parse this body string
        var message = JSON.parse(bodyString);
        //push onto the messages array
        messages.push(message);
        //set response headers (if problems might need to move this next section of code outside this on function call)
        headers['Content-Type'] = 'application/json';
        //write the headers to the heasd with the status code
        response.writeHead(201, headers);
        //send our status code back //might need to send something else back
        response.end();
      });
      //need to have another response end here?
    //if method receive is not GET or POST
    } else {
      //
      headers['Content-Type'] = 'application/json';
      //write the headers to the head with the status code
      response.writeHead(405, headers);
      response.end('response end for not allowed methods');
    }
  //if the URL is incorrect.
  } else {
    response.writeHead(404, headers);
    response.end('response end for invalid URL');
  }

};

//exports.messages = messages; //if works see what happens if we remove.
exports.requestHandler = requestHandler;

// Request and Response come from node's http module.
//
// They include information about both the incoming request, such as
// headers and URL, and about the outgoing response, such as its status
// and content.
//
// Documentation for both request and response can be found in the HTTP section at
// http://nodejs.org/documentation/api/

// Do some basic logging.
//
// Adding more logging to your server can be an easy way to get passive
// debugging help, but you should always be careful about leaving stray
// console.logs in your code.

// Make sure to always call response.end() - Node may not send
// anything back to the client until you do. The string you pass to
// response.end() will be the body of the response - i.e. what shows
// up in the browser.
//
// Calling .end "flushes" the response's internal buffer, forcing
// node to actually send all the data over to the client.
//response.end('Hello, World!');
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
// // Tell the client we are sending them plain text.
// headers['Content-Type'] = 'text/plain';

// // .writeHead() writes to the request line and headers of the response, // which includes the status and all headers.
// response.writeHead(statusCode, headers);


// // Calling .end "flushes" the response's internal buffer, forcing
// // node to actually send all the data over to the client.
// response.end('Hello, World!');