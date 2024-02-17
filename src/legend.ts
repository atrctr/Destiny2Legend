import fs from 'fs'

export const titleLookup = ( hash, gender = 'Male' ) => {
    let recordsDefinitions : Object
    try {
        recordsDefinitions = JSON.parse(fs.readFileSync('./resources/DestinyRecordDefinition.json').toString())

        try {
            const titleMatch = recordsDefinitions[hash].titleInfo.titlesByGender[gender]
            return titleMatch
        } catch (error) {
            console.log(`Failed to match up title hash ${hash} to definition:`, error)
        }
    } catch (error) {
        console.log('Unable to fetch title definitions: ', error)
    }
}

export const metricDefinitionLookup = ( hash ) => {
    try {
        const metricsDefinitions : Object = JSON.parse(fs.readFileSync('./resources/DestinyMetricDefinition.json').toString())
        try {
            const metricMatch = metricsDefinitions[hash].displayProperties
            return metricMatch
        }
        catch (e) {
            console.log(`Failed to return metric definition for ${hash}: `, e)
        }
    } catch (error) {
        console.log('Unable to fetch metrics definitions: ', error)
    }
}

export const metricCollections = {
    subclass : {
        titan : [
            2839721658, // arc
            1337769169, // solar
            1045301756, // void
            626613399,  // stasis
            3133144330  // strand
        ],
        warlock : [
            2094083755, // arc
            30426544,   // solar
            4114590251, // void
            813571064,  // stasis
            2445590309  // broodweaver
        ],
        hunter : [
            2387491484, // arc
            502216639,  // solar
            451582922,  // void
            673324377,  // stasis
            115661044   // strand
        ],
    },
    weapons : {
        primary: [
            2094013181, // AR
            982406257,  // pulse
            2599646044, // scout
            2117204340, // HC
            2012993124, // sidearm
            1165153680, // SMG
            3522276357, // bow
        ],
        special: [
            139320435,  // shotgun
            105734892,  // fusion
            3124958797, // trace
            633604541,  // sniper
        ],
        heavy: [
            1681554390, // GL
            1619269474, // sword
            401742412,  // HMG
            1200426430, // RL
            2707112071, // LFR
        ]
    },
    pvp: [
        1250683514, //title gildings
        811894228, // kills
        3626149776, // rank resets
        //902410069,  // IB rankups
        1196938828, // IB gold medals
        1765255052, // Trials flawless tickets
        //2082314848, // Trials kills
        ],
    gambit: [
        2365336843, // title gildings
        3587221881, // wins
        3227312321, // invaders killed
        3740642975, // primevals killed
        1462038198, // motes banked
    ],
    strikes: [
        3266682176, // title gildings
        793155718,  // total completions
        2326329668, // flawless completions
        41075005, // champions slain
    ],
    raids: [
        2486745106, // Leviathan
        2659534585, // Eater of Worlds
        905240985, // Last Wish
        700051716, // Spire of Stars
        1201631538, // Scourge of the Past
        1815425870, // Crown of Sorrow
        1168279855, // Garden of Salvation
        954805812, // Deep Stone Crypt
        2506886274, // Vault of Glass
        3585185883, // Vow of the Disciple
        1624029217, // King's Fall
        321051454, // Root of Nightmares
        2552956848 // Crota's End
    ],
    dungeons: [
        1339818929, // Shattered Throne
        1451729471, // Pit of Heresy
        352659556, // Prophecy
        451157118, // Grasp of Avarice 
        3862075762, // Duality
        3702217360, // Spire of the watcher
        3932004679, // Warlord's Ruin
    ]

}

export const seasonDefinitionLookup = (hash) => {
    const seasonsDefinitions : Object = JSON.parse(fs.readFileSync('./resources/DestinySeasonDefinition.json').toString())
    //console.log(`Looking up season ${hash}`)

    const output = seasonsDefinitions[hash]

    return output
}