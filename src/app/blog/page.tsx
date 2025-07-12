"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { blogPosts as initialBlogPosts } from "@/lib/data";
import { ArrowRight, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { Footer } from "@/components/layout/Footer";
import { format, parseISO } from "date-fns";

export default function BlogIndexPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPosts = useMemo(() => {
    return initialBlogPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="flex flex-col min-h-screen">
        <MarketingHeader />
        <main className="flex-1 py-12 md:py-16 lg:py-20">
            <div className="container px-4 md:px-6">
                 <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold font-headline">The BabyAura Blog</h1>
                    <p className="max-w-2xl mx-auto mt-4 text-muted-foreground md:text-xl">
                        Insights and advice from our team of experts on your parenting journey.
                    </p>
                </div>
                <div className="relative mb-8 max-w-lg mx-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                    placeholder="Search blog posts..."
                    className="pl-12 h-12 text-base"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                 <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
                        <Card key={post.id} className="flex flex-col overflow-hidden group">
                        <CardHeader className="p-0">
                            <Link href={`/blog/${post.slug}`} className="block">
                                <Image
                                    src={post.imageUrl}
                                    alt={post.title}
                                    width={400}
                                    height={225}
                                    className="rounded-t-lg object-cover aspect-video transition-transform duration-300 group-hover:scale-105"
                                    data-ai-hint="blog topic"
                                />
                            </Link>
                        </CardHeader>
                        <CardContent className="flex-1 pt-6">
                            <CardTitle className="text-xl font-semibold leading-snug mt-1">
                                <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">{post.title}</Link>
                            </CardTitle>
                            <CardDescription className="mt-2 line-clamp-3">
                                {post.content.substring(0, 120)}...
                            </CardDescription>
                        </CardContent>
                        <CardFooter className="flex justify-between items-center">
                            <div className="text-xs text-muted-foreground">
                                By {post.author} on {format(parseISO(post.date), "MMM d, yyyy")}
                            </div>
                            <Link
                                href={`/blog/${post.slug}`}
                                className="flex items-center text-sm font-medium text-primary hover:underline"
                            >
                                Read More <ArrowRight className="ml-1 h-4 w-4" />
                            </Link>
                        </CardFooter>
                        </Card>
                    ))
                    ) : (
                    <div className="col-span-full text-center text-muted-foreground py-16">
                        <p className="text-lg">No posts found for "{searchTerm}"</p>
                        <p>Try searching for something else.</p>
                    </div>
                    )}
                </div>
            </div>
        </main>
        <Footer />
    </div>
  );
}