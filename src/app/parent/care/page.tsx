
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
import { ArrowRight, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CarePage() {
  const [articles, setArticles] = useState(initialCareArticles);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredArticles, setFilteredArticles] = useState(articles);

  useEffect(() => {
    const results = articles.filter(
      (article) =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredArticles(results);
  }, [searchTerm, articles]);


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Care Resources</h1>
        <p className="text-muted-foreground">
          Expert articles and resources for your baby's care.
        </p>
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
                <Link
                  href={`/parent/care/${article.id}`}
                  className="flex items-center text-sm font-medium text-primary hover:underline"
                >
                  Read More <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
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
