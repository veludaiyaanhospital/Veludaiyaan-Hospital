import { Download } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Invoice } from "@/lib/types";

interface BillingTableProps {
  invoices: Invoice[];
  outstandingAmount: number;
  onDownloadReceipt: (invoice: Invoice) => void;
}

export function BillingTable({ invoices, outstandingAmount, onDownloadReceipt }: BillingTableProps) {
  return (
    <div className="space-y-4">
      <Card className="rounded-2xl border-amber-200 bg-amber-50">
        <CardHeader>
          <CardTitle className="text-base text-amber-900">Outstanding Dues</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-amber-900">{formatCurrency(outstandingAmount)}</p>
          <p className="mt-1 text-sm text-amber-800">Please clear unpaid invoices during your next visit.</p>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Billing Receipts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Mode</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.invoiceNumber}</TableCell>
                  <TableCell>{formatDate(invoice.date)}</TableCell>
                  <TableCell>{invoice.category}</TableCell>
                  <TableCell>
                    <Badge variant={invoice.status === "Paid" ? "success" : "warning"}>{invoice.status}</Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                  <TableCell>{invoice.paymentMode}</TableCell>
                  <TableCell className="text-right">
                    <Button onClick={() => onDownloadReceipt(invoice)} size="sm" variant="outline">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
