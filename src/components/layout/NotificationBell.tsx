
"use client";

import React, { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Bell, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { ScrollArea } from "../ui/scroll-area";

type Notification = {
  _id: string;
  title: string;
  description: string;
  read: boolean;
  href?: string;
};

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const token = localStorage.getItem('babyaura_token');
      const response = await fetch('/api/notifications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Failed to fetch notifications");
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      // Don't toast this error as it can be noisy on page loads
      console.error("Could not fetch notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    const interval = setInterval(fetchNotifications, 60000); // Poll every minute
    return () => clearInterval(interval);

  }, [user]);

  const handleMarkAllRead = async () => {
     try {
        const token = localStorage.getItem('babyaura_token');
        const response = await fetch('/api/notifications/mark-read', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Failed to mark notifications as read");
        setNotifications(notifications.map(n => ({ ...n, read: true })));
     } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not update notifications.'})
     }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const NotificationItem = ({ notification }: { notification: Notification }) => {
      const content = (
          <DropdownMenuItem
            className={cn(
                "flex flex-col items-start gap-1 whitespace-normal py-2 px-3",
                !notification.read && "bg-accent"
            )}
            onSelect={(e) => e.preventDefault()}
            >
            <p className={cn("font-medium", !notification.read && "text-primary")}>{notification.title}</p>
            <p className="text-xs text-muted-foreground">
                {notification.description}
            </p>
          </DropdownMenuItem>
      );

      if (notification.href) {
          return <Link href={notification.href}>{content}</Link>;
      }

      return content;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex justify-between items-center">
          Notifications
          {unreadCount > 0 && <Badge variant="secondary">{unreadCount} new</Badge>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="max-h-80">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificationItem key={notification._id} notification={notification} />
            ))
          ) : (
            <div className="text-center text-sm text-muted-foreground p-4">
                You're all caught up!
            </div>
          )}
        </ScrollArea>
        <DropdownMenuSeparator />
        <DropdownMenuItem
            className="flex items-center justify-center gap-2"
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
        >
          <Check className="h-4 w-4" />
          <span>Mark all as read</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
