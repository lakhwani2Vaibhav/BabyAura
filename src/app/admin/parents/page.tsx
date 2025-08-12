
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import Link from "next/link";
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

// This will be the shape of data fetched from the API
type Parent = {
  _id: string;
  name: string;
  email: string;
  babyName: string;
  status: 'Active' | 'Inactive';
  assignedDoctor: string; // This would be populated by the backend
  createdAt: string;
  avatarUrl?: string;
};

export default function ParentsPage() {
  const [allParents, setAllParents] = useState<Parent[]>([]);
  const [filteredParents, setFilteredParents] = useState<Parent[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null);
  const { toast } = useToast();
  
  const fetchParents = async () => {
      try {
        const response = await fetch('/api/admin/parents');
        if(!response.ok) throw new Error("Failed to fetch parents");
        const data = await response.json();
        setAllParents(data);
      } catch (error) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not fetch parent list."
        })
      }
  }

  useEffect(() => {
    fetchParents();
  }, [toast]);


  useEffect(() => {
    const results = allParents.filter(
      (parent) =>
        parent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parent.babyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parent.assignedDoctor.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredParents(results);
  }, [searchTerm, allParents]);

  const handleDeleteParent = async (parentId: string) => {
      if (!parentId) return;
      try {
        const response = await fetch(`/api/admin/parents/${parentId}`, { method: 'DELETE' });
        if(!response.ok) throw new Error("Failed to delete parent");

        toast({
            title: "Parent Removed",
            description: "The parent has been removed from the system."
        });
        await fetchParents(); // Refetch parents
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
        <CardTitle>Parents</CardTitle>
        <CardDescription>
          View all parents associated with the hospital.
        </CardDescription>
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
              <TableHead>Assigned Doctor</TableHead>
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
                  <TableCell>{parent.assignedDoctor}</TableCell>
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
                        <DropdownMenuItem onSelect={() => toast({title: "Coming Soon", description: "Parent profile view is in development."})}>
                            View Details
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
    </>
  );
}
