'use client';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BrainCircuit, Loader2 } from 'lucide-react';
import { type Alert } from '@/lib/types';
import { getReorderSuggestion } from '@/app/(app)/alerts/actions';
import type { SuggestReorderQuantityOutput } from '@/ai/flows/suggest-reorder-quantity';

type ReorderSuggestionProps = {
  alert: Alert;
};

export default function ReorderSuggestion({ alert }: ReorderSuggestionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestion, setSuggestion] = useState<SuggestReorderQuantityOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetSuggestion = async () => {
    setIsLoading(true);
    setError(null);
    setSuggestion(null);

    const historicalDemand = [
      { date: '2023-01-10', quantity: Math.floor(Math.random() * 5) + 1 },
      { date: '2023-02-15', quantity: Math.floor(Math.random() * 5) + 2 },
      { date: '2023-03-20', quantity: Math.floor(Math.random() * 5) + 3 },
    ];

    try {
      const result = await getReorderSuggestion({
        productId: alert.productId,
        productName: alert.productName,
        currentStock: alert.currentStock,
        reorderPoint: alert.reorderPoint,
        historicalDemand,
        leadTimeDays: 14,
      });
      setSuggestion(result);
    } catch (e) {
      setError('Failed to get suggestion. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" onClick={handleGetSuggestion}>
          <BrainCircuit className="mr-2 h-4 w-4" />
          Get Suggestion
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>AI Reorder Suggestion for {alert.productName}</DialogTitle>
          <DialogDescription>
            Based on historical data and lead times, here's a suggested reorder quantity.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {isLoading && (
            <div className="flex flex-col items-center justify-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p>Analyzing data...</p>
            </div>
          )}
          {error && <p className="text-destructive">{error}</p>}
          {suggestion && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Suggested Quantity</p>
                <p className="text-6xl font-bold text-accent">{suggestion.suggestedQuantity}</p>
              </div>
              <div>
                <h4 className="font-semibold">Reasoning:</h4>
                <p className="text-sm text-muted-foreground">{suggestion.reasoning}</p>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>Close</Button>
            <Button>Create Purchase Order</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
