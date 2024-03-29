
const express = require('express');
const bodyParser = require('body-parser');
const spectralCore = require("@stoplight/spectral-core");
const { Spectral, Document } = spectralCore;
const Parsers = require("@stoplight/spectral-parsers");
const { truthy } = require("@stoplight/spectral-functions");
const Yaml = require('js-yaml');
const {set} = require("express/lib/application");
const {Ruleset, Rule} = require("@stoplight/spectral-core");
const app = express();
const port = 3000;
app.use(bodyParser.json());
const documentsMap = new Map();
app.post('/store-document', (req, res) => {
    const requestBody = req.body.document;
    const myDocument = new Document(
        Yaml.dump(requestBody),
        Parsers.Yaml,
        "my-file",
    );
    documentsMap.set(req.body.docName, myDocument);

    res.send('Document stored in memory.');
});

app.post('/validate', (req, res) => {
    const requestBody = req.body.document;
    // const myDocument = new Document(
    //     Yaml.dump(requestBody) ,
    //     Parsers.Yaml,
    //     "my-file",
    // );
    const spectral = new Spectral();
    const ruleDetailsList = rulesetsMap.get(req.body.ruleName);
    console.log(ruleDetailsList);
    const ruleSet = {
        rules: {
            [req.body.ruleName] : {
                given: ruleDetailsList[0].path,
                message:ruleDetailsList[0].message,
                then: {
                    function: truthy,
                },
            },
        },
    }
    spectral.setRuleset(ruleSet);
    spectral.run(documentsMap.get(req.body.docName))
        .then(validationResult => {
            // Send validation result as response
            console.log(validationResult);
            res.json(validationResult);
        })
        .catch(error => {
            console.error("Validation error:", error);
            res.status(500).send("Internal server error");
        });
});
const rulesetsMap= new Map();

app.post('/ruleset', (req, res) => {
    const { ruleName, path, message } = req.body;
    const ruleDetails = {
        path,
        message
    };
    rulesetsMap.set(ruleName, [ruleDetails]);

    console.log(rulesetsMap.get(ruleName));
    res.send("value updated")
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
