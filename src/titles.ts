import { titleLookup } from "./legend.js";
import fs from 'fs'

export const titleComponent = ( apiResponse ) => {
    const profileRecords = apiResponse.Response.profileRecords.data.records // this strips everything except account-wide records
    const recordDefinitions = JSON.parse(fs.readFileSync('./resources/DestinyRecordDefinition.json').toString()) 
    
    // 1. Get a list of TITLE SEALS
    let allTitles = []
    try {
        for (const recordHash in recordDefinitions ) {
            const recordData = recordDefinitions[recordHash]
            if ( recordData.titleInfo.hasTitle == true ) {
                allTitles.push([ recordHash, titleLookup(recordHash, 'Male') ])
            }
        }
    } 
    catch (e) {
        console.log(`Failure while processing record definitions: `, e)
    }

    // 2. Use that list against player PROFILE RECORDS to get OWNED TITLES
    let ownedTitles = []
    try {
        for (const recordHash in profileRecords ) {
            const recordData = profileRecords[recordHash]
            if ( recordData.titleInfo != undefined ) {
                //titleList.push(recordData)
                console.log(recordHash)
            }
        }
    } 
    catch (e) {
        console.log(`Failure while processing profile-wide records: `, e)
    }

    // 2. look up titles from record definitions

    const component = `<div class='grid-tile grid-span-whole'>
        <h2>Titles</h2>
        ${ownedTitles}
        ${allTitles}
        ${triumphSeals}
    </div>`

    return component
}

export default titleComponent

const enum recordStates {
    Redeemed = 1,
    Unavailable = 2,
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

const triumphSeals = [
    // Current year
        3175660257, //MMXXIII
        4083696547, //Wishbearer
        2269203216, //Haruspex
        3570567217, //Aquanaut
        1722592950, //Queensguard
    // Raids and dungeons
        1142693639,//Wrathbearer
        865076293,//Swordbearer,
        3974717227,//Ghoul
        2889189256,//Dream Warrior
        2302993504,//WANTED
        3910736783,//Kingslayer
        3097916612, //Discerptor
        1971228746, //Disciple-Slayer
        4141971983,//Fatebreaker
        540377256, //Descendant,
        2909250963,//Enlightened
        1384029371,//Rivensbane
    // DLCs
        3906538939, //Virtual Fighter
        2489106733, //Gumshoe
        3588818798, //Vidmaster
        2482004751, //Splintered
        2584970263, //Harbinger
        3214425110, //Cursebreaker
    // Yearly events
        908738851, //Star Baker,
        2126152885, //Star Baker
        3056675381,//Flamekeeper
        3417514659,//Flamekeeper
        3646306576, //Champ
        1089543274, //Ghost Writer,
        1228693527, //Reveler

    // Permanent seals
        1564001702, //Iron Lord
        969142496, //Glorious,
        2228586830, //Glorious
        4141599814, //Deadeye
        1438167672, //Deadeye
        // 1249847601,Dredgen,,,,,1556658903,Dredgen,,,,,1715149073,Conqueror,,,,,2072890963,Flawless,,2126548397,Flawless,2226626398,Conqueror,,,2284880502,Flawless,,,,,2499679097,Almighty,2506618338,Flawless,,,,2843544039,Unbroken,,,2980266417,Conqueror,,,,,,,,,3298130972,Flawless,,3464275895,Conqueror,,,,,,,,,,,,4167244320,Conqueror,
    // Sunset/retired
        // 3947410852,Reaper
        // 317521250, //Blacksmith,
        // 4176879201, //Scallywag,
        // 2991743002,Realmwalker
        // 3169895614,Forerunner
        // 2796658869,Splicer
        // 2056461735,Shadow
        // 1185680627, //Savior
        // 4250626982, //Seraph 
        // 758645239, //Wayfarer,
        // 3766199186, //Chronicler
        // 966207508, //MMXIX,
        // 1284946259, //MMXXI
        // 3249408038,MMXXII
        // 1087927672,//Chosen,
        // 1343839969, //Unbroken
        // 1109459264, //MMXX,
        // 1561715947, //Warden
        // 1710217127, //Risen
        // 1866578144,// Undying
        // 2472740040,Reckoner
    ]