import AlertsTable from "@/components/alerts/AlertsTable";
import { getReorderAlerts } from "@/lib/api";

export default async function AlertsPage() {
    const alerts = await getReorderAlerts();

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold font-headline">Reorder Alerts</h1>
            <AlertsTable alerts={alerts} />
        </div>
    );
}
