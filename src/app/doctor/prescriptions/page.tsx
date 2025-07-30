
"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FilePlus2, MoreHorizontal, Download, Stethoscope } from "lucide-react";
import { doctorData } from "@/lib/data";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { BabyAuraLogo } from "@/components/icons/BabyAuraLogo";
import { Separator } from "@/components/ui/separator";

const prescriptionSchema = z.object({
  patientName: z.string().min(1, "Patient name is required."),
  medication: z.string().min(1, "Medication is required."),
  instructions: z.string().min(1, "Instructions are required."),
});

type PrescriptionFormValues = z.infer<typeof prescriptionSchema>;
type Prescription = (typeof doctorData.prescriptions)[0];

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState(doctorData.prescriptions);
  const [openCreateRenew, setOpenCreateRenew] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedPrescription, setSelectedPrescription] =
    useState<Prescription | null>(null);
  const [isRenewMode, setIsRenewMode] = useState(false);
  const { toast } = useToast();
  const prescriptionRef = useRef<HTMLDivElement>(null);

  const form = useForm<PrescriptionFormValues>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      patientName: "",
      medication: "",
      instructions: "",
    },
  });

  const handleCreateNew = () => {
    form.reset({ patientName: "", medication: "", instructions: "" });
    setIsRenewMode(false);
    setSelectedPrescription(null);
    setOpenCreateRenew(true);
  };

  const handleRenewClick = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    form.reset({
      patientName: prescription.patientName,
      medication: prescription.medication,
      instructions: `RENEWED: Original instructions were: Take as directed. Please verify dosage and frequency.`,
    });
    setIsRenewMode(true);
    setOpenCreateRenew(true);
  };

  const handleViewDetailsClick = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setOpenView(true);
  };

  const onSubmit = (data: PrescriptionFormValues) => {
    toast({
      title: isRenewMode ? "Prescription Renewed" : "Prescription Created",
      description: `The prescription for ${data.patientName} has been successfully ${
        isRenewMode ? "renewed" : "issued"
      }.`,
    });
    setOpenCreateRenew(false);
  };

  const handleDownloadPdf = () => {
    const input = prescriptionRef.current;
    if (!input) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not find content to download.",
      });
      return;
    }

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 10, 10, pdfWidth - 20, pdfHeight - 20);
      pdf.save(
        `prescription-${selectedPrescription?.patientName.replace(" ", "-")}-${
          selectedPrescription?.id
        }.pdf`
      );

      toast({
        title: "Download Complete",
        description: "The prescription PDF has been downloaded.",
      });
    });
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Prescriptions</CardTitle>
            <CardDescription>
              Manage and issue new prescriptions for your patients.
            </CardDescription>
          </div>
          <Button onClick={handleCreateNew}>
            <FilePlus2 className="mr-2 h-4 w-4" />
            Create Prescription
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient Name</TableHead>
                <TableHead>Medication</TableHead>
                <TableHead>Date Issued</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prescriptions.map((prescription) => (
                <TableRow key={prescription.id}>
                  <TableCell className="font-medium">
                    {prescription.patientName}
                  </TableCell>
                  <TableCell>{prescription.medication}</TableCell>
                  <TableCell>
                    {format(new Date(prescription.dateIssued), "MMMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        prescription.status === "Active"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {prescription.status}
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
                        <DropdownMenuItem
                          onClick={() => handleViewDetailsClick(prescription)}
                        >
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleRenewClick(prescription)}
                        >
                          Renew Prescription
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

      {/* Create/Renew Dialog */}
      <Dialog open={openCreateRenew} onOpenChange={setOpenCreateRenew}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isRenewMode ? "Renew Prescription" : "New Prescription"}
            </DialogTitle>
            <DialogDescription>
              {isRenewMode
                ? `Renewing prescription for ${selectedPrescription?.patientName}. Please verify all details.`
                : "Fill in the details to issue a new prescription."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 py-4"
            >
              <FormField
                control={form.control}
                name="patientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Baby Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="medication"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medication</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Amoxicillin 250mg/5ml"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="instructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instructions</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Take 5ml by mouth every 8 hours for 7 days."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="ghost">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">
                  {isRenewMode ? "Renew Prescription" : "Create Prescription"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={openView} onOpenChange={setOpenView}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Prescription Details</DialogTitle>
            <DialogDescription>
              Prescription for {selectedPrescription?.patientName}, issued on{" "}
              {selectedPrescription
                ? format(new Date(selectedPrescription.dateIssued), "MMMM d, yyyy")
                : ""}.
            </DialogDescription>
          </DialogHeader>
          <div
            ref={prescriptionRef}
            className="p-6 border rounded-lg bg-background max-h-[60vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-bold text-lg">Dr. Emily Carter</h3>
                <p className="text-sm text-muted-foreground">Pediatrics</p>
                <p className="text-sm text-muted-foreground">
                  General Hospital
                </p>
              </div>
              <BabyAuraLogo />
            </div>
            <Separator className="my-4" />
            <div className="grid grid-cols-2 gap-4 text-sm mb-6">
              <div>
                <p className="font-semibold">Patient</p>
                <p>{selectedPrescription?.patientName}</p>
              </div>
              <div>
                <p className="font-semibold">Date Issued</p>
                <p>
                  {selectedPrescription
                    ? format(
                        new Date(selectedPrescription.dateIssued),
                        "MMMM d, yyyy"
                      )
                    : ""}
                </p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold flex items-center gap-2 text-base mb-2">
                <Stethoscope className="w-5 h-5" />
                Prescription
              </h4>
              <Card>
                <CardContent className="p-4 space-y-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">Medication</Label>
                    <p className="font-semibold">
                      {selectedPrescription?.medication}
                    </p>
                  </div>
                   <div>
                    <Label className="text-xs text-muted-foreground">Instructions</Label>
                    <p>
                        Take 5ml by mouth every 8 hours for 7 days.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            <p className="text-xs text-center mt-8 text-muted-foreground">
              This is not a legal document. Consult with your pharmacist.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleDownloadPdf}>
              <Download className="mr-2 h-4 w-4" />
              Download as PDF
            </Button>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
