import { metricCollections, metricDefinitionLookup } from "./legend.js"

export const metrics = (apiResponse) => {

    const metricsGroups = {
        "Crucible" : metricCollections.pvp,
        "Gambit" : metricCollections.gambit,
        "Vanguard" : metricCollections.strikes,
        "Raids" : metricCollections.raids,
        "Dungeons" : metricCollections.dungeons,
    }
    let output = ''

    Object.entries(metricsGroups).forEach(
        ([groupName,metrics]) => {
            output += `
        <div class='grid-tile grid-span-2 metrics-${groupName.toLowerCase()}'>
            <h3>${groupName}</h3>
            ${metricsBlock( metrics, apiResponse)}
        </div>`
        }
    )
    output = `<h2 class='grid-header grid-span-whole'>Metrics</h2>
        ${output}
        <div class='grid-span-4 grid-start-col2 metrics-weapons'>
            <h2>Weapon defeats</h2>
        </div>
        
        <div class='grid-tile grid-span-2 grid-start-col2 metrics-weapons'>
            <h3>Primary</h3>
            ${metricsBlock( metricCollections.weapons.primary, apiResponse)}
        </div>
        <div class='grid-tile grid-span-2 metrics-weapons'>
            <h3>Special & Heavy</h3>
            ${metricsBlock( metricCollections.weapons.special, apiResponse)}
            ${metricsBlock( metricCollections.weapons.heavy, apiResponse)}
        </div>`      
    return output
}

export default metrics

export const metricsBlock = ( requestedMetrics , apiResponse, format? ) => {
    const fetchedMetrics = apiResponse.Response.metrics.data.metrics
    console.log(requestedMetrics)
    let output = ""

    requestedMetrics.forEach( metric => {
        const metricDefinition = metricDefinitionLookup(metric)
        const metricValue = fetchedMetrics[metric].objectiveProgress.progress
        const metricComplete = fetchedMetrics[metric].objectiveProgress.complete

        console.log(`${metricDefinition.name}: ${metricValue} ${metricComplete}`)
        if ( metricComplete == true ) { 
            output += `<li class='metric metric-complete'>`
        } else {
            output += `<li class='metric'>`
        }
        output += `${metricDefinition.name}: <span class='metric-value'>${metricValue}</span>`
        if ( format == 'tooltip-icon' ) {
            output += ` <span class="tooltip" data-text="${metricDefinition.description}"><span class="material-icons">help_outline</span></span>`
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