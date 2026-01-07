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
import { getProducts } from '@/lib/api';

const salesFormSchema = z.object({
  customerPhoneNumber: z.string().optional(),
  customerName: z.string().optional(),
  email: z.string().email({ message: "Invalid email address."}).optional().or(z.literal('')),
  address: z.string().optional(),
  paymentMethod: z.string().min(1, 'Payment method is required.'),
  items: z
    .array(
      z.object({
        productId: z.coerce.number().min(1, 'Product is required.'),
        quantity: z.coerce.number().min(1, 'Quantity must be at least 1.'),
      })
    )
    .min(1, 'At least one item is required.'),
    discount: z.coerce.number().min(0, "Discount can't be negative.").optional(),
    tax: z.coerce.number().min(0, "Tax can't be negative.").optional(),
});

type SalesFormValues = z.infer<typeof salesFormSchema>;

export default function SalesForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isProductsLoading, setIsProductsLoading] = useState(true);

  useEffect(() => {
    async function fetchProductsForSale() {
      try {
        const fetchedProducts = await getProducts();
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
    fetchProductsForSale();
  }, [toast]);


  const form = useForm<SalesFormValues>({
    resolver: zodResolver(salesFormSchema),
    defaultValues: {
      customerPhoneNumber: '',
      customerName: '',
      email: '',
      address: '',
      items: [{ productId: 0, quantity: 1 }],
      paymentMethod: 'Cash',
      discount: 0,
      tax: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });
  
  const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'NPR', minimumFractionDigits: 0 }).format(value);

  const watchedItems = form.watch('items');
  const watchedDiscount = form.watch('discount') || 0;
  const watchedTax = form.watch('tax') || 0;

  const subTotal = watchedItems.reduce((acc, item) => {
    const product = products.find((p) => p.id === item.productId);
    return acc + (product ? product.pricePerUnit * item.quantity : 0);
  }, 0);

  const total = subTotal - watchedDiscount + (subTotal * (watchedTax / 100));


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
    
    let hasValidationError = false;
    data.items.forEach((item, index) => {
      const product = products.find(p => p.id === item.productId);
      const usedStock = getUsedStock(item.productId, index);
      const availableStock = product ? product.stockQuantity - usedStock : 0;
      
      if (item.quantity > availableStock) {
        form.setError(`items.${index}.quantity`, {
          type: "manual",
          message: `Cannot exceed available stock of ${availableStock}.`
        });
        hasValidationError = true;
      }
    });

    if (hasValidationError) {
      setIsLoading(false);
      return;
    }

    const payload = {
        customerPhoneNumber: data.customerPhoneNumber,
        newCustomer: {
            customerName: data.customerName,
            email: data.email,
            address: data.address,
        },
        items: data.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
        })),
        discount: data.discount || 0,
        tax: data.tax || 0,
        paymentMethod: data.paymentMethod.toLowerCase(),
    };

    try {
        const response = await fetch('https://localhost:7232/api/Sale', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
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

  const getUsedStock = (productId: number, currentIndex: number) => {
    return watchedItems.reduce((acc, item, index) => {
      if (item.productId === productId && index !== currentIndex) {
        return acc + (Number(item.quantity) || 0);
      }
      return acc;
    }, 0);
  };


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
              const usedStock = selectedProduct ? getUsedStock(selectedProduct.id, index) : 0;
              const availableStock = selectedProduct ? selectedProduct.stockQuantity - usedStock : 0;
              const alreadySelectedProductIds = watchedItems.map((item, i) => i !== index ? item.productId : -1);

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
                            {products.filter(p => !alreadySelectedProductIds.includes(p.id) || p.id === selectedProductId).map((product) => {
                                const used = getUsedStock(product.id, -1);
                                if (product.stockQuantity - used > 0 || product.id === selectedProductId) {
                                    return (
                                        <SelectItem key={product.id} value={product.id.toString()}>
                                            {product.productName}
                                        </SelectItem>
                                    )
                                }
                                return null;
                            })}
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
                            placeholder="1" 
                            {...field}
                            max={selectedProduct ? availableStock : undefined}
                            min={1}
                            onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                           />
                        </FormControl>
                         {selectedProduct ? <p className="text-xs text-muted-foreground pt-1">{`Stock available: ${availableStock}`}</p> : null}
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
             <Separator className="my-4" />
             <div className="space-y-2 text-right">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subTotal)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Discount</span>
                    <span>- {formatCurrency(watchedDiscount)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Tax ({watchedTax}%)</span>
                    <span>+ {formatCurrency(subTotal * (watchedTax / 100))}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                </div>
            </div>
          </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle>Customer & Order Details</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter customer name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                <FormField
                    control={form.control}
                    name="customerPhoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer Phone</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="Enter phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="customer@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="discount"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Discount (Nrs.)</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="tax"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Tax (%)</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
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
