export const Share = (shareUrl) => {
    const copyable = `
    <div class='grid-tile grid-span-4 share-component dimmed'>
        <label>Permalink: </label>
        <input type='text' value='${shareUrl}' readonly='' />
    </div>`

    return copyable
} 

export default Share