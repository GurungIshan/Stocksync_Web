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
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { PlusCircle, Trash2, Loader2 } from 'lucide-react';
import type { Product, ProductDropdownItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '../ui/separator';
import { getToken } from '@/lib/auth';
import { getProducts, getProductsForDropdown } from '@/lib/api';
import { getUserIdFromToken } from '@/utils/jwt';

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
  const [productDropdown, setProductDropdown] = useState<ProductDropdownItem[]>([]);
  const [isProductsLoading, setIsProductsLoading] = useState(true);

  useEffect(() => {
    async function fetchProductsForSale() {
      try {
        const [fetchedProducts, fetchedProductDropdown] = await Promise.all([
          getProducts(),
          getProductsForDropdown()
        ]);
        setProducts(fetchedProducts);
        setProductDropdown(fetchedProductDropdown);
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
    return acc + (product ? product.pricePerUnit * (item.quantity || 0) : 0);
  }, 0);

  const total = subTotal - watchedDiscount + (subTotal * (watchedTax / 100));


  async function onSubmit(data: SalesFormValues) {
    setIsLoading(true);
    
    let hasValidationError = false;
    data.items.forEach((item, index) => {
      const product = products.find(p => p.id === item.productId);
      const usedStock = getUsedStock(item.productId, index);
      // If product doesn't exist, available stock is 0
      const availableStock = product ? product.stockQuantity - usedStock : 0;
      
      if (!product) {
         form.setError(`items.${index}.productId`, {
          type: "manual",
          message: `Product not selected.`
        });
        hasValidationError = true;
      }
      else if (item.quantity > availableStock) {
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

    const userId = getUserIdFromToken();
    if (!userId) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'User not authenticated. Please log in again.',
      });
      setIsLoading(false);
      return;
    }

    const payload = {
        customerPhoneNumber: data.customerPhoneNumber || null,
        newCustomer: data.customerName
          ? {
              customerName: data.customerName,
              email: data.email || null,
              address: data.address || null,
            }
          : null,
        items: data.items.map(item => ({
          productId: Number(item.productId),
          quantity: Number(item.quantity),
        })),
        discount: Number(data.discount) || 0,
        tax: Number(data.tax) || 0,
        paymentMethod: data.paymentMethod,
        userId,
      };
      
    const token = getToken();

    try {
        const response = await fetch('https://localhost:7232/api/Sales', {
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Customer Details</CardTitle>
                    <CardDescription>Enter customer information for this sale.</CardDescription>
                </CardHeader>
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
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Sale Items</CardTitle>
                    <CardDescription>Add products to the sale.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {fields.map((field, index) => {
                    const selectedProductId = form.watch(`items.${index}.productId`);
                    const selectedProduct = products.find(p => p.id === selectedProductId);
                    const usedStock = selectedProduct ? getUsedStock(selectedProduct.id, index) : 0;
                    const availableStock = selectedProduct ? selectedProduct.stockQuantity - usedStock : 0;
                    const alreadySelectedProductIds = watchedItems.map((item, i) => i !== index ? item.productId : -1);

                    return (
                        <div key={field.id} className="flex flex-col sm:flex-row items-start sm:items-end gap-4 p-4 border rounded-lg bg-background">
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
                                    {productDropdown.filter(p => !alreadySelectedProductIds.includes(p.id) || p.id === selectedProductId).map((product) => {
                                        const fullProduct = products.find(fp => fp.id === product.id);
                                        const used = fullProduct ? getUsedStock(fullProduct.id, -1) : 0;
                                        if ((fullProduct && fullProduct.stockQuantity - used > 0) || product.id === selectedProductId) {
                                            return (
                                                <SelectItem key={product.id} value={product.id.toString()}>
                                                    {product.name}
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
                                    placeholder="Enter quantity" 
                                    {...field}
                                    onChange={(e) => {
                                        const value = e.target.value === '' ? 0 : Number(e.target.value);
                                        field.onChange(value);
                                        if (value > availableStock) {
                                            form.setError(`items.${index}.quantity`, {
                                            type: 'manual',
                                            message: `Max stock: ${availableStock}.`
                                            });
                                        } else {
                                            form.clearErrors(`items.${index}.quantity`);
                                        }
                                    }}
                                />
                                </FormControl>
                                {selectedProduct ? <p className="text-xs text-muted-foreground pt-1">{`Available: ${availableStock}`}</p> : null}
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
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
        </div>

        <div className="lg:col-span-1 space-y-8 lg:sticky lg:top-24">
            <Card>
                <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>{formatCurrency(subTotal)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <FormLabel htmlFor='discount-input'>Discount</FormLabel>
                            <FormField
                                control={form.control}
                                name="discount"
                                render={({ field }) => (
                                    <FormItem className="w-24">
                                    <FormControl>
                                        <Input id="discount-input" type="number" placeholder="0" className="text-right" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex justify-between items-center">
                            <FormLabel htmlFor='tax-input'>Tax (%)</FormLabel>
                             <FormField
                                control={form.control}
                                name="tax"
                                render={({ field }) => (
                                    <FormItem className="w-24">
                                    <FormControl>
                                        <Input id="tax-input" type="number" placeholder="0" className="text-right" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                     </div>
                     <Separator />
                     <div className="flex justify-between text-xl font-bold">
                        <span>Total</span>
                        <span>{formatCurrency(total)}</span>
                    </div>
                    <Separator />
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
        </div>
      </form>
    </Form>
  );
}
