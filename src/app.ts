import express from 'express'
import { getDestinyMemberships as bungieGetDestinyMemberships, getDestinyProfile } from './bungie';
import { GroupUserInfoCard } from 'bungie-api-ts/groupv2';

require("dotenv").config()
const https = require('https')
const fs = require('fs')
const app = express()
const port = 3000

const BUNGIE_OAUTH_CLIENT_ID  = process.env.BUNGIE_OAUTH_CLIENT_ID;
const BUNGIE_OAUTH_AUTHORIZE_URL = "https://www.bungie.net/en/OAuth/Authorize";
const BUNGIE_OAUTH_TOKEN_URL = "https://www.bungie.net/platform/app/oauth/token/";

https.createServer(
    {
        key: fs.readFileSync('./server.key.pem'),
        cert: fs.readFileSync('./server.cert.pem')
    },
    app)
  .listen(443)

app.enable('trust proxy')
app.use((req, res, next) => {
    req.secure ? next() : res.redirect('https://' + req.headers.host + req.url)
})

app.get('/', (req, res) => {
    const bungie_membership_id = req.query.id
    if( bungie_membership_id != null) {
      res.write( "<p>Bungie.net membership ID: <code>" + String(bungie_membership_id) + "</code></p>")
    } else {
      res.write("<a href='/register-start'>Authorise with Bungie.net</a>\n")
    }
    res.end()
});

app.listen(port, () => {
    return console.log(`Express is listening at https://localhost`);
});

app.get("/register-start", (req, res) => {
    const bungieOauthUrl = `${BUNGIE_OAUTH_AUTHORIZE_URL}?response_type=code&client_id=${BUNGIE_OAUTH_CLIENT_ID}`;
    res.redirect(307, bungieOauthUrl);
});

interface TokenResponseData {
    access_token: string;
    membership_id: string;
  }
  
const getToken = async (authorizationCode: string) => {
  const tokenResponse = await fetch(BUNGIE_OAUTH_TOKEN_URL, {
    body: `grant_type=authorization_code&code=${authorizationCode}&client_id=${BUNGIE_OAUTH_CLIENT_ID}`,
    cache: "no-cache",
    credentials: "include",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "POST",
    redirect: "follow",
    // referrer: "no-referrer"
  });
  if (tokenResponse.status !== 200) {
    throw Error(
      `Status code ${tokenResponse.status} from bungie token exchange`
    );
  }
  return tokenResponse.json() as Promise<TokenResponseData>;
};

app.get("/register", async (req, res) => {
    const { code } = req.query
    if (code !== "undefined") {
        console.log('Registration successful, Bungie.net code: ' + code)
        
        try {
          const tokenData = await getToken(code);
          const {
            access_token: accessToken,
            membership_id: bungieMembershipId
          } = tokenData;
          global.bungie_membership_id = tokenData.membership_id
          console.log("Bungie.net membership ID: " + tokenData.membership_id + "/" + global.bungie_membership_id)
          res.redirect("/?id=" + tokenData.membership_id)
        } catch (e) {
          return res
            .status(500)
            .json({ error: `Error handling authentication: ${e.message}` });
        }
  } 
})

export default app;