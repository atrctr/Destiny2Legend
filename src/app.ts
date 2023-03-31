import express from 'express'
import { getDestinyMemberships as bungieGetDestinyMemberships } from './bungie';

require("dotenv").config()
const https = require('https')
const http = require('http')
const fs = require('fs')
const app = express()
const port = 3000

http.createServer(app).listen(80);
https.createServer(
    {
        key: fs.readFileSync('./server.key.pem'),
        cert: fs.readFileSync('./server.cert.pem')
    },
    app)
  .listen(443)

const BUNGIE_OAUTH_CLIENT_ID  = process.env.BUNGIE_OAUTH_CLIENT_ID;
const BUNGIE_OAUTH_AUTHORIZE_URL = "https://www.bungie.net/en/OAuth/Authorize";
const BUNGIE_OAUTH_TOKEN_URL = "https://www.bungie.net/platform/app/oauth/token/";

app.get('/', (req, res) => {
    res.write("<a href='/register-start'>Authorise with Bungie.net</a>")
    res.end()
});
  
app.listen(port, () => {
    return console.log(`Express is listening at https://localhost:${port}`);
});

app.get("/register-start", (req, res) => {
    const bungieOauthUrl = `${BUNGIE_OAUTH_AUTHORIZE_URL}?response_type=code&client_id=${BUNGIE_OAUTH_CLIENT_ID}`;
    res.redirect(307, bungieOauthUrl);
});