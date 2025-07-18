'use server';

/**
 * @fileOverview This file defines a Genkit flow for answering coding-related questions using the DeepSeek API.
 *
 * - answerCodingQuestion - A function that accepts a coding-related question and returns an answer generated by the DeepSeek API.
 * - AnswerCodingQuestionInput - The input type for the answerCodingQuestion function.
 * - AnswerCodingQuestionOutput - The return type for the answerCodingQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerCodingQuestionInputSchema = z.object({
  question: z.string().describe('The coding-related question to be answered.'),
  existingCode: z.string().optional().describe('Existing code to be incorporated into the answer.'),
});
export type AnswerCodingQuestionInput = z.infer<typeof AnswerCodingQuestionInputSchema>;

const AnswerCodingQuestionOutputSchema = z.object({
  answer: z.string().describe('The answer to the coding-related question.'),
});
export type AnswerCodingQuestionOutput = z.infer<typeof AnswerCodingQuestionOutputSchema>;

export async function answerCodingQuestion(input: AnswerCodingQuestionInput): Promise<AnswerCodingQuestionOutput> {
  return answerCodingQuestionFlow(input);
}

const answerCodingQuestionPrompt = ai.definePrompt({
  name: 'answerCodingQuestionPrompt',
  input: {schema: AnswerCodingQuestionInputSchema},
  output: {schema: AnswerCodingQuestionOutputSchema},
  prompt: `You are a coding assistant. Answer the following question:

Question: {{{question}}}

{{#if existingCode}}
Existing Code:
{{{{existingCode}}}}
{{/if}}`,
});

const answerCodingQuestionFlow = ai.defineFlow(
  {
    name: 'answerCodingQuestionFlow',
    inputSchema: AnswerCodingQuestionInputSchema,
    outputSchema: AnswerCodingQuestionOutputSchema,
  },
  async input => {
    const {output} = await answerCodingQuestionPrompt(input);
    return output!;
  }
);
