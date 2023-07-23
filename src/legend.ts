import fs from 'fs'

export const titleLookup = ( hash, gender ) => {
    const recordsDefinition : Object = JSON.parse(fs.readFileSync('./resources/DestinyRecordDefinition.json').toString())
    console.log(`Looking up title ${hash}`)
    const titleMatch = recordsDefinition[hash].titleInfo.titlesByGender[gender]
    return titleMatch
}