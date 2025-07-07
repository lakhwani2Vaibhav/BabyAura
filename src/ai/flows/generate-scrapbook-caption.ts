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
  prompt: `You are a warm and creative AI assistant for a baby scrapbook app called BabyAura. Your task is to write a heartfelt and engaging caption for a memory.

The parent has provided the following details:
- Media Type: {{{mediaType}}}
- Description of the memory: {{{description}}}
{{#if keywords}}- Keywords: {{{keywords}}}{{/if}}

Based on these details, write a caption that is:
- Positive and loving in tone.
- One or two sentences long.
- Evokes emotion and captures the essence of the moment.

Examples:
- Description: "Baby's first time laughing out loud at the dog." -> Caption: "Pure joy is hearing that first real belly laugh. Our furry friend is officially the best comedian in the house!"
- Description: "Fell asleep in the middle of eating spaghetti." -> Caption: "The spaghetti was just too good to stay awake for. A true foodie in the making!"

Now, generate a caption for the parent's memory.
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
