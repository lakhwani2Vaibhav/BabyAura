'use server';

/**
 * @fileOverview A Genkit flow for automatically generating captions for scrapbook entries.
 *
 * - generateScrapbookCaption - A function that generates a caption for a given scrapbook entry.
 * - GenerateScrapbookCaptionInput - The input type for the generateScrapbookCaption function.
 * - GenerateScrapbookCaptionOutput - The return type for the generateScrapbookCaption function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateScrapbookCaptionInputSchema = z.object({
  mediaType: z.enum(['image', 'audio', 'video']).describe('The type of media in the scrapbook entry.'),
  description: z.string().describe('A description of the scrapbook entry, provided by the user.'),
  keywords: z.string().optional().describe('Keywords related to the scrapbook entry.'),
});

export type GenerateScrapbookCaptionInput = z.infer<typeof GenerateScrapbookCaptionInputSchema>;

const GenerateScrapbookCaptionOutputSchema = z.object({
  caption: z.string().describe('The generated caption for the scrapbook entry.'),
});

export type GenerateScrapbookCaptionOutput = z.infer<typeof GenerateScrapbookCaptionOutputSchema>;

export async function generateScrapbookCaption(input: GenerateScrapbookCaptionInput): Promise<GenerateScrapbookCaptionOutput> {
  return generateScrapbookCaptionFlow(input);
}

const generateScrapbookCaptionPrompt = ai.definePrompt({
  name: 'generateScrapbookCaptionPrompt',
  input: {schema: GenerateScrapbookCaptionInputSchema},
  output: {schema: GenerateScrapbookCaptionOutputSchema},
  prompt: `You are an AI caption generator for a baby scrapbook application.  Given the following information about a scrapbook entry, generate a relevant and engaging caption.

Media Type: {{{mediaType}}}
Description: {{{description}}}
Keywords: {{{keywords}}}

Caption:`,
});

const generateScrapbookCaptionFlow = ai.defineFlow(
  {
    name: 'generateScrapbookCaptionFlow',
    inputSchema: GenerateScrapbookCaptionInputSchema,
    outputSchema: GenerateScrapbookCaptionOutputSchema,
  },
  async input => {
    const {output} = await generateScrapbookCaptionPrompt(input);
    return output!;
  }
);
