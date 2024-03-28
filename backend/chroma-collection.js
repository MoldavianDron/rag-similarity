import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OpenAIEmbeddings } from "@langchain/openai";

export const getChromaCollection = async () => {
    const collection = await (await Chroma.fromExistingCollection(
        new OpenAIEmbeddings({ 
            azureOpenAIApiKey: "516056d045d74eaa932d7879dda6cbae",
            azureOpenAIApiInstanceName: "appfireaieastus",
            azureOpenAIApiDeploymentName: "text-embedding-3-large",
            azureOpenAIApiVersion: "2023-12-01-preview",
        }),
        { collectionName: "Whiteboards", collectionMetadata: { "hnsw:space": "cosine" } },
    )).ensureCollection()
    return collection;
}

export const deleteChromaCollection = async () => {
    await (new (await Chroma.imports()).ChromaClient()).deleteCollection({ name: "Whiteboards" })
}
