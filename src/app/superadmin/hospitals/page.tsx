
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Hospital = {
  _id: string;
  hospitalName: string;
  createdAt: string;
  plan?: string;
  status: "pending_verification" | "verified" | "suspended" | "rejected";
};

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [alertInfo, setAlertInfo] = useState<{
    open: boolean;
    hospital: Hospital | null;
    action: "approve" | "reject" | "suspend" | "reactivate";
  } | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const fetchHospitals = async () => {
    try {
      const response = await fetch('/api/superadmin/hospitals');
      if (!response.ok) throw new Error("Failed to fetch hospitals");
      const data = await response.json();
      setHospitals(data);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not fetch hospitals." });
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  const handleStatusUpdate = async () => {
    if (!alertInfo || !alertInfo.hospital) return;

    let newStatus: Hospital["status"] = alertInfo.hospital.status;
    if (alertInfo.action === "approve") newStatus = "verified";
    if (alertInfo.action === "reject") newStatus = "rejected";
    if (alertInfo.action === "suspend") newStatus = "suspended";
    if (alertInfo.action === "reactivate") newStatus = "verified";

    try {
      const response = await fetch(`/api/superadmin/hospitals/${alertInfo.hospital._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      await fetchHospitals(); // Refresh the list
      toast({
        title: "Status Updated",
        description: `${alertInfo.hospital.hospitalName}'s status has been updated.`,
      });

    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not update hospital status." });
    } finally {
      setAlertInfo(null);
    }
  };

  const getStatusBadge = (status: Hospital['status']) => {
    switch (status) {
      case 'verified':
        return <Badge variant="default" className="bg-green-500/20 text-green-700 border-transparent hover:bg-green-500/30">Verified</Badge>;
      case 'pending_verification':
        return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700 border-transparent hover:bg-yellow-500/30">Pending</Badge>;
      case 'suspended':
      case 'rejected':
        return <Badge variant="destructive">Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Manage Hospitals</CardTitle>
          <CardDescription>
            View, approve, and manage all partner hospitals on the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hospital Name</TableHead>
                <TableHead>Joined Date</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hospitals.map((hospital) => (
                <TableRow key={hospital._id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/superadmin/hospitals/${hospital._id}`}
                      className="hover:underline"
                    >
                      {hospital.hospitalName}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {format(new Date(hospital.createdAt), "MMMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{hospital.plan || 'N/A'}</Badge>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(hospital.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onSelect={() => router.push(`/superadmin/hospitals/${hospital._id}`)}
                        >
                          View Dashboard
                        </DropdownMenuItem>
                        
                        {hospital.status === "pending_verification" && (
                            <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-green-600" onSelect={() => setAlertInfo({ open: true, hospital, action: 'approve' })}>
                                    <CheckCircle className="mr-2 h-4 w-4" /> Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive" onSelect={() => setAlertInfo({ open: true, hospital, action: 'reject' })}>
                                    <XCircle className="mr-2 h-4 w-4" /> Reject
                                </DropdownMenuItem>
                            </>
                        )}
                        
                        {hospital.status === "verified" && (
                            <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive" onSelect={() => setAlertInfo({ open: true, hospital, action: 'suspend' })}>
                                    Suspend Account
                                </DropdownMenuItem>
                            </>
                        )}

                         {hospital.status === "suspended" && (
                            <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onSelect={() => setAlertInfo({ open: true, hospital, action: 'reactivate' })}>
                                    Reactivate Account
                                </DropdownMenuItem>
                            </>
                        )}

                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog
        open={alertInfo?.open || false}
        onOpenChange={(open) => !open && setAlertInfo(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will {alertInfo?.action} the account for {alertInfo?.hospital?.hospitalName}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAlertInfo(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleStatusUpdate}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
