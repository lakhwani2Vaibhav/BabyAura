
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { ArrowLeft, Send, Paperclip, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';


type Message = {
  _id: string;
  senderId: string;
  content: string;
  createdAt: string;
};

type Patient = {
  _id: string;
  name: string;
  babyName: string;
  avatarUrl?: string;
}

export default function PatientChatPage() {
  const params = useParams();
  const { patientId } = params as { patientId: string };
  
  const [patient, setPatient] = useState<Patient | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);


  const fetchMessages = useCallback(async (isInitialLoad = false) => {
    if (!user || !patientId) return;
    try {
      const token = localStorage.getItem('babyaura_token');
      let url = `/api/parent/chat?specialistId=${patientId}`;
      if (!isInitialLoad && messages.length > 0) {
        const lastMessageTimestamp = messages[messages.length - 1].createdAt;
        url += `&since=${lastMessageTimestamp}`;
      }

      const messagesRes = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
      if (!messagesRes.ok) throw new Error('Failed to fetch messages');
      const newMessages: Message[] = await messagesRes.json();
      
      if (isInitialLoad) {
        setMessages(newMessages);
      } else if (newMessages.length > 0) {
        setMessages(prev => {
            const existingIds = new Set(prev.map(m => m._id));
            const uniqueNewMessages = newMessages.filter(m => !existingIds.has(m._id));
            return [...prev, ...uniqueNewMessages];
        });
      }

    } catch (error) {
       toast({ variant: 'destructive', title: 'Error', description: 'Could not update messages.' });
    }
  }, [user, patientId, toast, messages]);


  useEffect(() => {
    const fetchInitialData = async () => {
      if (!user || !patientId) return;
      setIsLoading(true);
      try {
        const token = localStorage.getItem('babyaura_token');
        
        const patientRes = await fetch(`/api/doctor/patients/${patientId}/details`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (!patientRes.ok) throw new Error('Failed to fetch patient details');
        const patientData = await patientRes.json();
        setPatient(patientData);

        await fetchMessages(true);

      } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not load chat history.' });
        if ((error as Error).message.includes('patient')) {
            notFound();
        }
      } finally {
        setIsLoading(false);
      }
    };

    if(user?.role === 'Doctor') {
        fetchInitialData();
    }
  }, [user, patientId, toast]);

  useEffect(() => {
    const interval = setInterval(() => fetchMessages(false), 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [fetchMessages]);

   useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);


  if (isLoading) {
       return (
         <div className="h-[calc(100vh-10rem)] md:h-full">
         <Card className="flex flex-col h-full">
            <CardHeader className="flex flex-row items-center gap-4 p-4 border-b">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                </div>
            </CardHeader>
            <CardContent className="flex-1 p-4 space-y-4">
                <Skeleton className="h-16 w-3/4" />
                <Skeleton className="h-16 w-3/4 ml-auto" />
                <Skeleton className="h-12 w-1/2" />
            </CardContent>
             <CardFooter className="p-4 border-t">
                 <Skeleton className="h-10 w-full" />
             </CardFooter>
        </Card>
        </div>
       )
  }

  if (!patient) {
    return notFound();
  }

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    return parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`
      : name.substring(0, 2);
  };
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !user) return;

    setIsSending(true);
    try {
        const token = localStorage.getItem('babyaura_token');
        const response = await fetch('/api/doctor/chats/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ content: newMessage, receiverId: patientId, senderRole: 'Doctor' })
        });
        if (!response.ok) throw new Error('Failed to send message');
        const sentMessage = await response.json();
        setMessages(prev => [...prev, sentMessage]);
        setNewMessage('');
    } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not send message.' });
    } finally {
        setIsSending(false);
    }
  };

  return (
    <div className="h-[calc(100vh-10rem)] md:h-full">
    <Card className="flex flex-col h-full">
        <CardHeader className="flex flex-row items-center gap-4 p-4 border-b">
          <Button asChild variant="ghost" size="icon" className="md:hidden">
            <Link href={`/doctor/patients`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <Avatar>
            <AvatarImage
              src={patient.avatarUrl}
              data-ai-hint="baby photo"
            />
            <AvatarFallback>{getInitials(patient.babyName)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold">{patient.babyName}</p>
            <p className="text-xs text-muted-foreground">Parent: {patient.name}</p>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-0 overflow-hidden">
            <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
            <div className="space-y-1">
                {messages.map((message, index) => {
                  const showAvatar = index === 0 || messages[index - 1].senderId !== message.senderId;
                  return (
                    <div
                        key={message._id}
                        className={cn(
                        'flex items-end gap-2 py-2',
                        message.senderId === user?.userId ? 'justify-end' : 'justify-start'
                        )}
                    >
                        {message.senderId !== user?.userId && (
                             <div className="w-8 flex-shrink-0">
                                {showAvatar && (
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={patient.avatarUrl} data-ai-hint="parent portrait" />
                                        <AvatarFallback>{getInitials(patient.name)}</AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                        )}
                        <div className="flex flex-col gap-1 max-w-[80%]">
                            <div
                                className={cn(
                                'rounded-lg p-3 text-sm shadow-sm',
                                message.senderId === user?.userId
                                ? 'bg-primary text-primary-foreground rounded-br-none'
                                : 'bg-muted rounded-bl-none'
                                )}
                            >
                                <p>{message.content}</p>
                            </div>
                             <p className={cn(
                                "text-xs text-muted-foreground px-1",
                                message.senderId === user?.userId ? 'text-right' : 'text-left'
                            )}>
                                {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                            </p>
                        </div>
                    </div>
                  );
                })}
            </div>
            </ScrollArea>
        </CardContent>
        <CardFooter className="p-4 border-t bg-background">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2 w-full">
            <Button variant="ghost" size="icon" type="button">
                <Paperclip className="h-5 w-5" />
            </Button>
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              autoComplete="off"
              disabled={isSending}
            />
            <Button type="submit" disabled={isSending}>
              {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </form>
        </CardFooter>
    </Card>
    </div>
  );
}
