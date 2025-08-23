
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

type Specialist = {
  id: string;
  name: string;
  avatarUrl?: string;
}

export default function SpecialistChatPage() {
  const params = useParams();
  const { specialistId } = params as { specialistId: string };
  
  const [specialist, setSpecialist] = useState<Specialist | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);


  const fetchMessages = useCallback(async () => {
    if (!user || !specialistId) return;
    try {
        const token = localStorage.getItem('babyaura_token');
        const messagesRes = await fetch(`/api/parent/chat?specialistId=${specialistId}`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (!messagesRes.ok) throw new Error('Failed to fetch messages');
        const messagesData = await messagesRes.json();
        setMessages(messagesData);
    } catch(error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not update messages.' });
    }

  }, [user, specialistId, toast]);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!user || !specialistId) return;
      setIsLoading(true);
      try {
        const token = localStorage.getItem('babyaura_token');
        
        const specialistRes = await fetch(`/api/specialists/${specialistId}`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (!specialistRes.ok) throw new Error('Failed to fetch specialist details');
        const specialistData = await specialistRes.json();
        setSpecialist(specialistData);

        await fetchMessages();

      } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not load chat history.' });
        if ((error as Error).message.includes('specialist')) {
            notFound();
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, [user, specialistId, toast, fetchMessages]);

   useEffect(() => {
    const interval = setInterval(fetchMessages, 5000); // Poll every 5 seconds
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
       )
  }

  if (!specialist) {
    return notFound();
  }
  
  const getInitials = (name: string) => {
    const parts = name.split(" ");
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
        const response = await fetch('/api/parent/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ content: newMessage, receiverId: specialistId })
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
    <Card className="flex flex-col h-full">
        <CardHeader className="flex flex-row items-center gap-4 p-4 border-b">
          <Button asChild variant="ghost" size="icon">
            <Link href={`/parent/contact`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <Avatar>
            <AvatarImage
              src={specialist.avatarUrl}
              data-ai-hint="specialist portrait"
            />
            <AvatarFallback>{getInitials(specialist.name)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold">{specialist.name}</p>
            <p className="text-xs text-muted-foreground">Online</p>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-0 overflow-hidden">
            <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                    {messages.map((message) => (
                    <div
                        key={message._id}
                        className={cn(
                        'flex items-end gap-2',
                        message.senderId === user?.userId ? 'justify-end' : 'justify-start'
                        )}
                    >
                        {message.senderId !== user?.userId && (
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={specialist.avatarUrl} data-ai-hint="specialist portrait" />
                                <AvatarFallback>{getInitials(specialist.name)}</AvatarFallback>
                            </Avatar>
                        )}
                        <div
                        className={cn(
                            'max-w-xs md:max-w-md lg:max-w-lg rounded-lg p-3 text-sm',
                            message.senderId === user?.userId
                            ? 'bg-primary text-primary-foreground rounded-br-none'
                            : 'bg-muted rounded-bl-none'
                        )}
                        >
                            <p>{message.content}</p>
                            <p className={cn(
                                "text-xs mt-1 text-right",
                                message.senderId === user?.userId ? 'text-primary-foreground/70' : 'text-muted-foreground'
                            )}>
                                {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                            </p>
                        </div>
                    </div>
                    ))}
                </div>
            </ScrollArea>
        </CardContent>
        <CardFooter className="p-4 border-t">
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
  );
}
