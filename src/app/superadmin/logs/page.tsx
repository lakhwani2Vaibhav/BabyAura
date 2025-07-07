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
import { superAdminData } from "@/lib/data";
import { format } from "date-fns";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function LogsPage() {
  const [logs, setLogs] = useState(superAdminData.platformLogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [logType, setLogType] = useState("all");

  useEffect(() => {
    let results = superAdminData.platformLogs;

    if (logType !== "all") {
      results = results.filter(
        (log) => log.type.toLowerCase() === logType
      );
    }

    if (searchTerm.trim() !== "") {
      results = results.filter(
        (log) =>
          log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.details.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setLogs(results);
  }, [searchTerm, logType]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage Logs</CardTitle>
        <CardDescription>
          View system and usage logs for the platform.
        </CardDescription>
        <div className="flex items-center gap-4 pt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by user, action, or details..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={logType} onValueChange={setLogType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="auth">Authentication</SelectItem>
              <SelectItem value="api">API</SelectItem>
              <SelectItem value="billing">Billing</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length > 0 ? (
              logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-xs">
                    {format(new Date(log.timestamp), "MMM d, yyyy, hh:mm:ss a")}
                  </TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{log.action}</Badge>
                  </TableCell>
                  <TableCell>{log.type}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {log.details}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No logs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
