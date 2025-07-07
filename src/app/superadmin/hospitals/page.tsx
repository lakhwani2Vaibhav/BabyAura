"use client";

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

export default function HospitalsPage() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Manage Hospitals</CardTitle>
          <CardDescription>
            View and manage all partner hospitals on the platform.
          </CardDescription>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" /> Add Hospital
        </Button>
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
            {superAdminData.hospitals.map((hospital) => (
              <TableRow key={hospital.id}>
                <TableCell className="font-medium">{hospital.name}</TableCell>
                <TableCell>
                  {format(new Date(hospital.joinedDate), "MMMM d, yyyy")}
                </TableCell>
                <TableCell>
                   <Badge variant="outline">{hospital.plan}</Badge>
                </TableCell>
                 <TableCell>
                  <Badge
                    variant={hospital.status === "Active" ? "default" : "destructive"}
                    className={hospital.status === 'Active' ? 'bg-green-500/20 text-green-700 border-transparent hover:bg-green-500/30' : 'bg-yellow-500/20 text-yellow-700 border-transparent hover:bg-yellow-500/30'}
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
                      <DropdownMenuItem>View Dashboard</DropdownMenuItem>
                      <DropdownMenuItem>Manage Billing</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        Suspend Account
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
  );
}
