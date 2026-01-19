import type { Alert } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge, type BadgeProps } from "@/components/ui/badge";

type AlertsTableProps = {
    alerts: Alert[];
}

export default function AlertsTable({ alerts }: AlertsTableProps) {
    const getUrgencyBadgeVariant = (urgency: Alert['urgencyLevel']): BadgeProps['variant'] => {
        switch (urgency) {
            case 'HIGH': return 'destructive';
            case 'MEDIUM': return 'outline';
            default: return 'secondary';
        }
    };

    const getUrgencyRowClass = (urgency: Alert['urgencyLevel']) => {
        switch (urgency) {
            case 'HIGH': return 'bg-destructive/10 hover:bg-destructive/20';
            case 'MEDIUM': return 'bg-accent/10 hover:bg-accent/20';
            default: return '';
        }
    };

    const getUrgencyBadgeClass = (urgency: Alert['urgencyLevel']) => {
        if (urgency === 'MEDIUM') {
            return 'border-accent text-accent';
        }
        return '';
    }

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
                            <TableHead className="text-right text-accent font-medium">Suggested Qty</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {alerts.length > 0 ? (
                            alerts.map((alert) => (
                                <TableRow key={alert.productId} className={getUrgencyRowClass(alert.urgencyLevel)}>
                                    <TableCell className="font-medium">{alert.productName}</TableCell>
                                    <TableCell>
                                        <Badge 
                                            variant={getUrgencyBadgeVariant(alert.urgencyLevel)} 
                                            className={getUrgencyBadgeClass(alert.urgencyLevel)}
                                        >
                                            {alert.urgencyLevel}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center font-bold text-destructive">{alert.currentStock}</TableCell>
                                    <TableCell className="text-center">{alert.reorderPoint}</TableCell>
                                    <TableCell className="text-center">{alert.leadTimeDays}</TableCell>
                                    <TableCell className="text-right font-bold text-accent">{alert.suggestedOrderQty}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                             <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No low stock alerts. Good job!
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
