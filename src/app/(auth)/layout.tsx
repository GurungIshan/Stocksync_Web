import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="relative hidden bg-muted lg:block">
         <Image
            src="https://images.unsplash.com/photo-1586790170083-2f9ce2712248?q=80&w=1974&auto=format&fit=crop"
            alt="Inventory management"
            layout="fill"
            objectFit="cover"
            data-ai-hint="inventory warehouse"
        />
        <div className="absolute inset-0 bg-primary/60" />
        <div className="relative z-10 flex h-full flex-col justify-end p-10 text-primary-foreground">
            <div className="mb-4">
                 <h2 className="text-4xl font-bold font-headline">Streamline Your Inventory</h2>
                <p className="mt-2 text-lg">
                    Efficiently manage your stock, track sales, and get smart insights to grow your business.
                </p>
            </div>
        </div>
      </div>
      <div className="flex items-center justify-center py-12">
        {children}
      </div>
    </div>
  );
}
