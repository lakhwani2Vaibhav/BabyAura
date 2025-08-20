
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
import { PlusCircle, Trash2, Loader2, FileHeart, CheckCircle2, XCircle } from "lucide-react";
import { CostBreakdown } from "@/components/hospitals/CostBreakdown";

const offerSchema = z.object({
  text: z.string().min(3, "Offer text is too short."),
});

const planSchema = z.object({
  planName: z.string().min(3, "Plan name is required."),
  monthlyPrice: z.coerce.number().min(0, "Price must be a positive number."),
  annualPrice: z.coerce.number().min(0, "Price must be a positive number."),
  description: z.string().min(10, "Description is required."),
  features: z.array(offerSchema),
  isMostPopular: z.boolean(),
  babyaura360Enabled: z.boolean(),
});

type PlanFormValues = z.infer<typeof planSchema>;

const serviceFeatures = [
    { name: 'Dedicated Pediatrics Support', info: '24/7 access to our pediatricians.' },
    { name: '24/7 Call Assistance', info: 'Immediate help via call anytime.' },
    { name: 'Growth Trackers & Milestones', info: 'Track your baby\'s growth and milestones.' },
    { name: 'Immunization Alerts & Support', info: 'Get alerts for upcoming immunizations.' },
    { name: 'Health Feedback & Prescription Reminders', info: 'Reminders for prescriptions and health feedback.' },
    { name: 'Quick Chat/Call Support', info: 'Quick support via chat or call.' },
    { name: 'Dedicated Dietician Support', info: 'Get support from a dedicated dietician.' },
    { name: 'Automated Essentials Delivery', info: 'Automated delivery of baby essentials.' },
    { name: 'AI Assistance', info: 'Get AI-powered assistance for your queries.' },
    { name: 'Dedicated Nurse Concierge', info: 'Your personal nurse for all non-emergency queries.' },
];

export default function ManagePlansPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [plans, setPlans] = useState<PlanFormValues[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      planName: "",
      monthlyPrice: 0,
      annualPrice: 0,
      description: "",
      features: [{ text: "" }],
      isMostPopular: false,
      babyaura360Enabled: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "features",
  });
  
  useEffect(() => {
    // In a real app, you'd fetch existing plans here
    // For now, we'll start with an empty state
    setIsLoading(false);
  }, [user]);

  const onSubmit = (data: PlanFormValues) => {
    // In a real app, you'd send this to your API
    console.log(data);
    setPlans(prev => [...prev, data]);
    toast({
      title: "Plan Saved!",
      description: `The "${data.planName}" plan has been successfully saved.`,
    });
    form.reset();
  };

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
              <CardTitle>Create New Plan</CardTitle>
              <CardDescription>
                Design a new subscription plan from scratch.
              </CardDescription>
            </CardHeader>
            <CardContent>
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

                  <div>
                    <FormLabel>Features / Offerings</FormLabel>
                    <div className="space-y-2 mt-2">
                        {serviceFeatures.map(feature => (
                             <div key={feature.name} className="flex items-center gap-2 p-2 rounded-md border bg-muted/50">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                <p className="text-sm font-medium flex-1">{feature.name}</p>
                            </div>
                        ))}
                    </div>
                  </div>
                  
                  <div>
                    <FormLabel>Custom Add-ons / Offers</FormLabel>
                     <div className="space-y-2 mt-2">
                        {fields.map((field, index) => (
                          <div key={field.id} className="flex items-center gap-2">
                            <FormField
                              control={form.control}
                              name={`features.${index}.text`}
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
                          Add Feature
                        </Button>
                      </div>
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
                  
                  <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                     {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Plan
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-semibold">Plan Previews</h2>
            {form.watch('babyaura360Enabled') && (
                <CostBreakdown />
            )}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {plans.map((plan, index) => (
                    <Card key={index} className="flex flex-col">
                        <CardHeader>
                            <CardTitle>{plan.planName}</CardTitle>
                            <CardDescription>{plan.description}</CardDescription>
                            <p className="text-3xl font-bold pt-2">₹{plan.monthlyPrice}<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                        </CardHeader>
                        <CardContent className="flex-1">
                             <ul className="space-y-2">
                                {plan.features.map((feature, fIndex) => (
                                    <li key={fIndex} className="flex items-center gap-2 text-sm">
                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        <span>{feature.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" variant="outline">Preview</Button>
                        </CardFooter>
                    </Card>
                ))}
             </div>
        </div>
      </div>
    </div>
  );
}
