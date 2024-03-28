import { getChromaCollection, deleteChromaCollection } from "./chroma-collection.js"

export const reset = async () => {
    await deleteChromaCollection();
    console.log('deleted')
    const collection = await getChromaCollection();

    const collectionCountAfter = await (await collection).count();
    console.log(collectionCountAfter)
    if (collectionCountAfter === 0) {
        return true
    } else {
        return false
    }
}