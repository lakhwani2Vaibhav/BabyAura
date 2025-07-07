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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateScrapbookCaption } from "@/ai/flows/generate-scrapbook-caption";
import { useToast } from "@/hooks/use-toast";
import { Loader2, PlusCircle, Sparkles } from "lucide-react";

const memorySchema = z.object({
  mediaType: z.enum(["image", "audio", "video"]),
  description: z.string().min(10, "Please provide a more detailed description."),
  keywords: z.string().optional(),
  caption: z.string().optional(),
  file: z.any().optional(),
});

type MemoryFormValues = z.infer<typeof memorySchema>;

export function UploadMemoryModal() {
  const [open, setOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const form = useForm<MemoryFormValues>({
    resolver: zodResolver(memorySchema),
    defaultValues: {
      mediaType: "image",
      description: "",
      keywords: "",
      caption: "",
    },
  });

  const handleGenerateCaption = async () => {
    const { description, keywords, mediaType } = form.getValues();
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
        mediaType,
      });
      form.setValue("caption", result.caption);
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
    console.log("New memory submitted:", data);
    toast({
      title: "Memory Saved!",
      description: "Your new memory has been added to the scrapbook.",
    });
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Memory
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add a New Memory</DialogTitle>
          <DialogDescription>
            Upload a photo, video, or audio recording to the scrapbook.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="mediaType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Media Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select media type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="audio">Audio</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Describe the moment</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Baby's first time trying lemon, the face was priceless!"
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
                  <FormLabel>Tags / Keywords</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., eating, funny, milestone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="caption"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Caption</FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleGenerateCaption}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="mr-2 h-4 w-4" />
                      )}
                      Generate with AI
                    </Button>
                  </div>
                  <FormControl>
                    <Textarea placeholder="A lovely caption for this memory..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Upload File</FormLabel>
                        <FormControl>
                            <Input type="file" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="ghost">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save Memory</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
