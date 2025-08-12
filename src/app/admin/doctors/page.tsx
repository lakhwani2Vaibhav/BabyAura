
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { MoreHorizontal, UserPlus, Search, Trash2 } from "lucide-react";
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
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import Link from "next/link";

// This will be the shape of data fetched from the API
type Doctor = {
  _id: string;
  name: string;
  email: string;
  specialty: string;
  status: 'Active' | 'On Leave';
  avatarUrl?: string;
  patients: number; // This would typically be a calculation or a separate field
};

const addDoctorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  specialty: z.string().min(1, "Specialty is required"),
});

type AddDoctorFormValues = z.infer<typeof addDoctorSchema>;


export default function ManageDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const [addDoctorOpen, setAddDoctorOpen] = useState(false);
  const [editScheduleOpen, setEditScheduleOpen] = useState(false);
  const [deactivateAlertOpen, setDeactivateAlertOpen] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);

  const { toast } = useToast();

  const form = useForm<AddDoctorFormValues>({
    resolver: zodResolver(addDoctorSchema),
    defaultValues: { name: "", email: "", password: "", specialty: "Pediatrics" },
  });

  const fetchDoctors = async () => {
    try {
      const response = await fetch('/api/admin/doctors');
      if (!response.ok) throw new Error("Failed to fetch doctors");
      const data = await response.json();
      setDoctors(data);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not fetch doctor list." });
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [toast]);

  useEffect(() => {
    const results = doctors.filter(doctor =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor._id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDoctors(results);
  }, [searchTerm, doctors]);


  const handleAddDoctorSubmit = async (values: AddDoctorFormValues) => {
    // In a real app, you'd get the admin's hospitalId from their session/context
    const hospitalId = "HOSP-ID-FROM-ADMIN-SESSION"; // Placeholder

    const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, role: 'Doctor', hospitalId: hospitalId })
    });
    
    if (response.ok) {
        await fetchDoctors(); // Refetch the list
        toast({
            title: "Doctor Added",
            description: `${values.name} has been successfully added to the system.`,
        });
        setAddDoctorOpen(false);
        form.reset();
    } else {
        const errorData = await response.json();
        toast({
            variant: "destructive",
            title: "Failed to Add Doctor",
            description: errorData.message || "An unexpected error occurred.",
        });
    }
  };

  const handleEditScheduleSave = () => {
    toast({
      title: "Schedule Updated",
      description: `The schedule for ${selectedDoctor?.name} has been updated.`,
    });
    setEditScheduleOpen(false);
  };
  
  const updateDoctorStatus = async (doctor: Doctor, status: 'Active' | 'On Leave') => {
      try {
          const response = await fetch(`/api/admin/doctors/${doctor._id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status })
          });
          if (!response.ok) throw new Error("Failed to update status");
          
          await fetchDoctors(); // Refetch
          toast({
              title: "Doctor Status Updated",
              description: `${doctor.name}'s status has been set to ${status}.`,
          });

      } catch (error) {
          toast({ variant: "destructive", title: "Error", description: "Could not update doctor status." });
      }
  }
  
  const handleDeleteDoctor = async (doctorId: string) => {
       try {
          const response = await fetch(`/api/admin/doctors/${doctorId}`, {
              method: 'DELETE'
          });
          if (!response.ok) throw new Error("Failed to delete doctor");
          
          await fetchDoctors(); // Refetch
          toast({
              title: "Doctor Removed",
              description: "The doctor has been permanently removed from the system.",
          });

      } catch (error) {
          toast({ variant: "destructive", title: "Error", description: "Could not remove the doctor." });
      }
      setDeleteAlertOpen(false);
  }

  const handleDeactivateConfirm = () => {
    if (selectedDoctor) {
      const newStatus = selectedDoctor.status === "Active" ? "On Leave" : "Active";
      updateDoctorStatus(selectedDoctor, newStatus);
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
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Manage Doctors</CardTitle>
              <CardDescription>
                Onboard, offboard, and manage doctor profiles for your hospital.
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
                    Enter the details for the new doctor to onboard them. They will receive an email to set up their account.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleAddDoctorSubmit)} className="space-y-4 py-4">
                    <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem>
                          <Label>Name</Label>
                          <FormControl><Input placeholder="Dr. John Doe" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                          <Label>Email</Label>
                          <FormControl><Input type="email" placeholder="doctor@example.com" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    <FormField control={form.control} name="password" render={({ field }) => (
                        <FormItem>
                          <Label>Temporary Password</Label>
                          <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    <FormField control={form.control} name="specialty" render={({ field }) => (
                        <FormItem>
                          <Label>Specialty</Label>
                          <FormControl><Input placeholder="Pediatrics" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    <DialogFooter>
                      <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                      <Button type="submit" disabled={form.formState.isSubmitting}>
                          {form.formState.isSubmitting ? "Adding..." : "Add Doctor"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="relative pt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by name, specialty, or ID..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
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
              {filteredDoctors.map((doctor) => (
                <TableRow key={doctor._id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={doctor.avatarUrl} />
                        <AvatarFallback>{getInitials(doctor.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p>{doctor.name}</p>
                        <p className="text-xs text-muted-foreground">{doctor.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{doctor.specialty}</TableCell>
                  <TableCell>{doctor.patients || 0}</TableCell>
                  <TableCell>
                    <Badge variant={doctor.status === "Active" ? "default" : "destructive"} className={doctor.status === "Active" ? "bg-green-500/20 text-green-700 border-transparent hover:bg-green-500/30" : "bg-yellow-500/20 text-yellow-700 border-transparent hover:bg-yellow-500/30"}>
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
                        <DropdownMenuItem asChild>
                           <Link href={`/admin/doctors/${doctor._id}`}>View Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => { setSelectedDoctor(doctor); setEditScheduleOpen(true); }}>Edit Schedule</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => { setSelectedDoctor(doctor); setDeactivateAlertOpen(true); }}>
                          {doctor.status === "Active" ? "Set to 'On Leave'" : "Set to 'Active'"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onSelect={() => { setSelectedDoctor(doctor); setDeleteAlertOpen(true);}}>
                           <Trash2 className="mr-2 h-4 w-4" /> Delete Doctor
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

      {/* Dialogs and Alerts */}
      <Dialog open={editScheduleOpen} onOpenChange={setEditScheduleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Schedule for {selectedDoctor?.name}</DialogTitle>
            <DialogDescription>Adjust working hours and availability.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4"><p className="text-sm text-muted-foreground">Scheduling controls would go here.</p><Label>Monday</Label><Input defaultValue="9:00 AM - 5:00 PM" /></div>
          <DialogFooter>
            <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
            <Button onClick={handleEditScheduleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deactivateAlertOpen} onOpenChange={setDeactivateAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will set {selectedDoctor?.name}'s status to <strong>{selectedDoctor?.status === "Active" ? "On Leave" : "Active"}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeactivateConfirm}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
       <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedDoctor?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the doctor's account and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDeleteDoctor(selectedDoctor!._id)} className="bg-destructive hover:bg-destructive/90">Yes, Delete Doctor</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
