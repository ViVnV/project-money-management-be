const express = require("express");
const bodyParser = require("body-parser"); // Import body-parser for parsing HTTP requests
require("dotenv").config(); // Import and configure environment variables from .env files
const app = express(); // Create an express app instance
const port = 3000; // Specifies the port on which the server will listen (in this case, port 3000)
const router = require("./router.js"); // Import router from router.js

// Use middleware body-parser to parse JSON from HTTP requests
app.use(bodyParser.json());
// Use middleware body-parser to parse URL-encoded data from HTTP requests
app.use(bodyParser.urlencoded({ extended: true })); 

// Use the imported routers to handle application routes
app.use(router);

// Runs the server and listens for requests on the specified port
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});