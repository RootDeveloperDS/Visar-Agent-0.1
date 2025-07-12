import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

declare global {
  var process: {
    env: {
      GEMINI_API_KEY?: string;
    };
  };
}

const defaultApiKey = process.env.GEMINI_API_KEY || '';

export const ai = genkit({
  plugins: [googleAI({
    apiKey: defaultApiKey,
  })],
  model: 'googleai/gemini-2.0-flash',
});
