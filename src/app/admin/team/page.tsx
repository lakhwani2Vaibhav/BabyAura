
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
  CardFooter,
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
import { MoreHorizontal, UserPlus, Users2, PlusCircle, Trash2, Edit, Loader2 } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Data shapes
type Doctor = {
  _id: string;
  name: string;
  specialty: string;
  status: 'Active' | 'On Leave';
  avatarUrl?: string;
};

type TeamMember = {
    doctorId: string;
    name: string;
    role: string;
}

type Team = {
    _id: string;
    name: string;
    members: TeamMember[];
}

const addTeamMemberSchema = z.object({
  doctorId: z.string().min(1, "Please select a doctor."),
  role: z.string().min(2, "Role is required (e.g., Pediatrician)."),
});
type AddTeamMemberFormValues = z.infer<typeof addTeamMemberSchema>;

export default function ManageTeamPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<{ teamId: string, member: TeamMember } | null>(null);
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);
  
  const [createTeamOpen, setCreateTeamOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [deleteMemberAlertOpen, setDeleteMemberAlertOpen] = useState(false);
  const [deleteTeamAlertOpen, setDeleteTeamAlertOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);


  const { toast } = useToast();
  const { user } = useAuth();
  
  const addMemberForm = useForm<AddTeamMemberFormValues>({
    resolver: zodResolver(addTeamMemberSchema),
  });

  // Fetching Data
  const fetchTeams = async () => {
    try {
      const token = localStorage.getItem('babyaura_token');
      const response = await fetch('/api/admin/team', { headers: { 'Authorization': `Bearer ${token}` } });
      if (!response.ok) throw new Error("Failed to fetch teams");
      const data = await response.json();
      setTeams(data);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not fetch teams." });
    }
  };

  const fetchDoctors = async () => {
     try {
      const token = localStorage.getItem('babyaura_token');
      const response = await fetch('/api/admin/doctors', { headers: { 'Authorization': `Bearer ${token}` } });
      if (!response.ok) throw new Error("Failed to fetch doctors");
      setDoctors(await response.json());
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not fetch doctors." });
    }
  };

  useEffect(() => {
    if (user) {
        fetchTeams();
        fetchDoctors();
    }
  }, [user, toast]);
  
  // Handlers
  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) {
        toast({ variant: "destructive", title: "Error", description: "Team name cannot be empty." });
        return;
    }
    try {
        const token = localStorage.getItem('babyaura_token');
        const response = await fetch('/api/admin/team', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ name: newTeamName }),
        });
        if (!response.ok) throw new Error((await response.json()).message);
        
        await fetchTeams();
        toast({ title: "Team Created!", description: `The team "${newTeamName}" has been created.`});
        setNewTeamName("");
        setCreateTeamOpen(false);

    } catch (error: any) {
        toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };
  
  const handleAddMemberSubmit = async (values: AddTeamMemberFormValues) => {
    if (!selectedTeam) return;
    try {
        const token = localStorage.getItem('babyaura_token');
        const response = await fetch(`/api/admin/team/${selectedTeam._id}/members`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(values),
        });
         if (!response.ok) throw new Error((await response.json()).message);
         await fetchTeams();
         toast({ title: "Member Added", description: "The new member has been added to the team." });
         setAddMemberOpen(false);
         addMemberForm.reset();

    } catch (error: any) {
        toast({ variant: "destructive", title: "Error adding member", description: error.message });
    }
  }

  const handleDeleteMember = async () => {
    if (!memberToDelete) return;
    setIsDeleting(true);
    try {
        const { teamId, member } = memberToDelete;
        const token = localStorage.getItem('babyaura_token');
        const response = await fetch(`/api/admin/team/${teamId}/members/${member.doctorId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error((await response.json()).message);
        
        await fetchTeams();
        toast({ title: "Member Removed", description: `${member.name} has been removed from the team.` });
    } catch(error: any) {
        toast({ variant: "destructive", title: "Error removing member", description: error.message });
    } finally {
        setDeleteMemberAlertOpen(false);
        setMemberToDelete(null);
        setIsDeleting(false);
    }
  }

  const handleDeleteTeam = async () => {
    if (!teamToDelete) return;
    setIsDeleting(true);
     try {
        const token = localStorage.getItem('babyaura_token');
        const response = await fetch(`/api/admin/team/${teamToDelete._id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
         if (!response.ok) throw new Error((await response.json()).message);
         await fetchTeams();
         toast({ title: "Team Deleted", description: `The team "${teamToDelete.name}" has been removed.` });
     } catch (error: any) {
        toast({ variant: "destructive", title: "Error deleting team", description: error.message });
     } finally {
        setDeleteTeamAlertOpen(false);
        setTeamToDelete(null);
        setIsDeleting(false);
     }
  }
  
  const getInitials = (name: string) => {
    const parts = name.split(" ");
    return parts.length > 1 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : name.substring(0, 2);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold font-headline">Manage Care Teams</h1>
          <p className="text-muted-foreground">
            Create teams and assign specialists to provide group-based care.
          </p>
        </div>
        <Dialog open={createTeamOpen} onOpenChange={setCreateTeamOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> Create New Team
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a New Care Team</DialogTitle>
                    <DialogDescription>Give your new team a descriptive name.</DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-2">
                    <Label htmlFor="team-name">Team Name</Label>
                    <Input id="team-name" value={newTeamName} onChange={(e) => setNewTeamName(e.target.value)} placeholder="e.g., Alpha Care Team" />
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                    <Button onClick={handleCreateTeam}>Create Team</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        {teams.map(team => (
            <Card key={team._id}>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Users2 className="h-5 w-5 text-primary" />
                            {team.name}
                        </CardTitle>
                        <CardDescription>{team.members.length} members</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => { setSelectedTeam(team); setAddMemberOpen(true) }}>
                            <UserPlus className="mr-2 h-4 w-4" /> Add Member
                        </Button>
                        <Button variant="destructive-outline" size="sm" onClick={() => { setTeamToDelete(team); setDeleteTeamAlertOpen(true); }}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Team
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                   <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Member Name</TableHead>
                                <TableHead>Role / Specialty</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {team.members.map(member => (
                                <TableRow key={member.doctorId}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={(doctors.find(d => d._id === member.doctorId) as any)?.avatarUrl} />
                                                <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                                            </Avatar>
                                            {member.name}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{member.role}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button 
                                            variant="ghost" 
                                            size="icon"
                                            onClick={() => {
                                                setMemberToDelete({ teamId: team._id, member });
                                                setDeleteMemberAlertOpen(true);
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {team.members.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center h-24">This team has no members yet.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                   </Table>
                </CardContent>
            </Card>
        ))}
      </div>
      
       {/* Add Member Dialog */}
      <Dialog open={addMemberOpen} onOpenChange={setAddMemberOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Member to "{selectedTeam?.name}"</DialogTitle>
            <DialogDescription>
              Select an available doctor and assign them a role within this team.
            </DialogDescription>
          </DialogHeader>
          <Form {...addMemberForm}>
            <form
              onSubmit={addMemberForm.handleSubmit(handleAddMemberSubmit)}
              className="space-y-4 py-4"
            >
              <FormField control={addMemberForm.control} name="doctorId" render={({ field }) => (
                  <FormItem>
                    <Label>Doctor</Label>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                       <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select a doctor" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {doctors.filter(d => d.status === 'Active' && !selectedTeam?.members.find(m => m.doctorId === d._id)).map(doctor => (
                          <SelectItem key={doctor._id} value={doctor._id}>{doctor.name} - {doctor.specialty}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={addMemberForm.control} name="role" render={({ field }) => (
                  <FormItem>
                    <Label>Role in Team</Label>
                    <FormControl>
                      <Input placeholder="e.g., Lead Pediatrician, Nutritionist" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                <Button type="submit" disabled={addMemberForm.formState.isSubmitting}>
                    {addMemberForm.formState.isSubmitting ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                    Add Member
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Member Alert */}
       <AlertDialog open={deleteMemberAlertOpen} onOpenChange={setDeleteMemberAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will remove <strong>{memberToDelete?.member.name}</strong> from the team. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMember} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
                {isDeleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Yes, Remove Member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
       {/* Delete Team Alert */}
       <AlertDialog open={deleteTeamAlertOpen} onOpenChange={setDeleteTeamAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{teamToDelete?.name}"?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the team. Any parents assigned to this team will become unassigned. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTeam} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
                 {isDeleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Yes, Delete Team
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
