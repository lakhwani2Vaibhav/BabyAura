
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
import { parentData } from "@/lib/data";
import { CheckCircle, Clock } from "lucide-react";
import { format } from "date-fns";

export default function VaccinationPage() {
  const allVaccinations = [
    ...parentData.vaccinationStatus.history.map((v) => ({
      ...v,
      status: "Completed",
    })),
    { ...parentData.vaccinationStatus.next, id: "v-next", status: "Upcoming" },
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vaccination Schedule</CardTitle>
        <CardDescription>
          Keep track of all completed and upcoming vaccinations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vaccine</TableHead>
              <TableHead>Recommended Age</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allVaccinations.map((vaccine) => (
              <TableRow key={vaccine.id}>
                <TableCell className="font-medium">{vaccine.name}</TableCell>
                <TableCell>{vaccine.age}</TableCell>
                <TableCell>{format(new Date(vaccine.date), "MMMM d, yyyy")}</TableCell>
                <TableCell className="text-right">
                  <Badge
                    variant={vaccine.status === "Completed" ? "default" : "secondary"}
                    className={vaccine.status === 'Completed' ? 'bg-green-100 text-green-800' : ''}
                  >
                    {vaccine.status === "Completed" ? (
                      <CheckCircle className="mr-2 h-4 w-4" />
                    ) : (
                      <Clock className="mr-2 h-4 w-4" />
                    )}
                    {vaccine.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
