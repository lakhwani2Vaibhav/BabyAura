import { blogPosts } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { Footer } from "@/components/layout/Footer";
import { notFound } from "next/navigation";
import { format, parseISO } from "date-fns";

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find(
    (p) => p.slug === params.slug
  );

  if (!post) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
        <MarketingHeader />
        <main className="flex-1 py-12 md:py-16 lg:py-20">
            <div className="container px-4 md:px-6 max-w-4xl mx-auto">
                <div className="mb-8">
                    <Button asChild variant="outline" size="sm">
                    <Link href="/blog">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Blog
                    </Link>
                    </Button>
                </div>
                <Card className="overflow-hidden">
                    <CardHeader className="p-0 border-b">
                    <Image
                        src={post.imageUrl}
                        alt={post.title}
                        width={1200}
                        height={600}
                        className="w-full object-cover aspect-video"
                        data-ai-hint="blog topic"
                    />
                    </CardHeader>
                    <CardContent className="p-6 md:p-8">
                    <h1 className="text-3xl md:text-4xl font-bold font-headline mb-4">
                        {post.title}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                        <span>By {post.author}</span>
                        <span>•</span>
                        <span>{format(parseISO(post.date), "MMMM d, yyyy")}</span>
                    </div>
                    <div className="prose prose-lg max-w-none dark:prose-invert text-foreground/90">
                        {post.content.split('\n\n').map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                        ))}
                    </div>
                    </CardContent>
                </Card>
            </div>
        </main>
        <Footer />
    </div>
  );
}