'use server';

/**
 * @fileOverview Translates a code snippet from one language to another.
 *
 * - translateCodeSnippet - A function that translates the code snippet.
 * - TranslateCodeSnippetInput - The input type for the translateCodeSnippet function.
 * - TranslateCodeSnippetOutput - The return type for the translateCodeSnippet function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateCodeSnippetInputSchema = z.object({
  codeSnippet: z.string().describe('The code snippet to translate.'),
  sourceLanguage: z.string().describe('The original language of the code snippet.'),
  targetLanguage: z.string().describe('The desired language to translate the code snippet to.'),
});
export type TranslateCodeSnippetInput = z.infer<typeof TranslateCodeSnippetInputSchema>;

const TranslateCodeSnippetOutputSchema = z.object({
  translatedCode: z.string().describe('The translated code snippet.'),
});
export type TranslateCodeSnippetOutput = z.infer<typeof TranslateCodeSnippetOutputSchema>;

export async function translateCodeSnippet(input: TranslateCodeSnippetInput): Promise<TranslateCodeSnippetOutput> {
  return translateCodeSnippetFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translateCodeSnippetPrompt',
  input: {schema: TranslateCodeSnippetInputSchema},
  output: {schema: TranslateCodeSnippetOutputSchema},
  prompt: `You are a code translation expert. You will be given a code snippet, the source language, and the target language. You will respond with the translated code in the target language.

Source Language: {{{sourceLanguage}}}
Target Language: {{{targetLanguage}}}
Code Snippet:
\`\`\`{{{sourceLanguage}}}
{{{codeSnippet}}}
\`\`\`

Translated Code:
\`\`\`{{{targetLanguage}}}
`,
});

const translateCodeSnippetFlow = ai.defineFlow(
  {
    name: 'translateCodeSnippetFlow',
    inputSchema: TranslateCodeSnippetInputSchema,
    outputSchema: TranslateCodeSnippetOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {
      translatedCode: output?.translatedCode ?? 'Translation failed.',
    };
  }
);
