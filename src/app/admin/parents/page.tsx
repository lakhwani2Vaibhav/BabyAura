
"use client";

import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import Link from "next/link";

export default function ParentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredParents, setFilteredParents] = useState(adminData.parents);

  useEffect(() => {
    const results = adminData.parents.filter(
      (parent) =>
        parent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parent.assignedDoctor.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredParents(results);
  }, [searchTerm]);

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    return parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`
      : name.substring(0, 2);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Parents</CardTitle>
        <CardDescription>
          View all parents associated with the hospital.
        </CardDescription>
        <div className="relative pt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by parent name or doctor..."
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
              <TableHead>Last Visit</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredParents.length > 0 ? (
              filteredParents.map((parent) => (
                <TableRow key={parent.id}>
                  <TableCell className="font-medium">
                    <Link href={`/doctor/patients/${parent.id}`} className="flex items-center gap-3 group">
                      <Avatar>
                        <AvatarImage src={parent.avatarUrl} />
                        <AvatarFallback>
                          {getInitials(parent.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="group-hover:underline">{parent.name}</span>
                    </Link>
                  </TableCell>
                  <TableCell>{parent.assignedDoctor}</TableCell>
                  <TableCell>
                    {format(new Date(parent.lastVisit), "MMMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={
                        parent.status === "Active" ? "default" : "secondary"
                      }
                    >
                      {parent.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No parents found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
