import { BUNGIE_NET_URL } from "./app.js"

export const playerProfile = ( apiResponse ) => {
    const profileData = apiResponse.Response.profile.data

    const bungieName = profileData.userInfo.bungieGlobalDisplayName + '<span class="dimmed">#' + profileData.userInfo.bungieGlobalDisplayNameCode + '</span>'
    const membershipTypes: { [key: string] : string } = {
        1 : "Xbox",
        2 : "PlayStation",
        3 : "Steam",
        6 : "Epic Games"
    }
    const platformType = membershipTypes[profileData.userInfo.membershipType]

    const lastActiveDate = new Date(profileData.dateLastPlayed)

    const triumphScoreActive = apiResponse.Response.metrics.data.metrics['3981543480'].objectiveProgress.progress
    const triumphScoreTotal = apiResponse.Response.metrics.data.metrics['3329916678'].objectiveProgress.progress

    let output = ""
    output += `<h1>${bungieName} </h1> \n`
    output += `Playing on ${platformType}`
    output += `<p>Last active: ${lastActiveDate.toLocaleString()} </p>
        <p>Guardian rank - Current: ${profileData.currentGuardianRank} <span class="dimmed">&bull; Highest: ${profileData.lifetimeHighestGuardianRank} </span></p>
        <p>Triumph Score: Active: ${triumphScoreActive.toLocaleString()} &bull; Total: ${triumphScoreTotal.toLocaleString()} </p>
        <p>Seasons: <code>${profileData.seasonHashes}</code></p>` 

    return output
}

export default playerProfile
