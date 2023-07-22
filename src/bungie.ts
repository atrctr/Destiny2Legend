import { getProfile, DestinyComponentType } from "bungie-api-ts/destiny2";
import { getMembershipDataById } from "bungie-api-ts/user";
import { HttpClientConfig } from "bungie-api-ts/http";
import dotenv from 'dotenv'
dotenv.config()

const BUNGIE_API_KEY  = process.env.BUNGIE_API_KEY

export const bungieAuthedFetch = (accessToken?: string) => async (
    config: HttpClientConfig
  ) => {
    try {
      const headers: { [key: string]: string } = {
        "x-api-key": BUNGIE_API_KEY!
      };
      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
      }
      const url = `${config.url}${
        config.params
          ? "?" +
            Object.entries(config.params).map(
              ([key, value]) =>
                `${encodeURIComponent(key)}=${encodeURIComponent(
                  value as string
                )}`
            )
          : ""
      }`;
      console.log(`Fetching: ${url}`);
      console.log(`API key: ${BUNGIE_API_KEY}` )
      const response = await fetch(url, { headers, credentials: "include" });
      console.log(response.status + ' ' + response.statusText);
      return await response.json();
    } catch (e) {
      console.error(e);
      return {};
    }
  };

export const getDestinyMemberships = async (
  accessToken: string,
  membershipId: string,
) => {
  return getMembershipDataById(
    bungieAuthedFetch(accessToken), {
      membershipId : membershipId,
      membershipType : 254
    })

}

export const getDestinyProfile = async (
  //accessToken: string,
  membershipType: number,
  destinyMembershipId: string
) => {
  let response = await getProfile(bungieAuthedFetch(), {
    membershipType: membershipType,
    destinyMembershipId: destinyMembershipId,
    components: [DestinyComponentType.Characters, DestinyComponentType.Profiles, DestinyComponentType.Metrics, DestinyComponentType.Records, DestinyComponentType.ProfileProgression]
  })
  console.log('Bungie.net response status: ' + response.ErrorStatus)

  return response
};

export const destinyPrimaryMembershipLookup = async ( 
  destinyMembershipId: string
) => {
  let response = await getMembershipDataById(bungieAuthedFetch(), {
    membershipId: destinyMembershipId,
    membershipType: -1
  })
  console.log(`PrimaryMembershipLookup | Bungie.net response status: ${response.ErrorCode} ${response.ErrorStatus} `)
  if( response.ErrorCode == 1) {
    let primaryMembership = {membershipId: "", membershipType : 0, iconPath : ""}
    if ( response.Response.primaryMembershipId != undefined ) {
      primaryMembership.membershipId = response.Response.primaryMembershipId
    } else {
      primaryMembership.membershipId = destinyMembershipId
    }
    console.log('Bungie.net user ID: ' + response.Response.bungieNetUser.membershipId + '\nPrimary membership: ' + primaryMembership.membershipId)
    primaryMembership.membershipType = response.Response.destinyMemberships.filter(membership => membership.membershipId === primaryMembership.membershipId)[0].membershipType
    primaryMembership.iconPath = response.Response.destinyMemberships.filter(membership => membership.membershipId === primaryMembership.membershipId)[0].iconPath
    //console.log(primaryMembership)
    console.log('Membership type: ' + primaryMembership.membershipType )

    return primaryMembership
  } else {
    console.log('PrimaryMembershipLookup failed.')
  }
}