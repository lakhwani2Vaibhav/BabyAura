
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { careArticles as initialCareArticles } from "@/lib/data";
import { Search, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";


const articleSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long."),
  description: z
    .string()
    .min(20, "Article content must be at least 20 characters long."),
});

type ArticleFormValues = z.infer<typeof articleSchema>;

export default function DoctorCarePage() {
  const [articles, setArticles] = useState(initialCareArticles);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredArticles, setFilteredArticles] = useState(articles);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  useEffect(() => {
    const results = articles.filter(
      (article) =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredArticles(results);
  }, [searchTerm, articles]);

  const onSubmit = (data: ArticleFormValues) => {
    const newArticle = {
      id: articles.length + 1,
      title: data.title,
      description: data.description,
      author: "Dr. Emily Carter", // Assuming the logged-in doctor
      imageUrl: "https://placehold.co/600x400.png",
    };
    setArticles([newArticle, ...articles]);
    toast({
      title: "Article Published!",
      description: "Your new article is now live for parents to see.",
    });
    form.reset();
    setOpen(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Manage Care Content</h1>
          <p className="text-muted-foreground">
            Create, edit, and manage expert articles for parents.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create Article
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create a New Article</DialogTitle>
              <DialogDescription>
                Share your expert knowledge and official resources with parents.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 py-4"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="A catchy title for your article"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write your article here..."
                          {...field}
                          rows={8}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="ghost">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit">Publish Article</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search articles by title, content, or author..."
          className="pl-10 h-12"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredArticles.length > 0 ? (
          filteredArticles.map((article) => (
            <Card key={article.id} className="flex flex-col">
              <CardHeader className="p-0">
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  width={400}
                  height={225}
                  className="rounded-t-lg object-cover aspect-video"
                  data-ai-hint="baby care"
                />
              </CardHeader>
              <CardContent className="flex-1 pt-6">
                <p className="text-xs text-muted-foreground">
                  By {article.author}
                </p>
                <CardTitle className="text-lg font-semibold leading-snug mt-1">
                  {article.title}
                </CardTitle>
                <CardDescription className="mt-2 line-clamp-3">
                  {article.description}
                </CardDescription>
              </CardContent>
              <CardFooter>
                 <Button variant="outline" size="sm" asChild>
                    <Link href={`/parent/care/${article.id}`}>Read Article</Link>
                 </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center text-muted-foreground py-10">
            <p>No articles found for "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
