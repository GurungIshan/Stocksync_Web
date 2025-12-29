'use client';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Trash2, CreditCard, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { PaymentModal } from './PaymentModal';

export function Cart() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
  
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'NPR', minimumFractionDigits: 0 }).format(value);

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-6 w-6"/>
            Current Order
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto p-4">
        {cartItems.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
             <ShoppingCart className="h-16 w-16 mb-4"/>
            <p className="text-lg font-medium">Your cart is empty</p>
            <p className="text-sm">Add products to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.product.id} className="flex items-center gap-4">
                <Image
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  width={64}
                  height={64}
                  className="rounded-md object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-sm text-muted-foreground">{formatCurrency(item.product.price)}</p>
                </div>
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value))}
                  className="h-9 w-16 text-center"
                  min="0"
                  max={item.product.stock}
                />
                <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.product.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      {cartItems.length > 0 && (
        <CardFooter className="flex-col items-stretch gap-4 border-t p-4">
            <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{formatCurrency(cartTotal)}</span>
            </div>
            <Separator />
            <PaymentModal cartTotal={cartTotal} />
        </CardFooter>
      )}
    </Card>
  );
}
