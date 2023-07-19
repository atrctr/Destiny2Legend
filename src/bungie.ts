import { getProfile, DestinyComponentType } from "bungie-api-ts/destiny2";
import { getMembershipDataById, GetMembershipDataByIdParams} from "bungie-api-ts/user";
import { HttpClientConfig } from "bungie-api-ts/http";
import dotenv from 'dotenv'
dotenv.config()

const BUNGIE_API_KEY  = process.env.BUNGIE_API_KEY

const bungieAuthedFetch = (accessToken?: string) => async (
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
    components: [DestinyComponentType.Characters, DestinyComponentType.Profiles]
  })
  console.log('Bungie.net response status: ' + response.ErrorStatus)

  return response
};
