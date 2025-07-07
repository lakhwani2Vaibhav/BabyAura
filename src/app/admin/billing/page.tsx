import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

const paymentHistory = [
  {
    id: "inv-001",
    date: new Date(),
    amount: "$500.00",
    status: "Paid",
  },
  {
    id: "inv-002",
    date: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    amount: "$500.00",
    status: "Paid",
  },
  {
    id: "inv-003",
    date: new Date(new Date().setMonth(new Date().getMonth() - 2)),
    amount: "$500.00",
    status: "Paid",
  },
];

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Billing</CardTitle>
          <CardDescription>
            Manage your hospital's billing and subscription plan.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Current Plan</CardTitle>
              <Badge variant="outline" className="bg-background">
                Licensing
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">$500/month</p>
              <p className="text-sm text-muted-foreground">
                Your plan renews on {format(new Date(new Date().setDate(new Date().getDate() + 15)), "MMMM d, yyyy")}.
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Up to 20 doctors</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Unlimited patients</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Premium support</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Zap className="h-5 w-5" />
                Upgrade Plan
              </CardTitle>
              <CardDescription>
                Get access to more features and expand your operations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-semibold">Enterprise Plan</p>
              <p className="text-sm text-muted-foreground">
                For large-scale hospital networks.
              </p>
              <Button className="mt-4 w-full">Contact Sales</Button>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>
            A record of your past payments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentHistory.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>
                    {format(invoice.date, "MMMM d, yyyy")}
                  </TableCell>
                  <TableCell>{invoice.amount}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="default">{invoice.status}</Badge>
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
