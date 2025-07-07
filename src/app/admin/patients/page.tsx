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

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPatients, setFilteredPatients] = useState(adminData.patients);

  useEffect(() => {
    const results = adminData.patients.filter(
      (patient) =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.assignedDoctor.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPatients(results);
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
        <CardTitle>Patients</CardTitle>
        <CardDescription>
          View all patients associated with the hospital.
        </CardDescription>
        <div className="relative pt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by patient name or doctor..."
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
              <TableHead>Patient</TableHead>
              <TableHead>Assigned Doctor</TableHead>
              <TableHead>Last Visit</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={patient.avatarUrl} />
                        <AvatarFallback>
                          {getInitials(patient.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{patient.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{patient.assignedDoctor}</TableCell>
                  <TableCell>
                    {format(new Date(patient.lastVisit), "MMMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={
                        patient.status === "Active" ? "default" : "secondary"
                      }
                    >
                      {patient.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No patients found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
