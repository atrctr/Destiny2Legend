import express from 'express'
import path from 'path'
import { getDestinyMemberships as bungieGetDestinyMemberships, destinyPrimaryMembershipLookup, getDestinyProfile } from './bungie.js';
import dotenv from 'dotenv'
dotenv.config()
import https from 'https'
import fs from 'fs'
import playerProfile from './playerprofile.js'
import characters from './characters.js';

const app = express()
const port = 3000

export const BUNGIE_NET_URL = "https://www.bungie.net"
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

app.use(express.static(path.join('./public')))

function wrapUp(res) {
  res.write('</div></body></html>')
  res.send()
}

app.get('/', (req, res) => {
  const html = fs.readFileSync('src/index.html')
  res.write(html)
  const bungieMembershipId = req.query.id
  if( bungieMembershipId ) {

    destinyPrimaryMembershipLookup(bungieMembershipId)
    .then((response) => {
      const membership = response

      getDestinyProfile(membership.membershipType, membership.membershipId)
        .then((response) => {

          res.write(`<div class='grid-container'>`)

          res.write( playerProfile( response ) )
          res.write( characters ( response) )

          res.write ( placeholder(`All owned Title seals`) )
          res.write ( placeholder(`Curated stat trackers`) )
          res.write ( placeholder(`Content ownership history `) )

          res.write(`</div>`)
         
          wrapUp(res)
        })

      })

  } else {
    res.write(`<a href='/register-start' class='button'><span class="material-icons">login</span> Authorise with Bungie.net</a>\n`)
    wrapUp(res)
  }

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
  console.log(tokenResponse)
  if (tokenResponse.status !== 200) {
    throw Error(
      `Status code ${tokenResponse.status} from bungie token exchange`
    );
  }
  return tokenResponse.json() as Promise<TokenResponseData>;
};

const getDestinyMemberships = async (
  bungieMembershipId: string,
  accessToken: string
) => {
  const response = await bungieGetDestinyMemberships(
    bungieMembershipId,
    accessToken
  );
  if (
    !response.Response ||
    (response.ErrorStatus && response.ErrorStatus !== "Success")
  ) {
    throw Error(
      `Unexpected error status while fetching membership data: ${response.ErrorStatus}`
    );
  }
  return response.Response.destinyMemberships;
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
          console.log("Bungie.net membership ID: " + tokenData.membership_id )

          const primaryMembership = await destinyPrimaryMembershipLookup(tokenData.membership_id)
          .then((response) => {
            res.redirect("/?id=" + response.membershipId)

          })

        } catch (e) {
          return res
            .status(500)
            .json({ error: `Error handling authentication: ${e.message}` });
        }
  } 
})

export default app;

function placeholder ( tempText : string) {
  let output = `<div class='grid-tile grid-placeholder' style='grid-column: span 3; text-align: center' >
    <h2>${tempText}</h2>
  </div>`
  return output
}