
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { doctorData } from '@/lib/data';
import { notFound, useParams } from 'next/navigation';
import { ArrowLeft, Send, Paperclip } from 'lucide-react';
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

// Extend the data fetching to handle the static "nurse-concierge" ID
const allSpecialists = [
  ...doctorData.patients,
  { id: 'nurse-concierge', name: 'Nurse Concierge', chatHistory: [
       { from: 'parent', message: "Hi, I had a question about introducing solid foods.", timestamp: new Date().toISOString() },
       { from: 'doctor', message: "Of course! I can help with that. How old is your baby now?", timestamp: new Date().toISOString() },
  ]},
];

export default function SpecialistChatPage() {
  const params = useParams();
  const { specialistId } = params as { specialistId: string };
  const specialist = allSpecialists.find((p) => p.id === specialistId);

  const [message, setMessage] = useState('');

  if (!specialist) {
    return notFound();
  }
  
  const getInitials = (name: string) => {
    const parts = name.split(" ");
    return parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`
      : name.substring(0, 2);
  };
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() === '') return;
    // In a real app, this would send the message to a backend
    console.log(`Message to ${specialist.name}: ${message}`);
    setMessage('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]">
      <Card className="flex flex-col flex-1">
        <CardHeader className="flex flex-row items-center gap-4 p-4 border-b">
          <Button asChild variant="ghost" size="icon">
            <Link href={`/parent/contact`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <Avatar>
            <AvatarImage
              src={`https://placehold.co/100x100.png`}
              data-ai-hint="specialist portrait"
            />
            <AvatarFallback>{getInitials(specialist.name)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold">{specialist.name}</p>
            <p className="text-xs text-muted-foreground">Active now</p>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-0 overflow-hidden">
            <ScrollArea className="h-full p-4">
            <div className="space-y-4">
                {specialist.chatHistory?.map((chat, index) => (
                <div
                    key={index}
                    className={cn(
                    'flex items-end gap-2',
                    chat.from === 'parent' ? 'justify-end' : 'justify-start'
                    )}
                >
                    {chat.from === 'doctor' && (
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://placehold.co/100x100.png`} data-ai-hint="specialist portrait" />
                            <AvatarFallback>{getInitials(specialist.name)}</AvatarFallback>
                        </Avatar>
                    )}
                    <div
                    className={cn(
                        'max-w-xs md:max-w-md lg:max-w-lg rounded-lg p-3 text-sm',
                        chat.from === 'parent'
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-muted rounded-bl-none'
                    )}
                    >
                        <p>{chat.message}</p>
                         <p className={cn(
                             "text-xs mt-1 text-right",
                             chat.from === 'parent' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                         )}>
                            {formatDistanceToNow(new Date(chat.timestamp), { addSuffix: true })}
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
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              autoComplete="off"
            />
            <Button type="submit">
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
