import express from 'express'
import path from 'path'
import { getDestinyMemberships as bungieGetDestinyMemberships, getDestinyProfile } from './bungie.js';
import dotenv from 'dotenv'
dotenv.config()
import https from 'https'
import fs from 'fs'

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

app.use(express.static(path.join('./public')))

app.get('/', (req, res) => {
  const html = fs.readFileSync('src/index.html')
  res.write(html)

  let membershipType
  let membershipId
  
  const bungieMembershipId = req.query.id
  if( bungieMembershipId != null) {
    res.write( "<p>Bungie.net membership ID: <code>" + String(bungieMembershipId) + "</code></p>")
  } else {
    res.write("<p><a href='/register-start'>Authorise with Bungie.net</a></p>\n")
    
    membershipType = 3
    membershipId = '4611686018483339796'
  }

  getDestinyProfile(membershipType, membershipId)
    .then((response) => {
      let bungieName = response.Response.profile.data.userInfo.bungieGlobalDisplayName + '<span class="dimmed">#' + response.Response.profile.data.userInfo.bungieGlobalDisplayNameCode + '</span>'
      res.write(`<h1>${bungieName}</h1>\n`)
      res.write('<p><strong>JSON dump:</strong></p>\n<pre>' + JSON.stringify(response,null,'\t') + '</pre>')
      res.send()
    })

});

app.listen(port, () => {
    return console.log(`Express is listening at https://localhost`);
});

// app.get("/register-start", (req, res) => {
//     const bungieOauthUrl = `${BUNGIE_OAUTH_AUTHORIZE_URL}?response_type=code&client_id=${BUNGIE_OAUTH_CLIENT_ID}`;
//     res.redirect(307, bungieOauthUrl);
// });

// interface TokenResponseData {
//     access_token: string;
//     membership_id: string;
//   }
  
// const getToken = async (authorizationCode: string) => {
//   const tokenResponse = await fetch(BUNGIE_OAUTH_TOKEN_URL, {
//     body: `grant_type=authorization_code&code=${authorizationCode}&client_id=${BUNGIE_OAUTH_CLIENT_ID}`,
//     cache: "no-cache",
//     credentials: "include",
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded"
//     },
//     method: "POST",
//     redirect: "follow",
//     // referrer: "no-referrer"
//   });
//   if (tokenResponse.status !== 200) {
//     throw Error(
//       `Status code ${tokenResponse.status} from bungie token exchange`
//     );
//   }
//   return tokenResponse.json() as Promise<TokenResponseData>;
// };

// const getDestinyMemberships = async (
//   bungieMembershipId: string,
//   accessToken: string
// ) => {
//   const response = await bungieGetDestinyMemberships(
//     bungieMembershipId,
//     accessToken
//   );
//   if (
//     !response.Response ||
//     (response.ErrorStatus && response.ErrorStatus !== "Success")
//   ) {
//     throw Error(
//       `Unexpected error status while fetching membership data: ${response.ErrorStatus}`
//     );
//   }
//   return response.Response.destinyMemberships;
// };

// app.get("/register", async (req, res) => {
//     const { code } = req.query
//     if (code !== "undefined") {
//         console.log('Registration successful, Bungie.net code: ' + code)
        
//         try {
//           const tokenData = await getToken(code);
//           const {
//             access_token: accessToken,
//             membership_id: bungieMembershipId
//           } = tokenData;
//           console.log("Bungie.net membership ID: " + tokenData.membership_id )

//           const membershipData = await getDestinyMemberships(
//             bungieMembershipId, accessToken
//           )


//           res.redirect("/?id=" + tokenData.membership_id)
//         } catch (e) {
//           return res
//             .status(500)
//             .json({ error: `Error handling authentication: ${e.message}` });
//         }
//   } 
// })

export default app;