import { BUNGIE_NET_URL } from "./app.js"

export const characters = ( apiResponse ) => {
    const characterData : Object = apiResponse.Response.characters.data

    let output = "<div class='character-container flex-container'>"
    let i = 1

    Object.entries(characterData).forEach(
        ([characterId, characterDetails]) => {
            const characterSpecies = raceTypes[characterDetails.raceType]
            const characterGender = genderTypes[characterDetails.genderType]
            const characterClass = classTypes[characterDetails.classType]
            const emblemPath = `${BUNGIE_NET_URL}/${characterDetails.emblemBackgroundPath}`
            const emblemColor = `rgba(${characterDetails.emblemColor.red}, ${characterDetails.emblemColor.green}, ${characterDetails.emblemColor.blue}, ${characterDetails.emblemColor.alpha})`

            console.log( `${characterDetails.membershipId} Character slot ${i}: ${characterId} - ${characterClass}, ${characterSpecies} ${characterGender}`)

            output += `<div class='character-slot character-slot-${i}'>
                <div id='character-${characterId}' class='character-slot-header' style='background-color: ${emblemColor}; background-image: url(${emblemPath});'>
                    <h2 class='character-slot-title'> ${characterClass} <span class='character-lightlevel'>${characterDetails.light}</span>
                    <br/><small></small></h2>
                </div>

                <ul class='character-statistics'>
                    <li>Title hash: <code>${characterDetails.titleRecordHash}</code></li>
                    <li>${characterSpecies} ${characterGender}</li>
                    <li>Playtime: ${ playtimeCalculate(characterDetails.minutesPlayedTotal)} </li>
                    <li>Last played: ${new Date(characterDetails.dateLastPlayed).toLocaleString()} </li>
                </ul>
            </div>`
            i++
        }
    )
    
    output += `</div>`
    return output
}

export default characters

const classTypes: { [key: string] : string } = {
    0 : "Titan",
    1 : "Hunter", 
    2 : "Warlock"
}
const raceTypes: { [key: string] : string } = {
    0 : "Human",
    1 : "Awoken", 
    2 : "Exo"
}
const genderTypes: { [key: string] : string } = {
    0 : "Male",
    1 : "Female"
}

function playtimeCalculate( minutes ) {
    const units = {
        "year" : 24*60*365,
        "month" : 24*60*30,
        "week" : 24*60*7,
        "day" : 24*60,
        "hour" : 60,
        "minute" : 1
    }
    let result = []
    for ( let name in units ) {
        var p =  Math.floor(minutes/units[name]);
        if(p == 1) result.push(p + " " + name);
        if(p >= 2) result.push(p + " " + name + "s");
        minutes %= units[name]
    }
    result = result.slice(0,2)
    const resultString = result.join(', ')
    return resultString
}