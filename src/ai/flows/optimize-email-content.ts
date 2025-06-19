'use server';

/**
 * @fileOverview AI-powered email content optimization flow.
 *
 * This file defines a Genkit flow that suggests improvements to email subject and body to increase open and click-through rates.
 * It includes:
 * - `optimizeEmailContent`: The main function to trigger the email optimization flow.
 * - `OptimizeEmailContentInput`: The input type for the optimizeEmailContent function.
 * - `OptimizeEmailContentOutput`: The output type for the optimizeEmailContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const OptimizeEmailContentInputSchema = z.object({
  subject: z.string().describe('The subject line of the email.'),
  body: z.string().describe('The body of the email.'),
  campaignGoal: z.string().describe('The goal of the email campaign (e.g., increase sales, promote a product).'),
  targetAudience: z.string().describe('Description of the target audience for the email campaign.'),
});
export type OptimizeEmailContentInput = z.infer<typeof OptimizeEmailContentInputSchema>;

// Define the output schema
const OptimizeEmailContentOutputSchema = z.object({
  optimizedSubject: z.string().describe('The optimized subject line suggestion.'),
  optimizedBody: z.string().describe('The optimized body suggestion.'),
  explanation: z.string().describe('Explanation of the changes and why they were suggested.'),
});
export type OptimizeEmailContentOutput = z.infer<typeof OptimizeEmailContentOutputSchema>;


export async function optimizeEmailContent(input: OptimizeEmailContentInput): Promise<OptimizeEmailContentOutput> {
  return optimizeEmailContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeEmailContentPrompt',
  input: {schema: OptimizeEmailContentInputSchema},
  output: {schema: OptimizeEmailContentOutputSchema},
  prompt: `You are an AI email marketing expert. You will suggest improvements to the subject line and body of an email to increase open and click-through rates. Consider the campaign goal and target audience when making your suggestions.

Original Subject: {{{subject}}}
Original Body: {{{body}}}
Campaign Goal: {{{campaignGoal}}}
Target Audience: {{{targetAudience}}}

Provide the optimized subject line, optimized body, and a brief explanation of your changes.

Optimize the email content to be more engaging and persuasive to achieve the campaign goal for the target audience.

Output:
Optimized Subject: 
Optimized Body: 
Explanation: `,
});

const optimizeEmailContentFlow = ai.defineFlow(
  {
    name: 'optimizeEmailContentFlow',
    inputSchema: OptimizeEmailContentInputSchema,
    outputSchema: OptimizeEmailContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
