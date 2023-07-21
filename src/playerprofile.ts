import { DestinyGameVersions } from "bungie-api-ts/destiny2"
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

    let output = `<div class='player-profile'>
        
        <div class='flex-container'>
            <div class='flex-tile'>
                <h1 class='player-bungiename'>${bungieName} </h1> 
            </div>

            <div class='flex-tile'><h3>Eyes up, Guardian</h3>
            Playing on ${platformType}
            <p>Last active: ${lastActiveDate.toLocaleString()} </p>
            </div>

            <div class='flex-tile'><h3><img height=16px src='/images/icon_guardian_ranks.png'> Guardian rank</h3>
            <p>Current: <span class='guardian-rank'>${profileData.currentGuardianRank}</span></p>
            <p class="dimmed">Highest:  <span class='guardian-rank'>${profileData.lifetimeHighestGuardianRank}</span> </p>
            </div>

            <div class='flex-tile'><h3><img height=16px src='/images/icon_triumphslifetime.webp'> Triumph Score</h3>
            <p>Active: ${triumphScoreActive.toLocaleString()} </p>
            <p class="dimmed">Total: ${triumphScoreTotal.toLocaleString()} </p></div>
        </div>`
        
        // ${ playerOwnership(profileData.versionsOwned,profileData.seasonHashes )}    
        output +=`</div>`

    return output
}

export default playerProfile

// TODO: function playerOwnership(versionsOwned, seasonHashes) {

//     let humanVersions : DestinyGameVersions = versionsOwned

//     let prettyOutput = `
//     <p>VersionsOwned (bitmask): <code>${humanVersions}</code></p>
//     <p>SeasonHashes: <code>${seasonHashes.join(', ')}</code></p>`

//     return prettyOutput

// }