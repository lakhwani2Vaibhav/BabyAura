
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
import { format } from "date-fns";
import Link from "next/link";
import { Plus } from "lucide-react";
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
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

// Simulating the type that would come from a database fetch
type Patient = {
  id: string;
  name: string;
  lastVisit: string;
  status: 'Active' | 'Inactive';
};

const addParentSchema = z.object({
  parentName: z.string().min(1, "Parent's name is required"),
  babyName: z.string().min(1, "Baby's name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  babyDob: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
});

type AddParentFormValues = z.infer<typeof addParentSchema>;

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [addParentOpen, setAddParentOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<AddParentFormValues>({
    resolver: zodResolver(addParentSchema),
    defaultValues: {
      parentName: "",
      babyName: "",
      email: "",
      password: "",
      babyDob: "",
    },
  });

  const fetchPatients = async () => {
    // Replace with a real API call to fetch patients for the logged-in doctor
    const { doctorData } = await import("@/lib/data");
    setPatients(doctorData.patients);
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleAddParentSubmit = async (values: AddParentFormValues) => {
    if (!user || !user.email) {
      toast({ variant: "destructive", title: "Authentication Error", description: "You must be logged in to add a parent." });
      return;
    }
    
    const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            // This header is crucial for the backend to identify the logged-in doctor
            'X-User-Email': user.email
        },
        body: JSON.stringify({ 
            name: values.parentName,
            email: values.email,
            password: values.password,
            babyName: values.babyName,
            babyDob: values.babyDob,
            role: 'Parent',
            registeredBy: 'Doctor'
        })
    });
    
    if (response.ok) {
        await fetchPatients(); // In a real app, you would fetch from the API here
        toast({
            title: "Parent Added",
            description: `${values.parentName} has been successfully added.`,
        });
        setAddParentOpen(false);
        form.reset();
    } else {
        const errorData = await response.json();
        toast({
            variant: "destructive",
            title: "Failed to Add Parent",
            description: errorData.message || "An unexpected error occurred.",
        });
    }
  };


  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Manage Patients</CardTitle>
                <CardDescription>
                View and manage your patient records.
                </CardDescription>
            </div>
             <Dialog open={addParentOpen} onOpenChange={setAddParentOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add Parent
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Parent</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new parent and their baby.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleAddParentSubmit)} className="space-y-4 py-4">
                     <FormField control={form.control} name="parentName" render={({ field }) => (
                        <FormItem>
                          <Label>Parent's Name</Label>
                          <FormControl><Input placeholder="e.g., Jane Doe" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    <FormField control={form.control} name="babyName" render={({ field }) => (
                        <FormItem>
                          <Label>Baby's Name</Label>
                          <FormControl><Input placeholder="e.g., Sam Doe" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    <FormField control={form.control} name="babyDob" render={({ field }) => (
                        <FormItem>
                          <Label>Baby's Date of Birth</Label>
                          <FormControl><Input type="date" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                          <Label>Parent's Email</Label>
                          <FormControl><Input type="email" placeholder="parent@example.com" {...field} /></FormControl>
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
                          {form.formState.isSubmitting ? "Adding..." : "Add Parent"}
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
                <TableHead>Patient Name</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/doctor/patients/${patient.id}`}
                      className="hover:underline"
                    >
                      {patient.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {format(new Date(patient.lastVisit), "MMMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        patient.status === "Active" ? "default" : "secondary"
                      }
                    >
                      {patient.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/doctor/patients/${patient.id}`}>
                        View Profile
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
