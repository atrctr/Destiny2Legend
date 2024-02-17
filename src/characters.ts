import { BUNGIE_NET_URL } from "./app.js"
import fs from 'fs'
import { metricCollections, titleLookup, relativeDate } from "./legend.js"
import { metricsBlock } from "./metrics.js"

export const characters = ( apiResponse ) => {
    const characterData : Object = apiResponse.Response.characters.data

    let output=""
    let i = 1

    Object.entries(characterData).forEach(
        ([characterId, characterDetails]) => {
            const characterSpecies = raceTypes[characterDetails.raceType]
            const characterGender = genderTypes[characterDetails.genderType]
            const characterClass = classTypes[characterDetails.classType]
            const dateLastPlayed = new Date(characterDetails.dateLastPlayed)
            const emblemPath = `${BUNGIE_NET_URL}/${characterDetails.emblemBackgroundPath}`
            const emblemColor = `rgba(${characterDetails.emblemColor.red}, ${characterDetails.emblemColor.green}, ${characterDetails.emblemColor.blue}, ${characterDetails.emblemColor.alpha})`

            console.log( `${characterDetails.membershipId} Character ${i}: ${characterId} - ${characterClass} ${characterSpecies} ${characterGender}`)

            const classMetrics = metricCollections.subclass[characterClass.toLowerCase()]

            output += `<div class='grid-tile grid-span-2 character-slot character-slot-${i} character-${characterClass.toLowerCase()}'>
                <div id='character-${characterId}' class='character-emblem' style='background-color: ${emblemColor}; background-image: url(${emblemPath});'>
                    <h2 class='character-emblem-text'> ${characterClass}
                    <span class='character-emblem-lightlevel'><span class='destiny-symbols destiny-power-symbol'></span>${characterDetails.light}</span>
                    </h2>
                    <span class='character-emblem-text dimmed'>${characterSpecies} ${characterGender}</span>
                </div>
                ${titleBanner(characterDetails.titleRecordHash)}
                <ul class='character-statistics'>
                    <li><span class="material-icons">hourglass_empty</span> 
                    Playtime: ${ playtimeCalculate(characterDetails.minutesPlayedTotal)} </li>
                    <li><span class="material-icons">history</span> 
                    Last active ${ relativeDate(dateLastPlayed) } ago</li>

                    <hr />

                    ${metricsBlock(classMetrics,apiResponse,'tooltip-icon')}
                </ul>
            </div>`
            
            i++
        }
    )
    
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

const titleBanner = ( hash ) => {
    if ( hash == undefined ) {
        console.log('Title not equipped')
        return ''
    } else {
        const titleMatch = titleLookup( hash, 'Male')
        const bannerBlock = `<div class='character-title'> ${titleMatch} </div>`  
        return bannerBlock
    }   
}