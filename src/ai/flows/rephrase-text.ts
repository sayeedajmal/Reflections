'use server';
/**
 * @fileOverview An AI agent for rephrasing and formatting text.
 *
 * - rephraseText - A function that handles rephrasing and formatting text.
 * - RephraseTextInput - The input type for the rephraseText function.
 * - RephraseTextOutput - The return type for the rephraseText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RephraseTextInputSchema = z.object({
  text: z.string().describe('The text to rephrase and format.'),
});
export type RephraseTextInput = z.infer<typeof RephraseTextInputSchema>;

const RephraseTextOutputSchema = z.object({
  rephrasedText: z.string().describe('The rephrased and formatted HTML text.'),
});
export type RephraseTextOutput = z.infer<typeof RephraseTextOutputSchema>;

export async function rephraseText(input: RephraseTextInput): Promise<RephraseTextOutput> {
  return rephraseTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'rephraseTextPrompt',
  input: {schema: RephraseTextInputSchema},
  output: {schema: RephraseTextOutputSchema},
  prompt: `You are an expert content editor and writing assistant. 
Your task is to take a piece of text and not only rephrase it to be more clear, concise, and engaging, but also to format it as a well-structured block of HTML suitable for a blog post.

- Use HTML tags like <h2>, <h3>, <p>, <ul>, <li>, <strong>, and <em> to structure the content.
- Break down long paragraphs into smaller, more readable ones.
- Use headings to create a clear hierarchy.
- Use bold or italic tags to emphasize key points.
- If the text contains a sequence of items, format them as an unordered list (<ul>).
- Do not use <body> or <html> tags. The output should be a snippet of HTML that can be inserted directly into an existing document.

Original Text:
{{{text}}}

Rephrased and Formatted HTML:
`,
});

const rephraseTextFlow = ai.defineFlow(
  {
    name: 'rephraseTextFlow',
    inputSchema: RephraseTextInputSchema,
    outputSchema: RephraseTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
