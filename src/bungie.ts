import { getProfile, DestinyComponentType } from "bungie-api-ts/destiny2";
import { getMembershipDataForCurrentUser } from "bungie-api-ts/user";
import { HttpClientConfig } from "bungie-api-ts/http";

const { BUNGIE_API_KEY } = process.env

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
      const response = await fetch(url, { headers, credentials: "include" });
      return await response.json();
    } catch (e) {
      console.error(e);
      return {};
    }
  };

export const getDestinyMemberships = async (
  accessToken: string
) => {
  return getMembershipDataForCurrentUser(bungieAuthedFetch(accessToken));
}

export const getDestinyProfile = async (
  membershipType: number,
  destinyMembershipId: string
) => {
  return getProfile(bungieAuthedFetch(), {
    membershipType: membershipType,
    destinyMembershipId: destinyMembershipId,
    components: [DestinyComponentType.Characters, DestinyComponentType.Profiles]
  });
};


