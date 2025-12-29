import type { Alert } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import ReorderSuggestion from "./ReorderSuggestion";

type AlertsTableProps = {
    alerts: Alert[];
}

export default function AlertsTable({ alerts }: AlertsTableProps) {
    const getUrgencyBadge = (urgency: Alert['urgency']) => {
        switch (urgency) {
            case 'Critical': return 'destructive';
            case 'Warning': return 'default';
            default: return 'secondary';
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Low Stock Items</CardTitle>
                <CardDescription>
                    These products have fallen below their reorder point and may need to be restocked.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Urgency</TableHead>
                            <TableHead className="text-center">Current Stock</TableHead>
                            <TableHead className="text-center">Reorder Point</TableHead>
                            <TableHead className="text-center">Days Until Stockout</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {alerts.map((alert) => (
                            <TableRow key={alert.id}>
                                <TableCell className="font-medium">{alert.productName}</TableCell>
                                <TableCell>
                                    <Badge variant={getUrgencyBadge(alert.urgency)}>{alert.urgency}</Badge>
                                </TableCell>
                                <TableCell className="text-center">{alert.currentStock}</TableCell>
                                <TableCell className="text-center">{alert.reorderPoint}</TableCell>
                                <TableCell className="text-center">{alert.daysUntilStockout}</TableCell>
                                <TableCell className="text-right">
                                    <ReorderSuggestion alert={alert} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
