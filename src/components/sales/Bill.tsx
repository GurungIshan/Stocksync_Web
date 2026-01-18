'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { DetailedSale } from '@/lib/types';
import { format, parseISO } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Printer } from 'lucide-react';

type BillProps = {
  sale: DetailedSale | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function Bill({ sale, isOpen, onClose }: BillProps) {
  const billContentRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => billContentRef.current,
  });

  if (!sale) return null;
  
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'NPR', minimumFractionDigits: 2 }).format(value);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sale Complete - Invoice</DialogTitle>
          <DialogDescription>
            Sale recorded successfully. Here is the bill.
          </DialogDescription>
        </DialogHeader>
        <div ref={billContentRef} className="p-4 border rounded-lg bg-background text-foreground">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold font-headline">StockSync</h2>
            <p className="text-sm">Kathmandu, Nepal</p>
            <p className="text-sm">Phone: 9815120639</p>
          </div>
          <Separator className="my-4" />
          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div>
              <p><strong>Invoice No:</strong> {sale.invoiceNo}</p>
              {sale.saleDate && <p><strong>Date:</strong> {format(parseISO(sale.saleDate), 'PPP p')}</p>}
            </div>
            <div className="text-right">
                <p><strong>Cashier:</strong> {sale.user.fullName}</p>
            </div>
          </div>
          <Separator className="my-4" />
          <div>
            <h3 className="font-semibold mb-2">Bill To:</h3>
            <p className="text-sm">{sale.customerName || 'Walk-in Customer'}</p>
            {sale.customerPhone && <p className="text-sm text-muted-foreground">{sale.customerPhone}</p>}
            {sale.customerEmail && <p className="text-sm text-muted-foreground">{sale.customerEmail}</p>}
            {sale.customerAddress && <p className="text-sm text-muted-foreground">{sale.customerAddress}</p>}
          </div>
          <Separator className="my-4" />
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Item</th>
                <th className="text-center py-2">Qty</th>
                <th className="text-right py-2">Price</th>
                <th className="text-right py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {sale.saleItems.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2">{item.productName}</td>
                  <td className="text-center py-2">{item.quantity}</td>
                  <td className="text-right py-2">{formatCurrency(item.pricePerUnit)}</td>
                  <td className="text-right py-2">{formatCurrency(item.totalPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Separator className="my-4" />
          <div className="w-full flex justify-end">
            <div className="w-full max-w-xs space-y-2 text-sm">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(sale.subTotal)}</span>
                </div>
                 <div className="flex justify-between">
                    <span>Discount</span>
                    <span>- {formatCurrency(sale.discount)}</span>
                </div>
                 <div className="flex justify-between">
                    <span>Tax ({sale.tax}%)</span>
                    <span>+ {formatCurrency((sale.subTotal - sale.discount) * (sale.tax / 100))}</span>
                </div>
                 <div className="flex justify-between font-bold text-base border-t pt-2 mt-2">
                    <span>Grand Total</span>
                    <span>{formatCurrency(sale.totalAmount)}</span>
                </div>
            </div>
          </div>
          <Separator className="my-4" />
           <div className="text-center text-xs text-muted-foreground">
            <p>Thank you for your purchase!</p>
            <p>Payment Method: {sale.paymentMethod}</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print Bill
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
