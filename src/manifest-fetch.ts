import https from 'https'
import fs from 'fs'
import { getDestinyManifest } from 'bungie-api-ts/destiny2'
import { bungieAuthedFetch } from './bungie.js'
import { error } from 'console'

const MANIFEST_PATH = 'resources'

getDestinyManifest( bungieAuthedFetch() )
.then((response) => {
    console.log(`Found manifest version: ${response.Response.version}`)

    const allComponents = response.Response.jsonWorldComponentContentPaths.en
    
    const requiredComponentManifests = [
        allComponents.DestinyClassDefinition,
        allComponents.DestinyGenderDefinition,
        allComponents.DestinyMetricDefinition,
        allComponents.DestinyRecordDefinition,
        allComponents.DestinySeasonDefinition,
    ]

    requiredComponentManifests.forEach( componentManifest => {
        const jsonManifestUrl = "https://www.bungie.net" + componentManifest
        console.log(`JSON path (English): ${jsonManifestUrl}`)
        const filename = jsonManifestUrl.substring(jsonManifestUrl.lastIndexOf('/')+1);
        fileDownloader(jsonManifestUrl, `${MANIFEST_PATH}/${filename}`)
    })

})

const fileDownloader = async ( uri, destinationFile ) => {
    https.get(uri, response => {
        console.log(`${uri} ${response.statusCode} ${response.statusMessage}` )

        const localFile = fs.createWriteStream( destinationFile )
        console.log(`Writing to ${localFile.path}`)

        localFile.on('error', (err) => {
            console.log(`Error encountered when writing to file: ${err}`)
        })
        .on('close', () => {
            let fileSize = ( localFile.bytesWritten / 1048576 ).toFixed(2)
            console.log(`${localFile.path} write complete, ${ fileSize } MB written.`)
        })

        if (response.headers.location) {
            console.log(response.headers.location)
        }

        response.pipe(localFile)

    })
}