var express = require('express');
const axios = require('axios');
var cors = require('cors');
var bodyParser = require('body-parser');
const CLIENT_ID = "32546184958a4dc42e5b";
const CLIENT_SECRET = "1fa7f42d182f3d632531196ff288e8c46be59ac1";


var app = express();

const corsOptions = {
    origin: 'http://localhost:5173',
  };
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

//code passed from frontend
app.get('/getAccessToken', async function (req, res) {
    const params = "?client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET + "&code=" + req.query.code;

    axios.post("https://github.com/login/oauth/access_token" + params, {}, {headers: {
        "Accept": "application/json"
      }}).then(response => {
        res.json(response.data);
      })
      .catch(error => {
        console.log(error);
      });
})

//get user dat
//access token as authorization header

app.get("/getUserDetails", async function(req, res) {
    axios.get("https://api.github.com/user", {headers: {
        Authorization: req.get("Authorization"),
      }}).then(response => {
        res.json(response.data);
      })
      .catch(error => {
        res.statusMessage = 'Unauthorized';
        res.statusCode = 401;
        res.json(error);
      });
})

app.get("/getRepos", async function(req, res) {
    const query = `query searchRepositories(
        $search: String!
    ) {
        viewer {
            repositories(first: 100, orderBy: { field: UPDATED_AT, direction: DESC }) {
                nodes {
                    nameWithOwner
                    description
                    url
                    parent {
                        nameWithOwner
                    }
                    stargazerCount
                }
            }
        }
        search(first: 100, query: $search, type: REPOSITORY) {
            nodes {
                ...on Repository {
                    nameWithOwner
                    description
                    url
                    parent {
                        nameWithOwner
                    }
                    stargazerCount
                }
            }
        }
    }`;
    const result = [];

    let payload = {query: query, variables: {search: "sort:updated fork:true"} };
    let headers = {headers: { Authorization: req.get("Authorization"), 'content-type': 'text/json' }};

    axios.post("https://api.github.com/graphql", payload, headers).then(response => {
        let responseData = response.data;
        for( let node of responseData.data.viewer.repositories.nodes){
            result.push(node.nameWithOwner);
        }
        res.json(result);
      })
      .catch(error => {
        console.log(error);
      });
});

app.get("/getFiles" , async function(req, res) {
    const result = [];
    
    axios.get("https://api.github.com/repos/" + req.query.name + "/git/trees/main?recursive=1", {headers: {
        Authorization: req.get("Authorization"),
      }}).then(response => {
        let data = response.data;
        for(let tree of data.tree){
            result.push({name:tree.path, url:tree.url, sha:tree.sha, type:tree.type});
        }
        res.json(result);
      })
      .catch(error => {
        console.log(error);
      });
})

app.get("/getFileContent", async function(req, res){
    axios.get(req.query.name, {headers: {
        Authorization: req.get("Authorization"),
      }}).then(response => {
        res.json(response.data.content);
      })
      .catch(error => {
        console.log(error);
      });
});


app.post("/pushChanges", async function(req, res){
    
    let oid;
    let reqBody = req.body;

    let query = `query getBranch(
        $owner: String!
        $repo: String!
        $qualifiedName: String!
    ) {
        repository(owner: $owner, name: $repo) {
            ref(qualifiedName: $qualifiedName) {
                name
                target {
                    oid
                    commitUrl
                }
                refUpdateRule {
                    viewerCanPush
                    requiredApprovingReviewCount
                }
            }
        }
    }`;

    const qualifiedName = "refs/heads/main";
    let variables = {owner: reqBody.owner, qualifiedName: qualifiedName, repo: reqBody.repoName};

    let payload = {query: query, variables: variables };
    let headers = {headers: {Authorization: req.get("Authorization"),'content-type':'application/json'}};

    await axios.post("https://api.github.com/graphql", payload, headers)
    .then(response => {
        let responseData = response.data;
        oid = responseData.data.repository.ref.target.oid;
      })
      .catch(error => {
        res.statusMessage = 'Bad request';
        res.statusCode = 400;
        res.json(error);
      });

    query = `mutation CreateCommitOnBranch ($commitInput: CreateCommitOnBranchInput!) {
        createCommitOnBranch(input: $commitInput) {
            commit {
                oid
            }
            ref {
                name
            }
        }
    }`

    variables = {
        commitInput: {
            branch: {
                branchName: "main",
                repositoryNameWithOwner: reqBody.owner + "/" + reqBody.repoName,
            },
            message: {
                headline: reqBody.commitMessage
            },
            expectedHeadOid: oid,
            fileChanges: {
                additions: reqBody.changedFileDetails,
                deletions: []
            }
            
        }
    };

    payload = {query: query, variables: variables };
    headers = {headers: {Authorization: req.get("Authorization"),'content-type':'application/json'}};

    axios.post("https://api.github.com/graphql", payload, headers)
    .then(response => {
        res.json(response.data);
      })
      .catch(error => {
        res.statusMessage = 'Bad request';
        res.statusCode = 400;
        res.json(error);
      });
});

module.exports = app;