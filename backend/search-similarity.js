import { getChromaCollection } from "./chroma-collection.js";
import { cleanData } from "./clean-text.js";

export const searchSimilarity = async (sentence, nResults=3) => {
    const collection = await getChromaCollection();
    const queryResult = await collection.query({
        nResults, // n_results
        queryTexts: [sentence], // query_text
    });
    const [metadatas] = queryResult.metadatas;
    const [documents] = queryResult.documents;
    const [distances] = queryResult.distances;

    const resultLength = metadatas.length;

    if (resultLength === 0) {
        return []
    }
    
    const searchResult = []
    for (let i=0; i < Math.max(nResults, resultLength); i+=1) {
        const searchResultElement = {
            issueKey: metadatas[i]["key"],
            issueText: documents[i],
            distance: distances[i],
        }
        searchResult.push(searchResultElement)
    }
    return searchResult
}