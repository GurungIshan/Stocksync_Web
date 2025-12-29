'use client';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { CreditCard, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";

type PaymentModalProps = {
    cartTotal: number;
}

export function PaymentModal({ cartTotal }: PaymentModalProps) {
    const { clearCart } = useCart();
    const { toast } = useToast();

    const handleCheckout = () => {
        // Here you would typically integrate with a payment gateway
        toast({
            title: "Sale Completed",
            description: "The sale has been successfully processed."
        });
        clearCart();
        // Potentially close the dialog here, need state management for it.
    }
    
    const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'NPR', minimumFractionDigits: 0 }).format(value);


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="lg" className="w-full text-lg">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Proceed to Payment
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Finalize Sale</DialogTitle>
                    <DialogDescription>
                        Confirm payment method and complete the transaction.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-8">
                    <p className="text-center text-4xl font-bold tracking-tight">{formatCurrency(cartTotal)}</p>
                    <p className="text-center text-muted-foreground">Total Amount Due</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <Button variant="outline" size="lg">Cash</Button>
                    <Button variant="outline" size="lg">Card</Button>
                    <Button variant="outline" size="lg">Digital</Button>
                </div>
                <DialogFooter className="mt-4">
                    <Button size="lg" className="w-full" onClick={handleCheckout}>Confirm & Checkout</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
