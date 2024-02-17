import { seasonDefinitionLookup } from "./legend.js"

export const playerRecords = ( apiResponse ) => {
    const contentBitmask = apiResponse.Response.profile.data.versionsOwned
    const seasonHashes = apiResponse.Response.profile.data.seasonHashes.toString().split(',')

    let output = `<div class='grid-tile grid-span-4 grid-start-col2'>
        <h2>Content ownership record</h2>
        </div>`

    let contentOwnership = []

    if ((contentBitmask & contentEnum.Destiny2) === contentEnum.Destiny2) {
        contentOwnership.push("Destiny 2 (Red War) <span class='dimmed'>Sep 2017</span>")
    }
    if ((contentBitmask & contentEnum.DLC1) === contentEnum.DLC1) {
        contentOwnership.push("Curse of Osiris <span class='dimmed'>Dec 2017</span>")
    }
    if ((contentBitmask & contentEnum.DLC2) === contentEnum.DLC2) {
        contentOwnership.push("Warmind <span class='dimmed'>May 2018</span>")
    }
    if ((contentBitmask & contentEnum.Forsaken) === contentEnum.Forsaken) {
        contentOwnership.push("Forsaken <span class='dimmed'>Sep 2018</span>")
    }
    if ((contentBitmask & contentEnum.YearTwoAnnualPass) === contentEnum.YearTwoAnnualPass) {
        contentOwnership.push("Year 2 Annual Pass <span class='dimmed'>2019</span>")
    }
    if ((contentBitmask & contentEnum.Shadowkeep) === contentEnum.Shadowkeep) {
        contentOwnership.push("Shadowkeep <span class='dimmed'>Oct 2019</span>")
    }
    if ((contentBitmask & contentEnum.BeyondLight) === contentEnum.BeyondLight) {
        contentOwnership.push("Beyond Light <span class='dimmed'>Nov 2020</span>")
    }
    if ((contentBitmask & contentEnum.TheWitchQueen) === contentEnum.TheWitchQueen) {
        contentOwnership.push("The Witch Queen <span class='dimmed'>Feb 2022</span>")
    }
    if ((contentBitmask & contentEnum.Lightfall) === contentEnum.Lightfall) {
        contentOwnership.push("Lightfall <span class='dimmed'>Feb 2023</span>")
    }
    if ((contentBitmask & contentEnum.Lightfall) === contentEnum.TheFinalShape) {
        contentOwnership.push("The Final Shape <span class='dimmed'>Jun 2024</span>")
    }
    let contentPretty = ''
    
    contentOwnership.forEach ( expansion => {
        contentPretty += `<li>${expansion}</li>\n`
    })

    output += `<div class='grid-tile grid-start-col2 grid-span-2 '>
            <h3>Expansions </h3>
            <ul>${contentPretty}</ul>
        </div>`

    let seasonsPretty = ''

    seasonHashes.forEach( seasonHash => {
        try {
            const season = seasonDefinitionLookup ( seasonHash )
            seasonsPretty += `<li> ${seasonShortName(season.displayProperties.name)} <span class='dimmed'>(s${season.seasonNumber})</span></li>\n`
        } catch (e) {
            console.log (`Failed to look up Season definitions: ${e}`)
        }
    });

    output += `<div class='grid-tile grid-span-2'>
        <h3>Seasons </h3>
        <ul>
        ${seasonsPretty}
        </ul>
    </div>`       

    return output
}

export default playerRecords

const enum contentEnum {
    Destiny2 = 1,
    DLC1 = 2,
    DLC2 = 4,
    Forsaken = 8,
    YearTwoAnnualPass = 16,
    Shadowkeep = 32,
    BeyondLight = 64,
    Anniversary30th = 128,
    TheWitchQueen = 256,
    Lightfall = 512,
    TheFinalShape = 1024
}

const seasonShortName = ( seasonLongName : string ) => {
    const regex = /(season of (the )?)/gi
    const shortName = seasonLongName.replace(regex,'')
    return shortName
}