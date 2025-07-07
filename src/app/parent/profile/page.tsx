
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";

export default function ParentProfilePage() {
  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="https://placehold.co/80x80.png" data-ai-hint="woman smiling" />
              <AvatarFallback>PA</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">Parent's Name</CardTitle>
              <CardDescription>parent@babyaura.com</CardDescription>
            </div>
            <Button variant="outline" size="icon" className="ml-auto">
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Baby's Name</Label>
            <Input defaultValue="Aura" readOnly />
          </div>
          <div className="space-y-2">
            <Label>Baby's Date of Birth</Label>
            <Input defaultValue="December 5, 2023" readOnly />
          </div>
          <div className="space-y-2">
            <Label>Connected Hospital</Label>
            <Input defaultValue="General Hospital" readOnly />
          </div>
           <Button>Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
