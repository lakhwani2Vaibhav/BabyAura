"use client";

import { useState } from "react";
import { superAdminData } from "@/lib/data";
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
import { MoreHorizontal, UserPlus } from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

type Hospital = (typeof superAdminData.hospitals)[0] & {
  status: "Active" | "Pending" | "Suspended";
};

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>(
    superAdminData.hospitals as Hospital[]
  );
  const [open, setOpen] = useState(false);
  const [suspendAlertOpen, setSuspendAlertOpen] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(
    null
  );
  const { toast } = useToast();

  const handleAddHospital = () => {
    toast({
      title: "Hospital Added",
      description: "The new hospital has been successfully added.",
    });
    setOpen(false);
  };

  const handleSuspendConfirm = () => {
    if (selectedHospital) {
      setHospitals(
        hospitals.map((h) =>
          h.id === selectedHospital.id
            ? { ...h, status: h.status === "Active" ? "Suspended" : "Active" }
            : h
        )
      );
      toast({
        title: `Hospital ${
          selectedHospital.status === "Active" ? "Suspended" : "Activated"
        }`,
        description: `${selectedHospital.name}'s status has been updated.`,
      });
    }
    setSuspendAlertOpen(false);
    setSelectedHospital(null);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Manage Hospitals</CardTitle>
            <CardDescription>
              View and manage all partner hospitals on the platform.
            </CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" /> Add Hospital
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Hospital</DialogTitle>
                <DialogDescription>
                  Enter the details for the new hospital to onboard them.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    defaultValue="New City Hospital"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="plan" className="text-right">
                    Plan
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="licensing">Licensing</SelectItem>
                      <SelectItem value="revenue-share">
                        Revenue Share
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="button" onClick={handleAddHospital}>
                  Add Hospital
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
                <TableRow key={hospital.id}>
                  <TableCell className="font-medium">
                    {hospital.name}
                  </TableCell>
                  <TableCell>
                    {format(new Date(hospital.joinedDate), "MMMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{hospital.plan}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        hospital.status === "Active"
                          ? "default"
                          : "destructive"
                      }
                      className={
                        hospital.status === "Active"
                          ? "bg-green-500/20 text-green-700 border-transparent hover:bg-green-500/30"
                          : hospital.status === "Pending"
                          ? "bg-yellow-500/20 text-yellow-700 border-transparent hover:bg-yellow-500/30"
                          : "bg-red-500/20 text-red-700 border-transparent hover:bg-red-500/30"
                      }
                    >
                      {hospital.status}
                    </Badge>
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
                          onSelect={() =>
                            toast({ title: "Navigating to Dashboard..." })
                          }
                        >
                          View Dashboard
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() =>
                            toast({ title: "Opening Billing..." })
                          }
                        >
                          Manage Billing
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {hospital.status !== "Pending" && (
                          <DropdownMenuItem
                            className="text-destructive"
                            onSelect={() => {
                              setSelectedHospital(hospital);
                              setSuspendAlertOpen(true);
                            }}
                          >
                            {hospital.status === "Active"
                              ? "Suspend Account"
                              : "Reactivate Account"}
                          </DropdownMenuItem>
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
        open={suspendAlertOpen}
        onOpenChange={setSuspendAlertOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will{" "}
              {selectedHospital?.status === "Active" ? "suspend" : "reactivate"}{" "}
              the account for {selectedHospital?.name}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedHospital(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleSuspendConfirm}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
