import { LoginForm } from '@/components/auth/LoginForm';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Package } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="mx-auto grid w-[350px] gap-6">
        <div className="grid gap-2 text-center">
            <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Package className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold font-headline">StockSync</h1>
            <p className="text-balance text-muted-foreground">
                Welcome! Please sign in to continue.
            </p>
        </div>
        <LoginForm />
    </div>
  );
}
