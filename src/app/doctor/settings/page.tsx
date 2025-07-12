
"use client"

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Calendar, Clock, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

const initialAvailability = {
  monday: [{ start: "09:00", end: "17:00" }],
  tuesday: [{ start: "09:00", end: "17:00" }],
  wednesday: [{ start: "09:00", end: "13:00" }],
  thursday: [{ start: "09:00", end: "17:00" }],
  friday: [{ start: "09:00", end: "17:00" }],
  saturday: [],
  sunday: [],
};

type Day = keyof typeof initialAvailability;

export default function DoctorSettingsPage() {
    const { toast } = useToast();
    const [availability, setAvailability] = useState(initialAvailability);

    const handleSaveChanges = () => {
        toast({
        title: "Profile Updated",
        description: "Your profile information has been successfully updated.",
        });
    };

    const handleScheduleSave = () => {
        toast({
        title: "Schedule Updated",
        description: "Your availability has been saved.",
        });
    };

    const isDayActive = (day: Day) => availability[day].length > 0;

    const toggleDay = (day: Day) => {
        setAvailability(prev => ({
            ...prev,
            [day]: prev[day].length > 0 ? [] : [{ start: "09:00", end: "17:00" }]
        }));
    };


  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="md:col-span-1">
        <Card>
            <CardHeader>
            <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                <AvatarImage src="https://placehold.co/80x80.png" data-ai-hint="doctor smiling" />
                <AvatarFallback>DC</AvatarFallback>
                </Avatar>
                <div>
                <CardTitle className="text-2xl">Dr. Emily Carter</CardTitle>
                <CardDescription>doctor@babyaura.com</CardDescription>
                </div>
                <Button variant="outline" size="icon" className="ml-auto flex-shrink-0">
                <Pencil className="h-4 w-4" />
                </Button>
            </div>
            </CardHeader>
            <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label>Specialty</Label>
                <Input defaultValue="Pediatrics" />
            </div>
            <div className="space-y-2">
                <Label>Hospital Affiliation</Label>
                <Input defaultValue="General Hospital" readOnly />
            </div>
            <Button onClick={handleSaveChanges}>Save Changes</Button>
            </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5"/> Manage Availability</CardTitle>
                <CardDescription>Set your weekly hours for consultations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {Object.keys(availability).map((day) => (
                    <div key={day}>
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <p className="font-medium capitalize">{day}</p>
                                <p className="text-xs text-muted-foreground">
                                    {isDayActive(day as Day) ? 'Available' : 'Unavailable'}
                                </p>
                            </div>
                            <Switch checked={isDayActive(day as Day)} onCheckedChange={() => toggleDay(day as Day)} />
                        </div>
                        {isDayActive(day as Day) && (
                            <div className="pl-6 pt-4 space-y-2">
                                {availability[day as Day].map((slot, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-muted-foreground" />
                                        <Input type="time" defaultValue={slot.start} className="w-32" />
                                        <span>-</span>
                                        <Input type="time" defaultValue={slot.end} className="w-32" />
                                        <Button variant="ghost" size="icon">
                                            <Trash2 className="w-4 h-4 text-destructive" />
                                        </Button>
                                    </div>
                                ))}
                                <Button variant="outline" size="sm" className="mt-2">
                                    <Plus className="w-4 h-4 mr-2" /> Add Slot
                                </Button>
                            </div>
                        )}
                        <Separator className="mt-6" />
                    </div>
                ))}
                 <Button onClick={handleScheduleSave}>Save Schedule</Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
