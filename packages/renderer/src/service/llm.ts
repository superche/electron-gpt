import {OpenAI} from 'langchain';
import { loadQARefineChain } from 'langchain/chains';
import { HNSWLib } from 'langchain/vectorstores/hnswlib';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import {CharacterTextSplitter} from 'langchain/text_splitter';
import type { Document } from 'langchain/document';

/**
 * Load the documents and create the vector store
 * @param text
 * @param filepath
 * @returns
 */
export async function createIndexFromText(text: string, filepath: string) {
  const splitter = new CharacterTextSplitter({
    separator: '\n',
    chunkSize: 1500,
  });

  const splits = await splitter.splitText(text);
  const metadatas = new Array(splits.length).map(() => ({source: filepath}));

  const vectorStore = await HNSWLib.fromTexts(
    splits,
    metadatas,
    new OpenAIEmbeddings(),
  );

  return vectorStore;
}

/**
 * Select the relevant documents
 * @param store
 * @param question
 * @returns
 */
export async function getRelevantDocs(store: HNSWLib, question: string) {
  const relevantDocs = await store.similaritySearch(question);

  return relevantDocs;
}

/**
 * Call the chain
 * @param relevantDocs
 * @returns
 */
export async function question(relevantDocs: Document<Record<string, any>>[]) {
  const model = new OpenAI({ temperature: 0 });
  const chain = loadQARefineChain(model);

  const res = await chain.call({
    input_documents: relevantDocs,
    question,
  });

  return res;
}

/**
 * Save the vector store to a directory
 * @param vectorStore
 * @param directory
 */
export async function saveIndexToFile(vectorStore: HNSWLib, directory: string) {
  await vectorStore.save(directory);
}

/**
 * Load the vector store from the directory
 * @param directory
 * @returns
 */
export async function loadIndex(directory: string) {
  const loadedVectorStore = await HNSWLib.load(
    directory,
    new OpenAIEmbeddings(),
  );

  return loadedVectorStore;
}
