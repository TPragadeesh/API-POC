const express = require('express');
const { Spectral, Document } = require('@stoplight/spectral-core');
const Parsers =require('@stoplight/spectral-parsers');
const bodyParser = require('body-parser');
const fs = require('node:fs');
const fileURLToPath = require('node:url');
const path = require('node:path');
const { bundleAndLoadRuleset } = require("@stoplight/spectral-ruleset-bundler/with-loader");
const spectralRuntime =require('@stoplight/spectral-runtime');
const { fetch } = spectralRuntime;
const cors = require('cors');

const githubController = require('./github');

const app = express();
const corsOptions = {
  origin: 'http://localhost:5173',
};
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.use('', githubController);

app.post('/evaluateRule', (req, res) => {

  let reqBody = req.body;
  
  setRuleSet().then((spectral)=>{
    spectral.run(reqBody).then(results=>{
      let ruleResponse = [];
      for (const result of results) {
        let response = {
            ruleName: result.code,
            message: result.message,
            startLine: result.range.start.line + 1,
            endLine: result.range.end.line + 1,
            startColumn: result.range.start.character,
            endColumne: result.range.end.character,
            severity: result.severity,
        };
        ruleResponse.push(response);
      }
  
      res.json(ruleResponse);
    });
  }
  );
  
});

async function setRuleSet(){
  let spectral = new Spectral();
  try{
    spectral.setRuleset(await bundleAndLoadRuleset(path.join(__dirname, "/ruleset/.spectral.yaml"), { fs, fetch }));
    return spectral;
  }catch(error){
    console.log('Error: ' + error);
  }
  
}

app.listen(3000, () => console.log('API Studio backend listening on port 3000.'));
