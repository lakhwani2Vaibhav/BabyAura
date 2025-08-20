
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MoreHorizontal, UserPlus, UserCheck, Users2, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/use-auth";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


type Team = {
  _id: string;
  name: string;
};

type Parent = {
  _id: string;
  name: string;
  email: string;
  babyName: string;
  status: 'Active' | 'Inactive';
  assignedTeam: string; 
  createdAt: string;
  avatarUrl?: string;
};

const addParentSchema = z.object({
  name: z.string().min(1, "Parent's name is required"),
  babyName: z.string().min(1, "Baby's name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
  address: z.string().optional(),
});

type AddParentFormValues = z.infer<typeof addParentSchema>;

export default function ParentsPage() {
  const [allParents, setAllParents] = useState<Parent[]>([]);
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [filteredParents, setFilteredParents] = useState<Parent[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [addParentOpen, setAddParentOpen] = useState(false);
  const [assignTeamOpen, setAssignTeamOpen] = useState(false);
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [isAssigning, setIsAssigning] = useState(false);

  const { toast } = useToast();
  const { user } = useAuth();
  
  const form = useForm<AddParentFormValues>({
    resolver: zodResolver(addParentSchema),
    defaultValues: { name: "", babyName: "", email: "", password: "", phone: "", address: "" },
  });

  const fetchParents = async () => {
      try {
        const token = localStorage.getItem('babyaura_token');
        if (!token) throw new Error("Authentication token not found.");
        
        const response = await fetch('/api/admin/parents', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if(!response.ok) throw new Error("Failed to fetch parents");
        const data = await response.json();
        setAllParents(data);
        setFilteredParents(data);
      } catch (error) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not fetch parent list."
        })
      }
  }

  const fetchTeams = async () => {
    try {
      const token = localStorage.getItem('babyaura_token');
      if (!token) throw new Error("Authentication token not found.");
       const response = await fetch('/api/admin/team', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Failed to fetch teams");
        const data = await response.json();
        setAllTeams(data);
    } catch (error) {
         toast({ variant: "destructive", title: "Error fetching teams", description: "Could not fetch the team list for assignment." });
    }
  }

  useEffect(() => {
    fetchParents();
    fetchTeams();
  }, []);


  useEffect(() => {
    const results = allParents.filter(
      (parent) =>
        parent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parent.babyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parent.assignedTeam.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredParents(results);
  }, [searchTerm, allParents]);

  const handleAddParentSubmit = async (values: AddParentFormValues) => {
    const token = localStorage.getItem('babyaura_token');
    if (!token || !user?.email) {
      toast({ variant: "destructive", title: "Error", description: "Authentication error." });
      return;
    }
    
    const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'X-User-Email': user.email
        },
        body: JSON.stringify({ 
            ...values, 
            role: 'Parent',
            registeredBy: 'Admin'
        })
    });
    
    if (response.ok) {
        await fetchParents(); 
        toast({
            title: "Parent Added",
            description: `${values.name} has been successfully added to the system.`,
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

  const handleDeleteParent = async (parentId: string) => {
      if (!parentId) return;
      try {
        const token = localStorage.getItem('babyaura_token');
        const response = await fetch(`/api/admin/parents/${parentId}`, { 
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if(!response.ok) throw new Error("Failed to delete parent");

        toast({
            title: "Parent Removed",
            description: "The parent has been removed from the system."
        });
        await fetchParents(); 
      } catch (error) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not remove the parent."
        })
      } finally {
        setDeleteAlertOpen(false);
        setSelectedParent(null);
      }
  }

  const handleAssignTeam = async () => {
    if (!selectedParent || !selectedTeamId) {
        toast({ variant: "destructive", title: "Error", description: "Parent or team not selected." });
        return;
    }
    setIsAssigning(true);
    try {
        const token = localStorage.getItem('babyaura_token');
        const response = await fetch(`/api/admin/parents/${selectedParent._id}/assign-team`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ teamId: selectedTeamId })
        });
        if (!response.ok) throw new Error((await response.json()).message || "Failed to assign team.");
        
        await fetchParents();
        toast({ title: "Team Assigned!", description: "The parent has been assigned a new care team." });
    } catch(error: any) {
        toast({ variant: "destructive", title: "Assignment Failed", description: error.message });
    } finally {
        setIsAssigning(false);
        setAssignTeamOpen(false);
        setSelectedParent(null);
        setSelectedTeamId('');
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
      <CardHeader>
         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Parents</CardTitle>
              <CardDescription>
                View and manage all parents associated with the hospital.
              </CardDescription>
            </div>
            <Dialog open={addParentOpen} onOpenChange={setAddParentOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" /> Add Parent
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Parent</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new parent and their baby.
                  </DialogDescription>
                </DialogHeader>
                 <ScrollArea className="max-h-[60vh] -mx-6 px-6">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(handleAddParentSubmit)} className="space-y-4 py-4">
                         <FormField control={form.control} name="name" render={({ field }) => (
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
                        <FormField control={form.control} name="phone" render={({ field }) => (
                            <FormItem>
                              <Label>Phone Number (Optional)</Label>
                              <FormControl><Input type="tel" placeholder="e.g., 9876543210" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                        <FormField control={form.control} name="address" render={({ field }) => (
                            <FormItem>
                              <Label>Address (Optional)</Label>
                              <FormControl><Textarea placeholder="e.g., 123 Main St, Anytown" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                        <DialogFooter className="pt-4">
                          <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                          <Button type="submit" disabled={form.formState.isSubmitting}>
                              {form.formState.isSubmitting ? "Adding..." : "Add Parent"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                 </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
        <div className="relative pt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by parent, baby, or doctor..."
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
              <TableHead>Parent & Baby</TableHead>
              <TableHead>Assigned Team</TableHead>
              <TableHead>Joined On</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredParents.length > 0 ? (
              filteredParents.map((parent) => (
                <TableRow key={parent._id}>
                  <TableCell className="font-medium">
                     <div className="flex items-center gap-3 group">
                      <Avatar>
                        <AvatarImage src={parent.avatarUrl} />
                        <AvatarFallback>
                          {getInitials(parent.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{parent.name}</p>
                        <p className="text-sm text-muted-foreground">Baby: {parent.babyName}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                      <Badge variant={parent.assignedTeam === "Unassigned" ? "destructive" : "secondary"}>
                          {parent.assignedTeam}
                      </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(parent.createdAt), "MMMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        parent.status === "Active" ? "default" : "secondary"
                      }
                       className={parent.status === "Active" ? "bg-green-500/20 text-green-700 border-transparent hover:bg-green-500/30" : "bg-yellow-500/20 text-yellow-700 border-transparent hover:bg-yellow-500/30"}
                    >
                      {parent.status}
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
                        <DropdownMenuItem onSelect={() => { setSelectedParent(parent); setAssignTeamOpen(true);}}>
                            <Users2 className="mr-2 h-4 w-4" />
                            Assign Team
                        </DropdownMenuItem>
                         <DropdownMenuItem onSelect={() => toast({title: "Coming Soon", description: "Parent edit functionality is in development."})}>
                            Edit Parent
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onSelect={() => { setSelectedParent(parent); setDeleteAlertOpen(true);}}>
                           Delete Parent
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No parents found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedParent?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the parent's account and all associated data.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDeleteParent(selectedParent!._id)} className="bg-destructive hover:bg-destructive/90">Yes, Delete Parent</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    
    <Dialog open={assignTeamOpen} onOpenChange={setAssignTeamOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Assign Team to {selectedParent?.name}</DialogTitle>
                <DialogDescription>
                    Select a care team to be the primary point of contact for this parent.
                </DialogDescription>
            </DialogHeader>
            <div className="py-4">
                <Select onValueChange={setSelectedTeamId} defaultValue={selectedTeamId}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a care team" />
                    </SelectTrigger>
                    <SelectContent>
                        {allTeams.map(team => (
                            <SelectItem key={team._id} value={team._id}>
                                {team.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancel</Button>
                </DialogClose>
                <Button type="button" onClick={handleAssignTeam} disabled={!selectedTeamId || isAssigning}>
                  {isAssigning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Assign Team
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    </>
  );
}
