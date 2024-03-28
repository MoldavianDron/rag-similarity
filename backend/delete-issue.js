import { getChromaCollection } from "./chroma-collection.js"

export const deleteIssue = async (issueKey) => {
    const collection = await getChromaCollection();
    await collection.delete({ ids: issueKey })
}