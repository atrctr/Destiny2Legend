import { metricCollections, metricDefinitionLookup } from "./legend.js"

export const metrics = (apiResponse) => {

    const metricsGroups = {
        "Crucible" : metricCollections.pvp,
        "Gambit" : metricCollections.gambit,
        "Vanguard" : metricCollections.strikes

    }
    let output = ''

    Object.entries(metricsGroups).forEach(
        ([groupName,metrics]) => {
            output += `
        <div class='grid-tile'>
            <h3>${groupName}</h3>
            ${metricsBlock( metrics ,apiResponse)}
        </div>`
        }
    )
    output = `<h2  class='grid-span-whole'>Metrics</h2>
        ${output}`

    return output

}

export default metrics

export const metricsBlock = ( requestedMetrics , apiResponse ) => {
    const fetchedMetrics = apiResponse.Response.metrics.data.metrics
    console.log(requestedMetrics)
    let output = ""

    requestedMetrics.forEach( metric => {
        const metricDefinition = metricDefinitionLookup(metric)
        const metricValue = fetchedMetrics[metric].objectiveProgress.progress
        const metricComplete = fetchedMetrics[metric].objectiveProgress.complete

        console.log(`${metricDefinition.name}: ${metricValue} ${metricComplete}`)
        output += `<li class='metric'>${metricDefinition.name}: `
        if ( metricComplete == true ) { 
            output += `<span class='text-gold metric-complete' > ${metricValue} </span>` 
        } else {
            output += metricValue
        }
        output += `</li>\n`
    });

    output = `<ul class='metrics-list character-statistics'>
    ${output}
    </ul>`
    return output
}

export const metricPretty = ( value, label, icon ) =>
{}