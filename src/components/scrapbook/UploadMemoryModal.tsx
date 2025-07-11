
"use client";

import { useState, useRef } from "react";
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
import { Loader2, Plus, Sparkles, UploadCloud, Heart, FileVideo, FileAudio, Image as ImageIcon } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import Image from "next/image";

const memorySchema = z.object({
  description: z
    .string()
    .min(10, "Please provide a more detailed description."),
  keywords: z.string().optional(),
  caption: z.string().optional(),
});

type MemoryFormValues = z.infer<typeof memorySchema>;
type MediaType = 'image' | 'video' | 'audio' | null;

export function UploadMemoryModal() {
  const [open, setOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [caption, setCaption] = useState("");
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<MediaType>(null);


  const form = useForm<MemoryFormValues>({
    resolver: zodResolver(memorySchema),
    defaultValues: {
      description: "",
      keywords: "",
      caption: "",
    },
  });
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const fileType = file.type.split('/')[0] as MediaType;
      setMediaType(fileType);

      if (fileType === 'image') {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    }
  };


  const handleGenerateCaption = async () => {
    const { description, keywords } = form.getValues();
    if (!description) {
      form.setError("description", {
        type: "manual",
        message: "Description is needed to generate a caption.",
      });
      return;
    }
    if (!mediaType) {
        toast({
            variant: "destructive",
            title: "No file selected",
            description: "Please upload a media file first.",
        });
        return;
    }

    setIsGenerating(true);
    try {
      const result = await generateScrapbookCaption({
        description,
        keywords: keywords || "",
        mediaType: mediaType,
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
    if (!selectedFile) {
        toast({
            variant: "destructive",
            title: "No file selected",
            description: "Please upload a file to save your memory.",
        });
        return;
    }
    console.log("New memory submitted:", { ...data, caption, file: selectedFile.name });
    toast({
      title: "Memory Saved!",
      description: "Your new memory has been added to the scrapbook.",
    });
    form.reset();
    setCaption("");
    setSelectedFile(null);
    setPreviewUrl(null);
    setMediaType(null);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Memory
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
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
        <ScrollArea className="h-[60vh]">
          <div className="pr-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 py-4"
              >
                <div 
                    onClick={handleUploadClick}
                    className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*,video/*,audio/*"
                  />
                  {previewUrl && mediaType === 'image' ? (
                      <Image src={previewUrl} alt="Preview" width={200} height={200} className="max-h-48 w-auto rounded-md object-contain" />
                  ) : selectedFile ? (
                      <div className="flex flex-col items-center text-center">
                          {mediaType === 'video' && <FileVideo className="h-10 w-10 text-muted-foreground mb-2" />}
                          {mediaType === 'audio' && <FileAudio className="h-10 w-10 text-muted-foreground mb-2" />}
                          <p className="font-semibold">{selectedFile.name}</p>
                          <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                      </div>
                  ) : (
                    <>
                      <UploadCloud className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="font-semibold">Click to upload photo, audio, or video</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG, MP3, MP4</p>
                    </>
                  )}
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
                    <div className="p-4 bg-primary/10 rounded-md text-sm italic border border-primary/20">
                        <p className="font-medium text-primary not-italic">Generated Caption:</p>
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
                
                <DialogFooter className="pt-4 !mt-6">
                  <DialogClose asChild>
                    <Button type="button" variant="ghost">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit">Save Memory</Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
