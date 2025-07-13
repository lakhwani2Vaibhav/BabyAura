
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Baby,
  Syringe,
  Stethoscope,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { ChecklistItem } from "@/components/timeline/ChecklistItem";

const initialDailyTasks = [
  { id: 1, text: "Morning feeding (8:00 AM)", completed: true },
  { id: 2, text: "Tummy time (15 mins)", completed: true },
  { id: 3, text: "Morning nap (9:30 AM - 10:30 AM)", completed: false },
  { id: 4, text: "Mid-day feeding (12:00 PM)", completed: false },
  { id: 5, text: "Read a book together", completed: false },
  { id: 6, text: "Buy new diapers", completed: false },
  { id: 7, text: "Afternoon nap (2:00 PM - 3:30 PM)", completed: false },
];

const longTermSchedule = [
  {
    id: 1,
    icon: Stethoscope,
    title: "6-Month Well-Baby Visit",
    due: "In 2 weeks",
  },
  { id: 2, icon: Syringe, title: "Hepatitis B (3rd dose)", due: "In 3 weeks" },
  {
    id: 3,
    icon: Baby,
    title: "Introduce solid foods (Stage 2)",
    due: "This month",
  },
];

export default function TimelinePage() {
  const [tasks, setTasks] = useState(initialDailyTasks);

  const toggleTask = (taskId: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };
  
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-2xl font-bold font-headline">
            Hey Mrs. CRO (Chief Responsible Officer)!
          </CardTitle>
          <CardDescription>
            Here’s a look at your day. You’re doing great!
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="daily">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="daily">Daily Checklist</TabsTrigger>
          <TabsTrigger value="long-term">Long-Term Schedule</TabsTrigger>
        </TabsList>
        <TabsContent value="daily" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Daily Timeline</CardTitle>
              <CardDescription>
                A plan for today. This checklist refreshes every 24 hours.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium text-muted-foreground">Daily Progress</p>
                    <p className="text-sm font-semibold">{completedTasks} / {totalTasks} tasks done</p>
                </div>
                <Progress value={progressPercentage} className="w-full h-2" />
              </div>

              <div className="space-y-2 pt-4">
                {tasks.map((task) => (
                  <ChecklistItem
                    key={task.id}
                    id={task.id}
                    text={task.text}
                    completed={task.completed}
                    onToggle={toggleTask}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="long-term" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Long-Term Schedule</CardTitle>
              <CardDescription>
                Important upcoming milestones and appointments.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {longTermSchedule.map((item) => (
                <Card key={item.id} className="p-4 flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-grow">
                    <p className="font-semibold">{item.title}</p>
                  </div>
                  <div className="text-sm text-muted-foreground text-right">
                    {item.due}
                  </div>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
