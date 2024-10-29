const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const livereload = require("livereload");
const connectLivereload = require("connect-livereload");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(connectLivereload());
app.use(express.static(path.join(__dirname, "../public")));

// Start the livereload server to watch public folder
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, "public"));

// Notify browser of changes
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

// TODO - MAKE SURE TO REMOVE SERVER HOST FROM RESPONSE, GOOD FOR NOW BUT IN FUTURE ONLY INCLUDE INFORMATION THAT IS DISPLAYED IN FRONTEND
app.get("/api/serverStatus", (req, res) => {
  const mcs = require("node-mcstatus");

  const host = process.env.MC_HOST;
  const port = process.env.MC_PORT;
  const options = { query: true };

  // The `port` argument is optional and defaults
  // to 25565. The `options` argument is optional.
  mcs
    .statusJava(host, port, options)
    .then((result) => {
      // `result` will be the same shape and
      // properties as what is documented on
      // our website.
      // https://mcstatus.io/docs#java-status
      res.json(result);
    })
    .catch((error) => {
      // If the server is offline, then
      // you will NOT receive an error here.
      // Instead, you will use the `result.online`
      // boolean values in `.then()`.
      // Receiving an error here means that there
      // was an error with the service itself.
      res.json({ message: error });
    });
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
