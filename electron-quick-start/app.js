const path = require("path");

// ELECTRON-EXPRESS-QUICK-START: allows server.js to load when electron is ready
module.exports = () => {
  const express = require("express");
  const app = express();
  const port = 3000;

  // can load files in the same directory as server.js
  console.log(__dirname);

  app.get("/", (req, res) => res.send(`ExpressJS on http://localhost:${port}`));

  app.get('/status', (request, response) => {
    const status = {
       "Status": "Running"
    };
    
    response.send(status);
 });
 app.get('/next', (request, response) => {
    const status = {
       "Status": "Second page is running"
    };
    
    response.send(status);
 });

  app.listen(port, () =>
    console.log(`server.js app listening on port ${port}!`)
  );
};