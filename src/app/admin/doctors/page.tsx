
"use client";

import { useState } from "react";
import { adminData } from "@/lib/data";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

type Doctor = (typeof adminData.doctors)[0];

export default function ManageDoctorsPage() {
  const [doctors, setDoctors] = useState(adminData.doctors);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const [addDoctorOpen, setAddDoctorOpen] = useState(false);
  const [editScheduleOpen, setEditScheduleOpen] = useState(false);
  const [deactivateAlertOpen, setDeactivateAlertOpen] = useState(false);

  const { toast } = useToast();

  const handleAddDoctor = () => {
    toast({
      title: "Doctor Added",
      description: "The new doctor has been successfully added to the system.",
    });
    setAddDoctorOpen(false);
  };

  const handleEditScheduleSave = () => {
    toast({
      title: "Schedule Updated",
      description: `The schedule for ${selectedDoctor?.name} has been updated.`,
    });
    setEditScheduleOpen(false);
  };

  const handleDeactivateConfirm = () => {
    if (selectedDoctor) {
      setDoctors(
        doctors.map((doc) =>
          doc.id === selectedDoctor.id
            ? { ...doc, status: doc.status === "Active" ? "On Leave" : "Active" }
            : doc
        )
      );
      toast({
        title: `Doctor ${
          selectedDoctor.status === "Active" ? "Deactivated" : "Activated"
        }`,
        description: `${selectedDoctor.name}'s status has been updated.`,
      });
    }
    setDeactivateAlertOpen(false);
  };

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    return parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`
      : name.substring(0, 2);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Manage Doctors</CardTitle>
            <CardDescription>
              Onboard, offboard, and manage doctor profiles.
            </CardDescription>
          </div>
          <Dialog open={addDoctorOpen} onOpenChange={setAddDoctorOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" /> Add Doctor
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Doctor</DialogTitle>
                <DialogDescription>
                  Enter the details for the new doctor to onboard them.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    defaultValue="Dr. John Doe"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="doctor@example.com"
                    className="col-span-3"
                  />
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Temporary password"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="specialty" className="text-right">
                    Specialty
                  </Label>
                  <Input
                    id="specialty"
                    defaultValue="Pediatrics"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="button" onClick={handleAddDoctor}>
                  Add Doctor
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Doctor</TableHead>
                <TableHead>Specialty</TableHead>
                <TableHead>Patients</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {doctors.map((doctor) => (
                <TableRow key={doctor.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={doctor.avatarUrl} />
                        <AvatarFallback>
                          {getInitials(doctor.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{doctor.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{doctor.specialty}</TableCell>
                  <TableCell>{doctor.patients}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        doctor.status === "Active" ? "default" : "destructive"
                      }
                      className={
                        doctor.status === "Active"
                          ? "bg-green-500/20 text-green-700 border-transparent hover:bg-green-500/30"
                          : "bg-red-500/20 text-red-700 border-transparent hover:bg-red-500/30"
                      }
                    >
                      {doctor.status}
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
                            toast({
                              title: "Feature Coming Soon",
                              description:
                                "The doctor profile page is under construction.",
                            })
                          }
                        >
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => {
                            setSelectedDoctor(doctor);
                            setEditScheduleOpen(true);
                          }}
                        >
                          Edit Schedule
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onSelect={() => {
                            setSelectedDoctor(doctor);
                            setDeactivateAlertOpen(true);
                          }}
                        >
                          {doctor.status === "Active"
                            ? "Deactivate"
                            : "Activate"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Schedule Dialog */}
      <Dialog open={editScheduleOpen} onOpenChange={setEditScheduleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Edit Schedule for {selectedDoctor?.name}
            </DialogTitle>
            <DialogDescription>
              Adjust working hours and availability.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p className="text-sm text-muted-foreground">
              Scheduling controls would go here.
            </p>
            <Label>Monday</Label>
            <Input defaultValue="9:00 AM - 5:00 PM" />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button onClick={handleEditScheduleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deactivate Alert Dialog */}
      <AlertDialog
        open={deactivateAlertOpen}
        onOpenChange={setDeactivateAlertOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will{" "}
              {selectedDoctor?.status === "Active" ? "deactivate" : "activate"}{" "}
              {selectedDoctor?.name} and they will{" "}
              {selectedDoctor?.status === "Active"
                ? "temporarily lose access"
                : "regain access"}{" "}
              to their dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeactivateConfirm}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
