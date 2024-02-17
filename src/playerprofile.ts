import { DestinyGameVersions } from "bungie-api-ts/destiny2"
import { BUNGIE_NET_URL } from "./app.js"
import { relativeDate } from "./legend.js"

export const playerProfile = ( apiResponse ) => {
    const profileData = apiResponse.Response.profile.data

    const bungieName = profileData.userInfo.bungieGlobalDisplayName + '<span class="text-bungie-blue">#' + profileData.userInfo.bungieGlobalDisplayNameCode + '</span>'

    const responseTimestamp = new Date(apiResponse.Response.responseMintedTimestamp).toLocaleString()
    const lastActiveDate = relativeDate(new Date(profileData.dateLastPlayed))

    const triumphScoreActive = apiResponse.Response.metrics.data.metrics['3981543480'].objectiveProgress.progress
    const triumphScoreTotal = apiResponse.Response.metrics.data.metrics['3329916678'].objectiveProgress.progress

    let output = `
            <div class='grid-span-3 grid-start-col2'><h1 class='player-bungiename'>${bungieName}</h1>
            <p class='dimmed'>Last active ${lastActiveDate} ago</p>
            </div>
 
            <div class='grid-tile text-lg'>
                <p>${platformIcons(profileData.userInfo.applicableMembershipTypes)}</p>
            </div>

            <div class='grid-tile grid-start-col2'>
                <p class='text-lg guardian-rank'>
                    <span class='guardian-rank-roundel'>${profileData.currentGuardianRank}</span>&nbsp;${guardianRanks[profileData.currentGuardianRank]}
                </p>
                <p>Current Guardian Rank</p>
            </div>

            <div class='grid-tile dimmed'>
                <p class="text-lg guardian-rank text-lg" >
                    <span class='guardian-rank-roundel'>${profileData.lifetimeHighestGuardianRank}</span>&nbsp;${guardianRanks[profileData.lifetimeHighestGuardianRank]}
                </p>
                <p class="dimmed">Highest Rank achieved</p>
            </div>

            <div class='grid-tile'>
                <p class='text-lg'><img height=20px src='/images/icon_triumphslifetime.webp' class='icon' /> ${triumphScoreActive.toLocaleString()} </p>
                <p>Active Triumph score</p>
            </div>

            <div class='grid-tile'>
                <p class="dimmed text-lg"><img height=20px src='/images/icon_triumphsmemorialized.webp' class='icon' /> ${triumphScoreTotal.toLocaleString()} </p>
                <p class="dimmed">Lifetime Triumph score</p>
            </div>`
        
        // ${ playerOwnership(profileData.versionsOwned,profileData.seasonHashes )}    
        
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

const guardianRanks: { [key: string] : string } = {
    0 : "not applicable",
    1 : "New Light",
    2 : "Explorer",
    3 : "Initiate",
    4 : "Scout",
    5 : "Adventurer",
    6 : "Veteran",
    7 : "Elite",
    8 : "Justiciar",
    9 : "Vanquisher",
    10 : "Exemplar",
    11 : "Paragon"
}

const membershipTypes: { [key: string] : string } = {
    1 : "Xbox",
    2 : "PlayStation",
    3 : "Steam",
    6 : "Epic Games"
}
const platformIcons = ( input ) => {
    const platformIconPaths: { [key: string] : string } = {
        1 : "images/platforms/xbox.svg",
        2 : "images/platforms/playstation.svg",
        3 : "images/platforms/steam.svg",
        6 : "images/platforms/epic-games.svg"
    } 

    let platformTypes = []

    if (typeof input == 'string' || typeof input == 'number' ) {
        platformTypes.push(input)
    } else if ( typeof input == 'object' ) {
        platformTypes = input
    }

    let platformIcon = []
    platformTypes.forEach(platform => {
        const platformImage = `<img src='${platformIconPaths[platform]}' class='icon' alt='${membershipTypes[platform]}' title='${membershipTypes[platform]}' />`
        platformIcon.push(platformImage)
    });

    return platformIcon.join(' ')
}