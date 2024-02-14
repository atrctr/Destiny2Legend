import { DestinyGameVersions } from "bungie-api-ts/destiny2"
import { BUNGIE_NET_URL } from "./app.js"

export const playerProfile = ( apiResponse ) => {
    const profileData = apiResponse.Response.profile.data

    const bungieName = profileData.userInfo.bungieGlobalDisplayName + '<span class="text-bungie-blue">#' + profileData.userInfo.bungieGlobalDisplayNameCode + '</span>'

    const responseTimestamp = new Date(apiResponse.Response.responseMintedTimestamp).toLocaleString()
    const lastActiveDate = new Date(profileData.dateLastPlayed).toLocaleString()

    const triumphScoreActive = apiResponse.Response.metrics.data.metrics['3981543480'].objectiveProgress.progress
    const triumphScoreTotal = apiResponse.Response.metrics.data.metrics['3329916678'].objectiveProgress.progress

    let output = `
            <div class='grid-span-4 grid-start-col2'><h1 class='player-bungiename'>${bungieName}</h1></div>
 
            <div class='grid-tile grid-span-2 grid-start-col2'>
                <p><span class="material-icons">sports_esports</span> Playing on ${platformIcons(profileData.userInfo.applicableMembershipTypes)}</p>
            </div>

            <div class='grid-tile grid-span-2'>
                <p><span class="material-icons">history</span> Last played: ${lastActiveDate} </p>
            </div>

            <div class='grid-tile grid-span-2 grid-start-col2'><h3>Guardian rank</h3>
                <p><img height=16px src='/images/icon_guardian_ranks.png' class='icon'> Current rank: 
                    <span class='guardian-rank'><span class='guardian-rank-roundel'>${profileData.currentGuardianRank}</span> <span class='dimmed'>${guardianRanks[profileData.currentGuardianRank]}</span></span> </p>
                <p class="dimmed"><span class="material-icons">timeline</span> Highest achieved: 
                    <span class='guardian-rank'><span class='guardian-rank-roundel'>${profileData.lifetimeHighestGuardianRank}</span> ${guardianRanks[profileData.lifetimeHighestGuardianRank]} </span></p>
            </div>

            <div class='grid-tile grid-span-2'><h3>Triumph Score</h3>
                <p><img height=20px src='/images/icon_triumphslifetime.webp' class='icon' /> Active Triumph score: ${triumphScoreActive.toLocaleString()} </p>
                <p class="dimmed"><img height=20px src='/images/icon_triumphsmemorialized.webp' class='icon' /> Lifetime Triumph score: ${triumphScoreTotal.toLocaleString()} </p>
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