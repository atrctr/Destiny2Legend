import { metricDefinitionLookup } from "./legend.js"

export const metricsBlock = ( requestedMetrics : Array<string>, apiResponse ) => {
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