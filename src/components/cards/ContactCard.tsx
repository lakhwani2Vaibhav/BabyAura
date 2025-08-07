
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MessageSquare, Phone } from "lucide-react";
import { Badge } from "../ui/badge";

interface ContactCardProps {
  name: string;
  title: string;
  avatar: string;
  dataAiHint: string;
  initials: string;
  available?: boolean;
}

export function ContactCard({
  name,
  title,
  avatar,
  dataAiHint,
  initials,
  available = true,
}: ContactCardProps) {
  return (
    <Card>
      <CardHeader className="items-center text-center">
        <Avatar className="h-20 w-20 mb-2">
          <AvatarImage src={avatar} data-ai-hint={dataAiHint} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <p className="font-bold">{name}</p>
        <p className="text-sm text-muted-foreground">{title}</p>
        <Badge variant={available ? "secondary" : "destructive"} className={`mt-1 ${available ? 'text-green-700 bg-green-500/20' : ''}`}>{available ? 'Available' : 'Offline'}</Badge>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row gap-2">
        <Button className="w-full" disabled={!available}>
          <MessageSquare className="mr-2 h-4 w-4" /> Chat
        </Button>
        <Button variant="outline" className="w-full" disabled={!available}>
          <Phone className="mr-2 h-4 w-4" /> Request Call
        </Button>
      </CardContent>
    </Card>
  );
}
