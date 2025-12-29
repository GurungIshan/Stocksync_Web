'use server';

import {
  suggestReorderQuantity,
  type SuggestReorderQuantityInput,
  type SuggestReorderQuantityOutput,
} from '@/ai/flows/suggest-reorder-quantity';

export async function getReorderSuggestion(
  input: SuggestReorderQuantityInput
): Promise<SuggestReorderQuantityOutput> {
  try {
    const output = await suggestReorderQuantity(input);
    return output;
  } catch (error) {
    console.error('Error getting reorder suggestion:', error);
    throw new Error('Failed to get suggestion from AI model.');
  }
}
