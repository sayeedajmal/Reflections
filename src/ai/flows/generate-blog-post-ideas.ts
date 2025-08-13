// This file is machine-generated - edit with care!

'use server';

/**
 * @fileOverview An AI agent for generating blog post ideas and outlines.
 *
 * - generateBlogPostIdeas - A function that handles the blog post idea generation process.
 * - GenerateBlogPostIdeasInput - The input type for the generateBlogPostIdeas function.
 * - GenerateBlogPostIdeasOutput - The return type for the generateBlogPostIdeas function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBlogPostIdeasInputSchema = z.object({
  topic: z.string().describe('The general topic for which to generate blog post ideas.'),
  keywords: z.string().describe('Comma separated keywords related to the topic.'),
  numIdeas: z.number().describe('The number of blog post ideas to generate.'),
});
export type GenerateBlogPostIdeasInput = z.infer<typeof GenerateBlogPostIdeasInputSchema>;

const GenerateBlogPostIdeasOutputSchema = z.object({
  ideas: z.array(z.string()).describe('An array of blog post ideas.'),
  outlines: z.array(z.string()).describe('An array of blog post outlines.'),
});
export type GenerateBlogPostIdeasOutput = z.infer<typeof GenerateBlogPostIdeasOutputSchema>;

export async function generateBlogPostIdeas(input: GenerateBlogPostIdeasInput): Promise<GenerateBlogPostIdeasOutput> {
  return generateBlogPostIdeasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBlogPostIdeasPrompt',
  input: {schema: GenerateBlogPostIdeasInputSchema},
  output: {schema: GenerateBlogPostIdeasOutputSchema},
  prompt: `You are a blog post idea generator. Generate {{numIdeas}} blog post ideas and outlines based on the following topic and keywords.\n\nTopic: {{{topic}}}\nKeywords: {{{keywords}}}\n\nIdeas:\n{{#each ideas}}{{{this}}}\n{{/each}}\n\nOutlines:\n{{#each outlines}}{{{this}}}\n{{/each}}`,
});

const generateBlogPostIdeasFlow = ai.defineFlow(
  {
    name: 'generateBlogPostIdeasFlow',
    inputSchema: GenerateBlogPostIdeasInputSchema,
    outputSchema: GenerateBlogPostIdeasOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
