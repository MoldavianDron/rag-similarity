import { getChromaCollection } from "./chroma-collection.js"
import { cleanData } from "./clean-text.js";

export const upsertIssue = async (text, issueKey) => {
    const collection = await getChromaCollection();
    await collection.upsert({
        ids: [issueKey],
        metadatas: [{ key: issueKey }],
        documents: [cleanData(text)],
    })
}