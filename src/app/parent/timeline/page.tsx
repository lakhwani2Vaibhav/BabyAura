
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Baby,
  Syringe,
  Stethoscope,
  Bot,
  Loader2
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { ChecklistItem } from "@/components/timeline/ChecklistItem";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { updateParentTimeline } from "@/ai/flows/update-parent-timeline";
import { ScrollAnimationWrapper } from "@/components/layout/ScrollAnimationWrapper";


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
  const [prompt, setPrompt] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();


  const toggleTask = (taskId: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handlePromptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsUpdating(true);
    try {
      const result = await updateParentTimeline({
        prompt: prompt,
        currentTasks: tasks,
      });
      if (result.updatedTasks) {
        setTasks(result.updatedTasks);
        toast({
          title: "Timeline Updated!",
          description: "Your AI assistant has updated your checklist.",
        });
      } else {
         toast({
          variant: "destructive",
          title: "Update Failed",
          description: "The AI couldn't understand the request. Please try rephrasing.",
        });
      }
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong while updating your timeline.",
      });
      console.error(error);
    } finally {
      setPrompt("");
      setIsUpdating(false);
    }
  };
  
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="space-y-6">
       <div className="text-center">
            <h1 className="text-3xl font-bold font-headline tracking-tight">Your Daily Command Center, Mrs. CRO!</h1>
            <p className="text-muted-foreground mt-2">Here’s a look at your day. You’re doing great!</p>
        </div>

      <Tabs defaultValue="daily">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="daily">Daily Checklist</TabsTrigger>
          <TabsTrigger value="long-term">Long-Term Schedule</TabsTrigger>
        </TabsList>
        <TabsContent value="daily" className="mt-6">
          <ScrollAnimationWrapper animationClasses="animate-in fade-in zoom-in-95 duration-700 ease-out">
            <Card>
              <CardHeader>
                <CardTitle>Today's Timeline</CardTitle>
                <CardDescription>
                  A plan for today. Use the prompter below to make changes. This list refreshes every 24 hours.
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
               <CardFooter>
                <form onSubmit={handlePromptSubmit} className="w-full flex items-center gap-2">
                  <Bot className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <Input 
                      placeholder="e.g., 'Add feeding at 2pm' or 'mark tummy time as done'"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      disabled={isUpdating}
                  />
                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update"}
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </ScrollAnimationWrapper>
        </TabsContent>
        <TabsContent value="long-term" className="mt-6">
          <ScrollAnimationWrapper animationClasses="animate-in fade-in zoom-in-95 duration-700 ease-out">
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
          </ScrollAnimationWrapper>
        </TabsContent>
      </Tabs>
    </div>
  );
}
