'use client';

import { useState, useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { PlusCircle, Trash2, Loader2 } from 'lucide-react';
import type { Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '../ui/separator';
import { getToken } from '@/lib/auth';

const salesFormSchema = z.object({
  paymentMethod: z.string().min(1, 'Payment method is required.'),
  items: z
    .array(
      z.object({
        productId: z.coerce.number().min(1, 'Product is required.'),
        quantity: z.coerce.number().min(1, 'Quantity must be at least 1.'),
        pricePerUnit: z.coerce.number().optional(), // Now optional in schema
      })
    )
    .min(1, 'At least one item is required.'),
});

type SalesFormValues = z.infer<typeof salesFormSchema>;

export default function SalesForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isProductsLoading, setIsProductsLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
        const token = getToken();
        if (!token) {
            toast({
                variant: "destructive",
                title: "Authentication Error",
                description: "You must be logged in to fetch products.",
            })
            setIsProductsLoading(false);
            return;
        }

      try {
        const response = await fetch('https://localhost:7232/api/Product', {
            method: 'GET',
            headers: {
                'accept': '*/*',
                'Authorization': `Bearer ${token}`
            },
            cache: 'no-store'
        });
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        const fetchedProducts = await response.json();
        setProducts(fetchedProducts);
      } catch (error) {
        toast({
            variant: "destructive",
            title: "Failed to load products",
            description: "Could not fetch the product list. Please try again.",
        })
      } finally {
        setIsProductsLoading(false);
      }
    }
    fetchProducts();
  }, [toast]);


  const form = useForm<SalesFormValues>({
    resolver: zodResolver(salesFormSchema),
    defaultValues: {
      items: [{ productId: 0, quantity: 1 }],
      paymentMethod: 'Cash',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });
  
  const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'NPR', minimumFractionDigits: 0 }).format(value);

  const watchedItems = form.watch('items');
  const total = watchedItems.reduce((acc, item) => {
    const product = products.find((p) => p.id === item.productId);
    return acc + (product ? product.pricePerUnit * item.quantity : 0);
  }, 0);


  async function onSubmit(data: SalesFormValues) {
    setIsLoading(true);
    const token = getToken();
    if (!token) {
        toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "You must be logged in to record a sale.",
        });
        setIsLoading(false);
        return;
    }

    const itemsPayload = data.items.map(item => {
        const product = products.find(p => p.id === item.productId);
        return {
            productId: item.productId,
            quantity: item.quantity,
            pricePerUnit: product ? product.pricePerUnit : 0,
        };
    });

    try {
        const response = await fetch('https://localhost:7232/api/Sale', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                paymentMethod: data.paymentMethod,
                items: itemsPayload,
            })
        });

        if (response.ok) {
            toast({
              title: 'Sale Recorded',
              description: 'The new sale has been successfully added.',
            });
            form.reset();
        } else {
             const errorData = await response.json().catch(() => ({ message: 'Failed to record sale. Please try again.' }));
             toast({
                variant: 'destructive',
                title: 'Sale Failed',
                description: errorData.message || 'An unknown error occurred.',
            });
        }
    } catch (error) {
         toast({
            variant: 'destructive',
            title: 'Network Error',
            description: 'Could not connect to the server. Please try again later.',
        });
    } finally {
        setIsLoading(false);
    }
  }

  if (isProductsLoading) {
    return (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Sale Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => {
              const selectedProductId = form.watch(`items.${index}.productId`);
              const selectedProduct = products.find(p => p.id === selectedProductId);

              return (
                <div key={field.id} className="flex flex-col sm:flex-row items-start sm:items-end gap-4 p-4 border rounded-lg">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 w-full">
                  <FormField
                    control={form.control}
                    name={`items.${index}.productId`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product</FormLabel>
                        <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value > 0 ? field.value.toString() : ""}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a product" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {products.map((product) => (
                              <SelectItem key={product.id} value={product.id.toString()}>
                                {product.productName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                           <Input 
                            type="number" 
                            placeholder="1" {...field} 
                            max={selectedProduct ? selectedProduct.stockQuantity : undefined}
                            min={1}
                           />
                        </FormControl>
                        {selectedProduct && <p className="text-xs text-muted-foreground pt-1">Stock available: {selectedProduct.stockQuantity}</p>}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  </div>
                  <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove item</span>
                  </Button>
                </div>
            )})}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => append({ productId: 0, quantity: 1 })}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle>Payment & Summary</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Payment Method</FormLabel>
                         <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                <SelectValue placeholder="Select payment method" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Cash">Cash</SelectItem>
                                <SelectItem value="Card">Card</SelectItem>
                                <SelectItem value="Digital">Digital</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                </div>
                 <Separator className="my-4" />
                 <div className="space-y-2 text-right">
                     <div className="flex justify-between text-xl font-bold">
                        <span>Total</span>
                        <span>{formatCurrency(total)}</span>
                    </div>
                 </div>


            </CardContent>
            <CardFooter>
                 <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                        <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                        </>
                    ) : (
                        'Complete Sale'
                    )}
                </Button>
            </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
