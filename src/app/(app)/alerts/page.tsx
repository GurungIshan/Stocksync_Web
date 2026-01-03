'use client';

import { useState, useEffect } from 'react';
import AlertsTable from "@/components/alerts/AlertsTable";
import { getReorderAlerts } from "@/lib/api";
import type { Alert } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function AlertsPage() {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAlerts = async () => {
            setLoading(true);
            const fetchedAlerts = await getReorderAlerts();
            setAlerts(fetchedAlerts);
            setLoading(false);
        };
        fetchAlerts();
    }, []);

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold font-headline">Reorder Alerts</h1>
            {loading ? (
                 <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                 </div>
            ) : (
                <AlertsTable alerts={alerts} />
            )}
        </div>
    );
}
