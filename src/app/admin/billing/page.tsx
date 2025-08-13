
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Zap, CreditCard, Users, Stethoscope, ArrowRight, FileUp, ShieldCheck } from "lucide-react";
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
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { adminData } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const paymentHistory = [
  {
    id: "inv-001",
    date: new Date(),
    amount: "₹500.00",
    status: "Paid",
  },
  {
    id: "inv-002",
    date: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    amount: "₹500.00",
    status: "Paid",
  },
  {
    id: "inv-003",
    date: new Date(new Date().setMonth(new Date().getMonth() - 2)),
    amount: "₹500.00",
    status: "Paid",
  },
];

const currentPlan = {
  name: "Revenue Share",
  price: 0,
  doctorLimit: "Unlimited",
  patientLimit: "Unlimited",
};

type VerificationDocument = {
    docId: string;
    name: string;
    description: string;
    status: 'Pending' | 'Uploaded' | 'Verified' | 'Rejected';
};

export default function BillingPage() {
  const doctorUsage = adminData.metrics.doctors;
  const [documents, setDocuments] = useState<VerificationDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchHospitalDocuments = async () => {
    setLoading(true);
    try {
        const token = localStorage.getItem('babyaura_token');
        const response = await fetch('/api/admin/documents', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Failed to fetch documents");
        const data = await response.json();
        setDocuments(data.documents);
    } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch verification documents.' });
    } finally {
        setLoading(false);
    }
  }

  useEffect(() => {
    fetchHospitalDocuments();
  }, []);
  
  const handleUploadDocument = async (docId: string) => {
      try {
        const token = localStorage.getItem('babyaura_token');
        const response = await fetch(`/api/admin/documents/upload`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ docId })
        });
        if (!response.ok) throw new Error("Failed to upload document");

        toast({ title: 'Document "Uploaded"', description: 'Your document is now pending verification by the superadmin.' });
        fetchHospitalDocuments(); // Refresh the list
      } catch (error) {
          toast({ variant: 'destructive', title: 'Error', description: 'Could not upload the document.' });
      }
  }

  const getStatusBadge = (status: VerificationDocument['status']) => {
      switch (status) {
          case 'Verified':
              return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200">Verified</Badge>;
          case 'Uploaded':
                return <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200">Uploaded</Badge>;
          case 'Rejected':
                return <Badge variant="destructive">Rejected</Badge>;
          default:
               return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200">Pending</Badge>;
      }
  }

  return (
    <div className="space-y-6">
       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Billing & Partnership Model</h1>
          <p className="text-muted-foreground">
            Manage your partnership, payment methods, and view your invoice history.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                  <CardTitle>Current Partnership Model</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                  <div className="p-6 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="flex justify-between items-start">
                        <h4 className="text-lg font-semibold">{currentPlan.name}</h4>
                        <Badge variant="outline" className="bg-background">Active</Badge>
                    </div>
                    <p className="text-3xl font-bold mt-2">₹0<span className="text-base font-normal text-muted-foreground">/month upfront</span></p>
                    <p className="text-sm text-muted-foreground">
                        Your revenue share is paid out monthly.
                    </p>
                     <ul className="mt-4 space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span>{currentPlan.doctorLimit} doctors</span>
                        </li>
                        <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span>{currentPlan.patientLimit} patients</span>
                        </li>
                        <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span>In-house specialist team included</span>
                        </li>
                    </ul>
                  </div>
                   <Card className="shadow-none">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Zap className="h-5 w-5" />
                            Explore Other Models
                        </CardTitle>
                        <CardDescription>
                            Consider a fixed licensing fee or our all-inclusive BabyAura 360° partnership.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="font-semibold">Licensing Plan</p>
                        <p className="text-sm text-muted-foreground mb-4">
                           Predictable monthly costs for large-scale operations.
                        </p>
                         <p className="font-semibold">BabyAura 360°</p>
                        <p className="text-sm text-muted-foreground mb-4">
                           Our premium revenue-share model with a dedicated specialist team.
                        </p>
                        <Button className="mt-4 w-full">Contact Sales</Button>
                    </CardContent>
                </Card>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5" />
                        KYC & Verification Documents
                    </CardTitle>
                    <CardDescription>
                        Upload the required documents to complete your hospital verification for payouts.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {loading ? (
                        <div className="space-y-4">
                            <Skeleton className="h-20 w-full" />
                            <Skeleton className="h-20 w-full" />
                            <Skeleton className="h-20 w-full" />
                        </div>
                    ) : (
                       documents.map(doc => (
                            <div key={doc.docId} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg gap-4">
                                <div>
                                    <p className="font-semibold">{doc.name}</p>
                                    <p className="text-sm text-muted-foreground">{doc.description}</p>
                                </div>
                                <div className="flex items-center gap-4 flex-shrink-0">
                                    {getStatusBadge(doc.status)}
                                    <Button variant="outline" size="sm" onClick={() => handleUploadDocument(doc.docId)} disabled={doc.status !== 'Pending'}>
                                        <FileUp className="mr-2 h-4 w-4" />
                                        {doc.status === 'Pending' ? 'Upload' : 'Re-Upload'}
                                    </Button>
                                </div>
                            </div>
                       ))
                    )}
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                    <CardDescription>A record of your past payments and revenue share payouts.</CardDescription>
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
                                <Badge variant="secondary" className="text-green-700 bg-green-500/20">{invoice.status}</Badge>
                            </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5" /> Payout Method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/50">
                   <div className="flex-shrink-0">
                       <CreditCard className="h-8 w-8 text-muted-foreground" />
                   </div>
                   <div className="flex-grow">
                        <p className="font-semibold">Bank Account ending in 1234</p>
                        <p className="text-sm text-muted-foreground">General Hospital Inc.</p>
                   </div>
                </div>
              </CardContent>
               <CardFooter>
                 <Button variant="outline" asChild className="w-full">
                    <Link href="/admin/billing/manage">
                        Manage Payout Method <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                </Button>
              </CardFooter>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> Current Usage</CardTitle>
                    <CardDescription>Your usage based on your current plan.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <p className="text-sm font-medium flex items-center gap-2"><Stethoscope className="h-4 w-4"/> Doctors</p>
                            <p className="text-sm">{doctorUsage} / {currentPlan.doctorLimit}</p>
                        </div>
                        <Progress value={100} />
                    </div>
                     <div>
                        <div className="flex justify-between items-center mb-1">
                            <p className="text-sm font-medium flex items-center gap-2"><Users className="h-4 w-4"/> Patients</p>
                            <p className="text-sm">{adminData.metrics.parents} / {currentPlan.patientLimit}</p>
                        </div>
                        <Progress value={100} />
                    </div>
                </CardContent>
            </Card>
          </div>
      </div>
    </div>
  );
}
