
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generateScrapbookCaption } from "@/ai/flows/generate-scrapbook-caption";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Sparkles, UploadCloud, Heart } from "lucide-react";

const memorySchema = z.object({
  description: z
    .string()
    .min(10, "Please provide a more detailed description."),
  keywords: z.string().optional(),
  caption: z.string().optional(),
});

type MemoryFormValues = z.infer<typeof memorySchema>;

export function UploadMemoryModal() {
  const [open, setOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [caption, setCaption] = useState("");
  const { toast } = useToast();

  const form = useForm<MemoryFormValues>({
    resolver: zodResolver(memorySchema),
    defaultValues: {
      description: "",
      keywords: "",
      caption: "",
    },
  });

  const handleGenerateCaption = async () => {
    const { description, keywords } = form.getValues();
    if (!description) {
      form.setError("description", {
        type: "manual",
        message: "Description is needed to generate a caption.",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateScrapbookCaption({
        description,
        keywords: keywords || "",
        mediaType: "image", // Hardcoded for now, would be dynamic with file upload
      });
      setCaption(result.caption);
      toast({
        title: "Caption Generated!",
        description: "The AI has suggested a caption for your memory.",
      });
    } catch (error) {
      console.error("Failed to generate caption:", error);
      toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: "Could not generate an AI caption. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmit = (data: MemoryFormValues) => {
    console.log("New memory submitted:", { ...data, caption });
    toast({
      title: "Memory Saved!",
      description: "Your new memory has been added to the scrapbook.",
    });
    form.reset();
    setCaption("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Memory
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader className="text-center items-center">
            <div className="p-2 bg-primary/10 rounded-full inline-block">
                <Heart className="h-6 w-6 text-primary" />
            </div>
          <DialogTitle className="text-xl font-bold">AI Scrapbook Helper</DialogTitle>
          <DialogDescription>
            Upload a memory, add a description, and let our AI create a
            beautiful caption.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted">
              <UploadCloud className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="font-semibold">Click to upload photo, audio, or video</p>
              <p className="text-xs text-muted-foreground">PNG, JPG, MP3, MP4</p>
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Memory Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Baby's first steps in the living room."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="keywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (comma-separated)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., first steps, happy, family"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {caption && (
                <div className="p-4 bg-primary/10 rounded-md text-sm text-primary-foreground/90 italic border border-primary/20">
                    <p className="font-medium text-primary">Generated Caption:</p>
                    <p className="text-primary/90">"{caption}"</p>
                </div>
            )}
            
            <Button
              type="button"
              className="w-full"
              onClick={handleGenerateCaption}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Generate Caption
            </Button>
            
            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Save Memory</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

