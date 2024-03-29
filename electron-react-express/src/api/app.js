const path = require("path");
const cors = require('cors');
 
// ELECTRON-EXPRESS-QUICK-START: allows app.js to load when electron is ready
module.exports = () => {
  const express = require("express");
  const app = express();
  const corsOptions = {
    origin: 'http://localhost:1212',
  };
  app.use(cors(corsOptions));
  const port = 9100;
 
  // can load files in the same directory as app.js
  console.log(__dirname);
 
  app.get("/getVersion", (req, res) => {
    const response = {
        "expressPort": `${port}`
    };
    res.send(response);
  });
 
  app.get('/status', (request, response) => {
    const status = {
       "response": `Express is running on ` + `${port}`
    };
     
    response.send(status);
 });
 
  app.listen(port, () =>
    console.log(`server.js app listening on port ${port}!`)
  );
};