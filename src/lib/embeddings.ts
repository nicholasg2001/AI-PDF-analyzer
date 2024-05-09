import { OpenAIApi, Configuration } from 'openai-edge';

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(config)

export const getEmbeddings = async (text: string) => {

    try {
        const response = await openai.createEmbedding({
            model: 'text-embedding-ada-002',
            input: text.replace(/\n/g, ' ') //remove new lines replace with space
        })
        const result = await response.json()
        return result.data[0].embedding as number[] //returns vector

    } catch (error) {
        console.log('Error calling openi embeddings api', error);
        throw error;
    }
}