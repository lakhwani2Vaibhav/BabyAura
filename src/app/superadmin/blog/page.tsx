
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, BookText, ImageUp } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const blogPostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters."),
  author: z.string().min(3, "Author name is required."),
  content: z.string().min(50, "Content must be at least 50 characters."),
  image: z.custom<FileList>().refine(files => files?.length > 0, "An image is required."),
});

type BlogPostFormValues = z.infer<typeof blogPostSchema>;

export default function BlogManagementPage() {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: "",
      author: "",
      content: "",
    },
  });

  const onSubmit = async (data: BlogPostFormValues) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('author', data.author);
    formData.append('content', data.content);
    formData.append('image', data.image[0]);

    try {
      const token = localStorage.getItem('babyaura_token');
      const response = await fetch('/api/superadmin/blog', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      toast({
        title: "Blog Post Published!",
        description: "The new post is now live.",
      });
      form.reset({ title: "", author: "", content: "", image: undefined });
      setImagePreview(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not publish the post. Please try again.",
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-headline">
            <BookText className="h-6 w-6" /> Create New Blog Post
          </CardTitle>
          <CardDescription>
            Fill out the form below to publish a new article to the BabyAura blog.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Post Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Navigating the Fourth Trimester" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Dr. Emily Carter" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Write your blog post content here..." {...field} rows={10} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field: { onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Featured Image</FormLabel>
                    <FormControl>
                        <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg">
                           <ImageUp className="h-10 w-10 text-muted-foreground mb-2" />
                            <Input 
                                type="file" 
                                accept="image/*"
                                {...fieldProps}
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if(file) {
                                        onChange(e.target.files);
                                        setImagePreview(URL.createObjectURL(file));
                                    }
                                }}
                                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                            />
                            {imagePreview && <img src={imagePreview} alt="Preview" className="mt-4 max-h-48 rounded-md" />}
                        </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Publishing...
                  </>
                ) : (
                  "Publish Post"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
