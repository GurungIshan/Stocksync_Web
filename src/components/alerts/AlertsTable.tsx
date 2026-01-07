
import type { Alert } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import ReorderSuggestion from "./ReorderSuggestion";

type AlertsTableProps = {
    alerts: Alert[];
}

export default function AlertsTable({ alerts }: AlertsTableProps) {
    const getUrgencyBadge = (urgency: Alert['urgencyLevel']) => {
        switch (urgency) {
            case 'HIGH': return 'destructive';
            case 'MEDIUM': return 'default';
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
                            <TableHead className="text-center">Lead Time (Days)</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {alerts.map((alert) => (
                            <TableRow key={alert.productId}>
                                <TableCell className="font-medium">{alert.productName}</TableCell>
                                <TableCell>
                                    <Badge variant={getUrgencyBadge(alert.urgencyLevel)}>{alert.urgencyLevel}</Badge>
                                </TableCell>
                                <TableCell className="text-center">{alert.currentStock}</TableCell>
                                <TableCell className="text-center">{alert.reorderPoint}</TableCell>
                                <TableCell className="text-center">{alert.leadTimeDays}</TableCell>
                                <TableCell className="text-right">
                                    {/* The ReorderSuggestion component might need adjustments if its props depend on the old Alert type */}
                                    {/* <ReorderSuggestion alert={alert} /> */}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
