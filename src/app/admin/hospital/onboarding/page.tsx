
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Copy } from "lucide-react";

export default function HospitalOnboardingPage() {
  const { toast } = useToast();
  const hospitalCode = "GAH789";

  const handleSaveChanges = () => {
    toast({
      title: "Changes Saved",
      description: "Hospital information has been successfully updated.",
    });
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(hospitalCode);
    toast({
        title: "Code Copied!",
        description: "The hospital code has been copied to your clipboard."
    })
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Hospital Information</CardTitle>
        <CardDescription>
          Manage your hospital's profile, specialties, and unique code for parent onboarding.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="hospital-name">Hospital Name</Label>
          <Input id="hospital-name" defaultValue="General Hospital" />
        </div>
        <div className="space-y-2">
            <Label htmlFor="hospital-code">Unique Hospital Code</Label>
            <div className="flex items-center gap-2">
                <Input id="hospital-code" value={hospitalCode} readOnly />
                <Button variant="outline" size="icon" onClick={handleCopyCode}>
                    <Copy className="h-4 w-4" />
                </Button>
            </div>
            <p className="text-xs text-muted-foreground">
                Parents will use this code to connect with your hospital.
            </p>
        </div>
        <div className="space-y-4">
          <Label>Specialties</Label>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
                <Checkbox id="pediatrics" defaultChecked />
                <Label
                htmlFor="pediatrics"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                Pediatrics
                </Label>
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox id="nutrition" defaultChecked />
                <Label
                htmlFor="nutrition"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                Nutrition
                </Label>
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox id="emergency" defaultChecked />
                <Label
                htmlFor="emergency"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                Emergency Care
                </Label>
            </div>
             <div className="flex items-center space-x-2">
                <Checkbox id="cardiology" />
                <Label
                htmlFor="cardiology"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                Pediatric Cardiology
                </Label>
            </div>
          </div>
        </div>
        <Button onClick={handleSaveChanges}>Save Changes</Button>
      </CardContent>
    </Card>
  );
}
