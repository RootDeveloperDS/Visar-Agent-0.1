'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating code snippets based on user prompts and selected language.
 *
 * - generateCodeSnippet - A function that orchestrates the code generation process.
 * - GenerateCodeSnippetInput - The input type for the generateCodeSnippet function.
 * - GenerateCodeSnippetOutput - The return type for the generateCodeSnippet function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const GenerateCodeSnippetInputSchema = z.object({
  prompt: z.string().describe('A description of the desired code snippet.'),
  language: z.string().describe('The programming language for the code snippet.'),
  existingCode: z.string().optional().describe('Existing code to incorporate into the generated snippet.'),
  apiKey: z.string().nullable().optional().describe('Optional API key for Google AI.'),
});

export type GenerateCodeSnippetInput = z.infer<typeof GenerateCodeSnippetInputSchema>;

const GenerateCodeSnippetOutputSchema = z.object({
  code: z.string().describe('The generated code snippet.'),
});

export type GenerateCodeSnippetOutput = z.infer<typeof GenerateCodeSnippetOutputSchema>;

export async function generateCodeSnippet(input: GenerateCodeSnippetInput): Promise<GenerateCodeSnippetOutput> {
  return generateCodeSnippetFlow(input);
}

const generateCodeSnippetPrompt = ai.definePrompt({
  name: 'generateCodeSnippetPrompt',
  input: {schema: GenerateCodeSnippetInputSchema},
  output: {schema: GenerateCodeSnippetOutputSchema},
  prompt: `You are an expert software developer who can generate code snippets in various programming languages.

  The user will provide a description of the desired code snippet and the programming language.
  You should generate a code snippet that meets the user's requirements.

  Description: {{{prompt}}}
  Language: {{{language}}}

  {{#if existingCode}}
  Incorporate the following existing code into the generated snippet:
  {{{existingCode}}}
  {{/if}}

  Here is the generated code snippet:
  `,
});

const generateCodeSnippetFlow = ai.defineFlow(
  {
    name: 'generateCodeSnippetFlow',
    inputSchema: GenerateCodeSnippetInputSchema,
    outputSchema: GenerateCodeSnippetOutputSchema,
  },
  async (input) => {
    const { apiKey, ...promptData } = input;
    let model = ai.model('googleai/gemini-2.0-flash');
    
    if (apiKey) {
      const customGoogleAI = googleAI({ apiKey });
      model = customGoogleAI.model('gemini-2.0-flash');
    }

    const {output} = await ai.generate({
      model: model,
      prompt: generateCodeSnippetPrompt.compile({input: promptData}),
      output: {
        schema: GenerateCodeSnippetOutputSchema,
      },
    });

    return output!;
  }
);
