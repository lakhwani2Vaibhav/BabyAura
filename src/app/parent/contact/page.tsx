

"use client";

import { adminData } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MessageSquare, MessageSquarePlus, Phone, ShieldQuestion } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

import { doctorData } from "@/lib/data";
import Link from "next/link";
import { useState, useEffect } from "react";
import { formatDistanceToNow } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";


type RecentChat = {
    id: string;
    specialistName: string;
    specialistId: string;
    lastMessage: string;
    time: string;
    avatarUrl?: string;
    dataAiHint: string;
}

export default function ContactPage() {
    const [showInfo, setShowInfo] = useState(false);
    const [recentChats, setRecentChats] = useState<RecentChat[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { toast } = useToast();

    useEffect(() => {
        const fetchChats = async () => {
            if (!user) return;
            setLoading(true);
            try {
                const token = localStorage.getItem('babyaura_token');
                const response = await fetch('/api/parent/chats', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error("Failed to fetch chats");
                const data = await response.json();
                setRecentChats(data);
            } catch (error) {
                toast({ variant: 'destructive', title: 'Error', description: 'Could not load your recent chats.' });
            } finally {
                setLoading(false);
            }
        };

        fetchChats();

        // Show the info dialog only once per session
        if (!sessionStorage.getItem('contactInfoShown')) {
            setShowInfo(true);
            sessionStorage.setItem('contactInfoShown', 'true');
        }
    }, [user, toast]);

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    return parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`
      : name.substring(0, 2);
  };

  return (
      <div className="relative h-[calc(100vh-8rem)]">
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl font-bold font-headline">Messages</CardTitle>
                        <CardDescription>Your direct line to your care team.</CardDescription>
                    </div>
                    <AlertDialog open={showInfo} onOpenChange={setShowInfo}>
                        <AlertDialogTrigger asChild>
                             <Button variant="ghost" size="icon">
                                <ShieldQuestion className="h-5 w-5 text-muted-foreground" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <div className="p-2 bg-blue-100 rounded-full w-fit mb-2">
                                    <ShieldQuestion className="h-6 w-6 text-blue-600" />
                                </div>
                                <AlertDialogTitle>How to Ask a Doubt?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    For all non-emergency questions (e.g., feeding, sleep, general care), please start a chat with the <strong>Nurse Concierge</strong>. They are your first point of contact and can resolve most queries or direct you to the right specialist.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogAction onClick={() => setShowInfo(false)}>Got it!</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {loading ? (
                       Array.from({length: 2}).map((_, i) => (
                           <div key={i} className="flex items-center gap-4 p-4">
                               <Skeleton className="h-12 w-12 rounded-full" />
                               <div className="space-y-2 flex-1">
                                   <Skeleton className="h-4 w-1/3" />
                                   <Skeleton className="h-4 w-2/3" />
                               </div>
                           </div>
                       ))
                    ) : recentChats.length > 0 ? (
                        recentChats.map(chat => (
                             <Link key={chat.id} href={`/parent/${chat.specialistId}/chat`} className="block p-4 rounded-lg hover:bg-muted transition-colors">
                                <div className="flex items-start gap-4">
                                    <Avatar className="h-12 w-12 border">
                                        <AvatarImage src={chat.avatarUrl} data-ai-hint={chat.dataAiHint} />
                                        <AvatarFallback>{getInitials(chat.specialistName)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center">
                                            <p className="font-semibold truncate">{chat.specialistName}</p>
                                            <p className="text-xs text-muted-foreground flex-shrink-0 ml-2">{formatDistanceToNow(new Date(chat.time), { addSuffix: true })}</p>
                                        </div>
                                        <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="text-center text-muted-foreground p-8">No recent conversations. Start one by clicking the button below.</div>
                    )}
                </div>
            </CardContent>
        </Card>

         <Dialog>
            <DialogTrigger asChild>
                <Button className="absolute bottom-6 right-6 rounded-full h-16 w-16 shadow-lg">
                    <MessageSquarePlus className="h-8 w-8" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New Message</DialogTitle>
                    <DialogDescription>Select a specialist to start a conversation.</DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-3">
                    {/* Add Nurse Concierge here statically */}
                     <Link href="/parent/nurse-concierge/chat" className="block p-3 rounded-lg hover:bg-muted transition-colors">
                        <div className="flex items-center gap-3">
                             <Avatar className="h-10 w-10">
                                <AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="nurse portrait" />
                                <AvatarFallback>NC</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">Nurse Concierge</p>
                                <p className="text-sm text-muted-foreground">For general questions</p>
                            </div>
                        </div>
                    </Link>
                    {doctorData.patients.map(doctor => (
                        <Link key={doctor.id} href={`/parent/${doctor.id}/chat`} className="block p-3 rounded-lg hover:bg-muted transition-colors">
                            <div className="flex items-center gap-3">
                                 <Avatar className="h-10 w-10">
                                    <AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="doctor portrait" />
                                    <AvatarFallback>{getInitials(doctor.name)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{doctor.name}</p>
                                    <p className="text-sm text-muted-foreground">Pediatrician</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    </div>
  );
}
