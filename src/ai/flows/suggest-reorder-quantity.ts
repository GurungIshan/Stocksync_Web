'use server';
/**
 * @fileOverview AI-powered reorder quantity suggestion flow.
 *
 * - suggestReorderQuantity - A function that suggests the quantity of a product to reorder.
 * - SuggestReorderQuantityInput - The input type for the suggestReorderQuantity function.
 * - SuggestReorderQuantityOutput - The return type for the suggestReorderQuantity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestReorderQuantityInputSchema = z.object({
  productId: z.string().describe('The ID of the product to reorder.'),
  productName: z.string().describe('The name of the product.'),
  currentStock: z.number().describe('The current stock quantity of the product.'),
  reorderPoint: z.number().describe('The reorder point of the product.'),
  historicalDemand: z
    .array(z.object({date: z.string(), quantity: z.number()}))
    .describe('Historical demand data for the product.'),
  leadTimeDays: z.number().describe('The lead time in days for the product.'),
  seasonality: z.string().optional().describe('Any seasonal demand patterns for the product.'),
});
export type SuggestReorderQuantityInput = z.infer<typeof SuggestReorderQuantityInputSchema>;

const SuggestReorderQuantityOutputSchema = z.object({
  suggestedQuantity: z
    .number()
    .describe('The suggested reorder quantity based on historical demand, lead time, and seasonality.'),
  reasoning: z.string().describe('The AI reasoning behind the suggested quantity.'),
});
export type SuggestReorderQuantityOutput = z.infer<typeof SuggestReorderQuantityOutputSchema>;

export async function suggestReorderQuantity(
  input: SuggestReorderQuantityInput
): Promise<SuggestReorderQuantityOutput> {
  return suggestReorderQuantityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestReorderQuantityPrompt',
  input: {schema: SuggestReorderQuantityInputSchema},
  output: {schema: SuggestReorderQuantityOutputSchema},
  prompt: `You are an expert inventory management specialist. Your goal is to suggest the optimal reorder quantity for a given product to minimize stockouts while avoiding excess inventory.

  Consider the following factors:
  * Historical Demand: Analyze the provided historical demand data to identify trends and patterns.
  * Lead Time: Account for the lead time required to receive the reordered products.
  * Seasonality: Adjust the reorder quantity based on any seasonal demand fluctuations.

  Product Details:
  * Product Name: {{{productName}}}
  * Current Stock: {{{currentStock}}}
  * Reorder Point: {{{reorderPoint}}}
  * Lead Time (Days): {{{leadTimeDays}}}
  {{#if seasonality}}
  * Seasonality: {{{seasonality}}}
  {{/if}}

  Historical Demand Data:
  {{#each historicalDemand}}
  * Date: {{{date}}}, Quantity: {{{quantity}}}
  {{/each}}

  Based on this information, what is the suggested reorder quantity for {{{productName}}}, and what is your reasoning? Be specific about how you are considering the historical demand, lead time and seasonality to arrive at your suggested quantity. Ensure that the reorder quantity will cover demand during the lead time, and maintain the stock level above the reorder point, while also considering any historical trends and seasonality to avoid overstocking.

  The suggestedQuantity should be a number, and the reasoning should be a detailed explanation of your decision-making process.

  Remember to output in JSON format according to the schema.
  `,
});

const suggestReorderQuantityFlow = ai.defineFlow(
  {
    name: 'suggestReorderQuantityFlow',
    inputSchema: SuggestReorderQuantityInputSchema,
    outputSchema: SuggestReorderQuantityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
