import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OpenAIEmbeddings } from "@langchain/openai";

export const getChromaCollection = async () => {
    const collection = await (await Chroma.fromExistingCollection(
        new OpenAIEmbeddings({ 
            azureOpenAIApiKey: process.env.AZURE_OPEN_AI_API_KEY,
            azureOpenAIApiInstanceName: process.env.AZURE_OPEN_AI_API_INSTANCE_NAME,
            azureOpenAIApiDeploymentName: process.env.AZURE_OPEN_AI_API_DEPLOYMENT_NAME,
            azureOpenAIApiVersion: process.env.AZURE_OPEN_AI_API_VERSION,
        }),
        { collectionName: "Whiteboards", collectionMetadata: { "hnsw:space": "cosine" } },
    )).ensureCollection()
    return collection;
}

export const deleteChromaCollection = async () => {
    await (new (await Chroma.imports()).ChromaClient()).deleteCollection({ name: "Whiteboards" })
}
