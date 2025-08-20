"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { PlusCircle, Trash2, Loader2, CheckCircle2, Bot, HeartHandshake, ChevronDown, ChevronRight, Stethoscope, Utensils, Brain, Phone, Edit } from "lucide-react";
import { CostBreakdown } from "@/components/hospitals/CostBreakdown";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";


const offerSchema = z.object({
  text: z.string().min(3, "Offer text is too short."),
});

const servicesSchema = z.object({
    pediatrics: z.boolean().default(false),
    nutrition: z.boolean().default(false),
    therapy: z.boolean().default(false),
    emergency: z.boolean().default(false),
    chat: z.boolean().default(false),
    nurse: z.boolean().default(false),
});

const planSchema = z.object({
  _id: z.string().optional(),
  planName: z.string().min(3, "Plan name is required."),
  monthlyPrice: z.coerce.number().min(0, "Price must be a positive number."),
  annualPrice: z.coerce.number().min(0, "Price must be a positive number."),
  description: z.string().min(10, "Description is required."),
  services: servicesSchema,
  customFeatures: z.array(offerSchema),
  isMostPopular: z.boolean(),
  babyaura360Enabled: z.boolean(),
});

type PlanFormValues = z.infer<typeof planSchema>;

const platformFeatures = [
    { name: 'Growth Trackers & Milestones', icon: CheckCircle2 },
    { name: 'Immunization Alerts & Support', icon: CheckCircle2 },
    { name: 'Health Feedback & Prescription Reminders', icon: CheckCircle2 },
    { name: 'AI Assistance for queries', icon: Bot },
    { name: 'Automated Essentials Delivery', icon: CheckCircle2 },
];

const coreServices = [
    { id: 'pediatrics', label: 'Dedicated Pediatrics Support', icon: Stethoscope },
    { id: 'nutrition', label: 'Dedicated Dietician Support', icon: Utensils },
    { id: 'therapy', label: 'Mind Therapist Sessions', icon: Brain },
    { id: 'emergency', label: '24/7 Call Assistance', icon: Phone },
    { id: 'chat', label: 'Quick Chat/Call Support', icon: HeartHandshake },
    { id: 'nurse', label: 'Dedicated Nurse Concierge', icon: Stethoscope },
] as const;


export default function ManagePlansPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [plans, setPlans] = useState<PlanFormValues[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpenPlatform, setIsOpenPlatform] = useState(true);
  const [isOpenCore, setIsOpenCore] = useState(true);
  const [isOpenCustom, setIsOpenCustom] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PlanFormValues | null>(null);

  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      planName: "",
      monthlyPrice: 0,
      annualPrice: 0,
      description: "",
      services: {
        pediatrics: true,
        nutrition: true,
        therapy: false,
        emergency: true,
        chat: true,
        nurse: false,
      },
      customFeatures: [{ text: "" }],
      isMostPopular: false,
      babyaura360Enabled: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "customFeatures",
  });
  
  const fetchPlans = async () => {
    if(!user) return;
    setIsLoading(true);
    try {
        const token = localStorage.getItem('babyaura_token');
        const response = await fetch('/api/admin/plans', { headers: { 'Authorization': `Bearer ${token}` } });
        if (!response.ok) throw new Error("Failed to fetch plans.");
        setPlans(await response.json());
    } catch(error) {
        toast({ variant: 'destructive', title: "Error", description: "Could not fetch subscription plans."})
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [user]);

  const onSubmit = async (data: PlanFormValues) => {
    setIsSubmitting(true);
    try {
        const token = localStorage.getItem('babyaura_token');
        const response = await fetch('/api/admin/plans', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Failed to save plan');
        }
        
        toast({
            title: "Plan Saved!",
            description: `The "${data.planName}" plan has been successfully saved.`,
        });

        await fetchPlans();
        
        form.reset();
        setEditingPlan(null);

    } catch (error) {
        toast({
            variant: "destructive",
            title: "Error saving plan",
            description: "Could not save the plan. Please try again.",
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleEditClick = (plan: PlanFormValues) => {
      setEditingPlan(plan);
      form.reset(plan);
  }

  const handleCreateNewClick = () => {
      setEditingPlan({} as PlanFormValues); // Empty object to signify "new"
      form.reset({
        planName: "",
        monthlyPrice: 0,
        annualPrice: 0,
        description: "",
        services: { pediatrics: true, nutrition: true, therapy: false, emergency: true, chat: true, nurse: false, },
        customFeatures: [{ text: "" }],
        isMostPopular: false,
        babyaura360Enabled: false,
      });
  }

  const PlanFormFields = (
     <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
            control={form.control}
            name="planName"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Plan Name</FormLabel>
                <FormControl>
                <Input placeholder="e.g., Basic Care" {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="monthlyPrice"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Monthly Price (₹)</FormLabel>
                <FormControl>
                    <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="annualPrice"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Annual Price (₹)</FormLabel>
                <FormControl>
                    <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Short Description</FormLabel>
                <FormControl>
                <Textarea placeholder="A brief summary of the plan" {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
        
        {/* Features Section */}
        <div className="space-y-4 rounded-lg border p-4">
            <Collapsible open={isOpenPlatform} onOpenChange={setIsOpenPlatform}>
                <CollapsibleTrigger className="flex w-full items-center justify-between">
                    <h4 className="text-md font-semibold">BabyAura Platform Features</h4>
                    {isOpenPlatform ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 pt-2">
                    {platformFeatures.map(feature => (
                        <div key={feature.name} className="flex items-center gap-2 p-2 rounded-md bg-muted/50 text-sm">
                            <feature.icon className="h-4 w-4 text-primary" />
                            <p className="font-medium flex-1 text-muted-foreground">{feature.name}</p>
                        </div>
                    ))}
                </CollapsibleContent>
            </Collapsible>
            <Collapsible open={isOpenCore} onOpenChange={setIsOpenCore}>
                <CollapsibleTrigger className="flex w-full items-center justify-between">
                    <h4 className="text-md font-semibold">Core Medical Services</h4>
                    {isOpenCore ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-3 pt-2">
                <FormDescription>Select the services to include in this plan.</FormDescription>
                {coreServices.map(service => (
                    <FormField
                            key={service.id}
                            control={form.control}
                            name={`services.${service.id}`}
                            render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel className="flex items-center gap-2">
                                        <service.icon className="h-4 w-4" /> {service.label}
                                    </FormLabel>
                                </div>
                            </FormItem>
                            )}
                        />
                ))}
                </CollapsibleContent>
            </Collapsible>

            <Collapsible open={isOpenCustom} onOpenChange={setIsOpenCustom}>
                <CollapsibleTrigger className="flex w-full items-center justify-between">
                    <h4 className="text-md font-semibold">Custom Add-ons / Offers</h4>
                    {isOpenCustom ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-3 pt-2">
                    {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                        <FormField
                        control={form.control}
                        name={`customFeatures.${index}.text`}
                        render={({ field }) => (
                            <FormItem className="flex-1">
                            <FormControl>
                                <Input placeholder="e.g., 20% off at the clinic" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => remove(index)}
                            disabled={fields.length <= 1}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                    ))}
                    <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ text: "" })}
                    >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Custom Offer
                    </Button>
                </CollapsibleContent>
            </Collapsible>
        </div>

        <FormField
            control={form.control}
            name="isMostPopular"
            render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                <FormLabel>Mark as Most Popular</FormLabel>
                <FormDescription>
                    This will highlight the plan for parents.
                </FormDescription>
                </div>
                <FormControl>
                <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                />
                </FormControl>
            </FormItem>
            )}
        />

        <FormField
            control={form.control}
            name="babyaura360Enabled"
            render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-primary/5">
                <div className="space-y-0.5">
                <FormLabel>Enable BabyAura 360°</FormLabel>
                <FormDescription>
                    Use our in-house specialists on a revenue-share model.
                </FormDescription>
                </div>
                <FormControl>
                <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                />
                </FormControl>
            </FormItem>
            )}
        />
        
        <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {editingPlan?._id ? "Save Changes" : "Create Plan"}
        </Button>
        </form>
    </Form>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Manage Subscription Plans</h1>
        <p className="text-muted-foreground">
          Create and customize the subscription packages you offer to parents.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Create a Plan</CardTitle>
              <CardDescription>
                Click the button below to design a new subscription plan from scratch.
              </CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={handleCreateNewClick} className="w-full">
                    <PlusCircle className="mr-2 h-4 w-4" /> Create New Plan
                </Button>
            </CardContent>
          </Card>
        </div>
        
        <Dialog open={!!editingPlan} onOpenChange={(isOpen) => !isOpen && setEditingPlan(null)}>
             <DialogContent className="lg:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{editingPlan?._id ? "Edit Plan" : "Create New Plan"}</DialogTitle>
                    <DialogDescription>
                        {editingPlan?._id ? `Make changes to the "${editingPlan.planName}" plan and save.` : "Fill out the form to create a new plan."}
                    </DialogDescription>
                </DialogHeader>
                <div className="max-h-[70vh] overflow-y-auto -mx-6 px-6 pt-4">
                  {PlanFormFields}
                </div>
            </DialogContent>
        </Dialog>

        <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-semibold">Your Active Plans</h2>
            {isLoading ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card><CardContent className="p-6"><div className="h-64 rounded-md bg-muted animate-pulse" /></CardContent></Card>
                    <Card><CardContent className="p-6"><div className="h-64 rounded-md bg-muted animate-pulse" /></CardContent></Card>
                 </div>
            ) : plans.length === 0 ? (
                <Card className="text-center p-8">
                    <CardTitle>No Plans Yet</CardTitle>
                    <CardDescription>Click "Create New Plan" to get started.</CardDescription>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {plans.map((plan, index) => (
                        <Card key={index} className={cn("flex flex-col", plan.isMostPopular && "border-2 border-primary")}>
                            <CardHeader>
                                <CardTitle>{plan.planName}</CardTitle>
                                <CardDescription>{plan.description}</CardDescription>
                                <p className="text-3xl font-bold pt-2">₹{plan.monthlyPrice}<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <ul className="space-y-2">
                                    {coreServices.filter(s => plan.services[s.id]).map(s => (
                                        <li key={s.id} className="flex items-center gap-2 text-sm">
                                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                                            <span>{s.label}</span>
                                        </li>
                                    ))}
                                    {plan.customFeatures.map((feature, fIndex) => feature.text && (
                                        <li key={fIndex} className="flex items-center gap-2 text-sm">
                                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                                            <span>{feature.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" variant="outline" onClick={() => handleEditClick(plan)}>
                                    <Edit className="mr-2 h-4 w-4" /> Edit Plan
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
             {form.watch('babyaura360Enabled') && (
                <CostBreakdown />
            )}
        </div>
      </div>
    </div>
  );
}
