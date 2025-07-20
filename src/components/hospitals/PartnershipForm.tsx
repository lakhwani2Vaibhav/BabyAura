
"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

const hospitalInfoSchema = z.object({
  hospitalName: z.string().min(3, "Hospital name is required."),
  hospitalAddress: z.string().min(10, "Full address is required."),
  hospitalSize: z.enum(["1-50", "51-200", "201-500", "500+"]),
});

const adminInfoSchema = z.object({
  adminName: z.string().min(2, "Your full name is required."),
  adminEmail: z.string().email("Please enter a valid email address."),
  adminPhone: z.string().min(10, "Please enter a valid phone number."),
});

const partnershipSchema = z.object({
  businessModel: z.enum(["licensing", "revenue-share"]),
  comments: z.string().optional(),
});

const fullFormSchema = hospitalInfoSchema.merge(adminInfoSchema).merge(partnershipSchema);

type FormValues = z.infer<typeof fullFormSchema>;

const steps = [
  { id: "hospital", fields: Object.keys(hospitalInfoSchema.shape), title: "Hospital Information" },
  { id: "admin", fields: Object.keys(adminInfoSchema.shape), title: "Your Contact Information" },
  { id: "partnership", fields: Object.keys(partnershipSchema.shape), title: "Partnership Details" },
];

export function PartnershipForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(fullFormSchema),
    mode: "onTouched",
    defaultValues: {
      hospitalName: "",
      hospitalAddress: "",
      hospitalSize: undefined,
      adminName: "",
      adminEmail: "",
      adminPhone: "",
      businessModel: undefined,
      comments: "",
    },
  });

  const watchedFields = useWatch({ control: form.control });

  const nextStep = async () => {
    const fieldsToValidate = steps[currentStep].fields;
    const isValid = await form.trigger(fieldsToValidate as (keyof FormValues)[]);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };
  
  const onSubmit = (data: FormValues) => {
    setIsSubmitting(true);
    console.log("Partnership form submitted:", data);
    
    setTimeout(() => {
        toast({
            title: "Application Sent!",
            description: "Thank you for your interest! Our team will be in touch shortly.",
        });
        form.reset();
        setCurrentStep(0);
        setIsSubmitting(false);
    }, 1500);
  };

  const progress = ((currentStep + 1) / (steps.length + 1)) * 100;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Progress value={progress} className="h-2 mb-8" />
        <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -30, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 0 && (
                <div className="space-y-4">
                   <h3 className="text-lg font-semibold">{steps[0].title}</h3>
                  <FormField control={form.control} name="hospitalName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hospital Name</FormLabel>
                        <FormControl><Input placeholder="e.g., City General Hospital" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  <FormField control={form.control} name="hospitalAddress" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hospital Address</FormLabel>
                        <FormControl><Textarea placeholder="123 Main Street, Anytown, USA 12345" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                   <FormField control={form.control} name="hospitalSize" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Beds</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger><SelectValue placeholder="Select hospital size" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="1-50">1-50 beds</SelectItem>
                                <SelectItem value="51-200">51-200 beds</SelectItem>
                                <SelectItem value="201-500">201-500 beds</SelectItem>
                                <SelectItem value="500+">500+ beds</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                </div>
              )}
               {currentStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">{steps[1].title}</h3>
                  <FormField control={form.control} name="adminName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Full Name</FormLabel>
                        <FormControl><Input placeholder="e.g., Dr. Jane Doe" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  <FormField control={form.control} name="adminEmail" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Work Email Address</FormLabel>
                        <FormControl><Input placeholder="e.g., jane.doe@hospital.com" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                     <FormField control={form.control} name="adminPhone" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Work Phone Number</FormLabel>
                        <FormControl><Input type="tel" placeholder="(123) 456-7890" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                </div>
              )}
              {currentStep === 2 && (
                 <div className="space-y-4">
                  <h3 className="text-lg font-semibold">{steps[2].title}</h3>
                  <FormField control={form.control} name="businessModel" render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Preferred Business Model</FormLabel>
                         <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                                <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent has-[[data-state=checked]]:bg-accent">
                                    <FormControl><RadioGroupItem value="licensing" /></FormControl>
                                    <FormLabel className="font-normal flex-1">
                                        <p className="font-semibold">Licensing Fee</p>
                                        <p className="text-sm text-muted-foreground">Fixed monthly/annual fee for predictable budgeting.</p>
                                    </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent has-[[data-state=checked]]:bg-accent">
                                    <FormControl><RadioGroupItem value="revenue-share" /></FormControl>
                                    <FormLabel className="font-normal flex-1">
                                        <p className="font-semibold">Revenue Sharing</p>
                                        <p className="text-sm text-muted-foreground">A true partnership model based on shared growth.</p>
                                    </FormLabel>
                                </FormItem>
                            </RadioGroup>
                         </FormControl>
                         <FormMessage />
                      </FormItem>
                    )} />
                   <FormField control={form.control} name="comments" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Comments or Questions</FormLabel>
                        <FormControl><Textarea placeholder="Anything else you'd like us to know?" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                </div>
              )}
            </motion.div>
        </AnimatePresence>

        <div className="flex justify-between pt-4">
          {currentStep > 0 && (
            <Button type="button" variant="outline" onClick={prevStep}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
          )}
          {currentStep < steps.length - 1 && (
            <Button type="button" onClick={nextStep} className="ml-auto">
              Next
            </Button>
          )}
          {currentStep === steps.length - 1 && (
            <Button type="submit" className="ml-auto" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
              Submit Application
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
