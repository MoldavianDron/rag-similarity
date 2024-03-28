import { getIssue } from "./api.js"
import { getChromaCollection } from "./chroma-collection.js"
import { cleanData } from "./clean-text.js"

export const restoreIssue = async (issueKey) => {
    const issue = await getIssue(issueKey)
    const text = issue["fields"]["summary"] + " " + (issue["fields"]["description"] ?? "")
    const collection = await getChromaCollection();

    await collection.upsert({
        ids: [issueKey],
        metadatas: [{key: issueKey}],
        documents: [cleanData(text.replace(/\n/g, ' '))]
    })
}