import SalesForm from "@/components/sales/SalesForm";

export default function SalesPage() {
    return (
        <div className="flex flex-col gap-6">
             <h1 className="text-3xl font-bold font-headline">Record a New Sale</h1>
             <SalesForm />
        </div>
    )
}
