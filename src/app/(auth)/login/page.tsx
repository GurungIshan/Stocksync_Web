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
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
       <div className="mx-auto w-full max-w-[350px] space-y-6">
        <div className="space-y-2 text-center">
            <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Package className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold font-headline">StockSync</h1>
            <p className="text-balance text-muted-foreground">
                Welcome! Please sign in to continue.
            </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            {/* <CardDescription>Enter your credentials to access your account.</CardDescription> */}
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
