"use client";

import React, { useState } from "react";
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

const initialNotifications = [
  {
    id: 1,
    title: "New message from Dr. Carter",
    description: "Regarding your upcoming appointment.",
    read: false,
  },
  {
    id: 2,
    title: "Vaccination Reminder",
    description: "Hepatitis B (3rd dose) is due next week.",
    read: false,
  },
  {
    id: 3,
    title: "Scrapbook comment",
    description: "Jessica M. commented on 'First Smile'.",
    read: true,
  },
];

export function NotificationBell() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

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
        <div className="max-h-80 overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
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
            ))
          ) : (
            <div className="text-center text-sm text-muted-foreground p-4">
                You're all caught up!
            </div>
          )}
        </div>
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
