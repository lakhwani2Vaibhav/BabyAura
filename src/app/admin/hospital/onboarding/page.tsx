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

export default function HospitalOnboardingPage() {
  const { toast } = useToast();

  const handleSaveChanges = () => {
    toast({
      title: "Changes Saved",
      description: "Hospital information has been successfully updated.",
    });
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Hospital Information</CardTitle>
        <CardDescription>
          Manage your hospital's profile and specialties.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="hospital-name">Hospital Name</Label>
          <Input id="hospital-name" defaultValue="General Hospital" />
        </div>
        <div className="space-y-4">
          <Label>Specialties</Label>
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
              Emergency
            </Label>
          </div>
        </div>
        <Button onClick={handleSaveChanges}>Save Changes</Button>
      </CardContent>
    </Card>
  );
}
