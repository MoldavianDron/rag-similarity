import { cleanData } from './clean-text.js'

import { issueSearch } from './api.js';
import { getChromaCollection } from './chroma-collection.js';

import { JQL } from './const.js';

const downloadIssues = async ({startAt, maxResults, jql, total}=config) => {
    console.log({startAt, maxResults, jql, total})
    const chunksNumber = Math.ceil(total / maxResults)
    const promises = [];

    for (let i=0; i<chunksNumber; i+=1) {
        const issueSearchPromise = issueSearch({maxResults, startAt: startAt + (i*maxResults), jql}).then((data) => data["issues"])
        promises.push(issueSearchPromise)
    }

    const downloadedIssues = await Promise.all(promises);
    return downloadedIssues.flat();
}

const upsertIssuesInChunks = async (chunkSize, documents, metadatas, ids, collection) => {
    const chunksNumber = Math.ceil(documents.length / chunkSize);
    const upsertPromises = [];

    for (let i=0; i<chunksNumber; i+=1) {
        const upsertPromise = collection.upsert({ 
            ids: ids.slice(i*chunkSize, i*chunkSize + chunkSize),
            metadatas: metadatas.slice(i*chunkSize, i*chunkSize + chunkSize),
            documents: documents.slice(i*chunkSize, i*chunkSize + chunkSize),
        }).then(() => {});
        upsertPromises.push(upsertPromise)
    }

    await Promise.all(upsertPromises);
    return
}

export const init = async () => {
    try {
        const collection = await getChromaCollection();
        let collectionCount = await (collection).count();
        console.log(`collection count: ${collectionCount}`)
    
        if (collectionCount > 0) {
            throw new Error("Collection already exists")
        }
    
        const totalIssues = (await issueSearch({maxResults: 1, startAt: 0, jql: JQL}))["total"]
        const issuesToProcess = 1000;
        const upsertStep = 10;
        const upsertChunkSize = 100;
    
        while(collectionCount < totalIssues) {
            console.log(`issues processed: ${collectionCount}`)
            const downloadedIssues = await downloadIssues({startAt: collectionCount, jql: JQL, maxResults: 100, total: issuesToProcess})
            console.log(`downloaded Issues: ${downloadedIssues.length}`)
            const issues = downloadedIssues.map(({ key, id, fields }) => ({ key, id, summary: fields.summary, description: fields.description}));
            const issuesWithCleanedSummaryAndDescription = issues.map((issue) => {
                const { key, id, summary, description } = issue;
                const newDescription = description ?? ""
                const text = summary + " " + newDescription;
                return { key, id, summary: summary.replace(/\n/g, ' '), description: newDescription.replace(/\n/g, ' '), text: cleanData(text.replace(/\n/g, ' ')) }
            });
            console.log(`issues with cleaned up description and summary: ${issuesWithCleanedSummaryAndDescription.length}`)
            const documents = issuesWithCleanedSummaryAndDescription.map(({ text }) => text);
            const metadatas = issuesWithCleanedSummaryAndDescription.map(({ key }) => ({ key }));
            const ids = issuesWithCleanedSummaryAndDescription.map(({ key }) => key);
            console.log(`Upserting issues in collection`)
            const upsertChunkNumber = Math.ceil(documents.length / upsertChunkSize);
            console.log(`Upsert chunks: ${upsertChunkNumber}`)
            for (let i=0; i<upsertChunkNumber; i+=1) {
                const idsSliced = ids.slice(i*upsertChunkSize, i*upsertChunkSize + upsertChunkSize)
                const metadatasSliced = metadatas.slice(i*upsertChunkSize, i*upsertChunkSize + upsertChunkSize)
                const documentsSliced = documents.slice(i*upsertChunkSize, i*upsertChunkSize + upsertChunkSize)
                await upsertIssuesInChunks(upsertStep, documentsSliced, metadatasSliced, idsSliced, collection)
            }
            console.log(`Issues upserted`)
            collectionCount += issuesToProcess;
        }
    } catch (e) {
        console.log(e)
        throw e
    }
}