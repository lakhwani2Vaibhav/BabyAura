
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
import { MoreHorizontal, Plus, UserPlus, CheckCircle, XCircle, Trash2, Eye } from "lucide-react";
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
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";


type Doctor = {
  _id: string;
  name: string;
  specialty: string;
  status: 'Active' | 'On Leave';
  avatarUrl?: string;
  patientCount: number;
};

const addDoctorSchema = z.object({
  name: z.string().min(1, "Doctor's name is required"),
  specialty: z.string().min(1, "Specialty is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type AddDoctorFormValues = z.infer<typeof addDoctorSchema>;

export default function ManageDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [addDoctorOpen, setAddDoctorOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [statusChangeAlertOpen, setStatusChangeAlertOpen] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<'Active' | 'On Leave'>('Active');
  
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();
  
  const form = useForm<AddDoctorFormValues>({
    resolver: zodResolver(addDoctorSchema),
    defaultValues: { name: "", specialty: "", email: "", password: "" },
  });

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('babyaura_token');
      if (!token) throw new Error("Authentication failed");
      const response = await fetch('/api/admin/doctors', {
          headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Could not fetch doctors");
      
      const doctorsData = await response.json();
      
      // Temporary: Add patientCount to each doctor
      const doctorsWithCount = doctorsData.map((doc: any) => ({
          ...doc,
          patientCount: Math.floor(Math.random() * 50) + 10 // Random number for demo
      }));

      setDoctors(doctorsWithCount);
    } catch(e) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not load your doctors list.'})
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
        fetchDoctors();
    }
  }, [user]);


  const handleAddDoctorSubmit = async (values: AddDoctorFormValues) => {
    if (!user || !user.email) {
      toast({ variant: "destructive", title: "Authentication Error", description: "You must be logged in to add a doctor." });
      return;
    }
    const token = localStorage.getItem('babyaura_token');
    
    const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
            ...values,
            role: 'Doctor',
            registeredBy: 'Admin'
        })
    });
    
    if (response.ok) {
        await fetchDoctors(); 
        toast({
            title: "Doctor Added",
            description: `${values.name} has been successfully onboarded.`,
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

  const handleStatusChangeConfirm = async () => {
    if (!selectedDoctor) return;
    try {
        const token = localStorage.getItem('babyaura_token');
        const response = await fetch(`/api/admin/doctors/${selectedDoctor._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ status: newStatus })
        });
        if (!response.ok) throw new Error("Failed to update status");
        
        await fetchDoctors();
        toast({ title: 'Status Updated', description: `${selectedDoctor.name}'s status is now ${newStatus}.` });
    } catch (error) {
         toast({ variant: 'destructive', title: 'Error', description: 'Could not update doctor status.' });
    } finally {
        setStatusChangeAlertOpen(false);
        setSelectedDoctor(null);
    }
  }

  const handleDeleteConfirm = async () => {
      if (!selectedDoctor) return;
      try {
          const token = localStorage.getItem('babyaura_token');
          const response = await fetch(`/api/admin/doctors/${selectedDoctor._id}`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${token}` }
          });
          if(!response.ok) throw new Error("Failed to delete doctor.");
          await fetchDoctors();
          toast({ title: 'Doctor Removed', description: `${selectedDoctor.name} has been removed.` });
      } catch (error) {
          toast({ variant: 'destructive', title: 'Error', description: 'Could not remove the doctor.' });
      } finally {
          setDeleteAlertOpen(false);
          setSelectedDoctor(null);
      }
  }
  
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
                  View, add, or manage the doctors in your hospital.
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
                  <DialogTitle>Onboard New Doctor</DialogTitle>
                  <DialogDescription>
                    Fill in the doctor's details to create their account.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleAddDoctorSubmit)} className="space-y-4 py-4">
                     <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem>
                          <Label>Doctor's Full Name</Label>
                          <FormControl><Input placeholder="e.g., Dr. Jane Doe" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    <FormField control={form.control} name="specialty" render={({ field }) => (
                        <FormItem>
                          <Label>Specialty</Label>
                          <FormControl><Input placeholder="e.g., Pediatrics" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                          <Label>Work Email</Label>
                          <FormControl><Input type="email" placeholder="doctor@yourhospital.com" {...field} /></FormControl>
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
                    <DialogFooter>
                      <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                      <Button type="submit" disabled={form.formState.isSubmitting}>
                          {form.formState.isSubmitting ? "Onboarding..." : "Onboard Doctor"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
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
              {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={i}>
                          <TableCell><div className="flex items-center gap-3"><Skeleton className="h-10 w-10 rounded-full" /><Skeleton className="h-5 w-32" /></div></TableCell>
                          <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-10" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                          <TableCell className="text-right"><Skeleton className="h-8 w-8" /></TableCell>
                      </TableRow>
                  ))
              ) : doctors.map((doctor) => (
                <TableRow key={doctor._id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={doctor.avatarUrl} />
                        <AvatarFallback>{getInitials(doctor.name)}</AvatarFallback>
                      </Avatar>
                      {doctor.name}
                    </div>
                  </TableCell>
                  <TableCell>{doctor.specialty}</TableCell>
                   <TableCell>{doctor.patientCount}</TableCell>
                  <TableCell>
                    <Badge
                      variant={doctor.status === "Active" ? "default" : "secondary"}
                      className={doctor.status === "Active" ? "bg-green-500/20 text-green-700" : ""}
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
                         <DropdownMenuItem onSelect={() => router.push(`/superadmin/doctors/${doctor._id}`)}>
                            <Eye className="mr-2 h-4 w-4" /> View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => toast({title: "Coming Soon!", description: "Doctor profile editing will be available soon."})}>
                          Edit Profile
                        </DropdownMenuItem>
                         {doctor.status === 'Active' ? (
                            <DropdownMenuItem onSelect={() => { setSelectedDoctor(doctor); setNewStatus('On Leave'); setStatusChangeAlertOpen(true); }}>
                              Mark as On Leave
                            </DropdownMenuItem>
                         ) : (
                            <DropdownMenuItem onSelect={() => { setSelectedDoctor(doctor); setNewStatus('Active'); setStatusChangeAlertOpen(true); }}>
                              Mark as Active
                            </DropdownMenuItem>
                         )}
                         <DropdownMenuSeparator />
                         <DropdownMenuItem className="text-destructive" onSelect={() => {setSelectedDoctor(doctor); setDeleteAlertOpen(true); }}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Profile
                         </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
               {!loading && doctors.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">No doctors onboarded yet.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <AlertDialog open={statusChangeAlertOpen} onOpenChange={setStatusChangeAlertOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
                <AlertDialogDescription>
                    Are you sure you want to mark {selectedDoctor?.name} as "{newStatus}"? This will affect their ability to take new consultations.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleStatusChangeConfirm}>Confirm</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Delete {selectedDoctor?.name}?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently remove the doctor from your hospital and unassign them from any patients.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">Yes, Delete</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
