import { careArticles } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ArticlePage({ params }: { params: { articleId: string } }) {
  const article = careArticles.find(
    (a) => a.id.toString() === params.articleId
  );

  if (!article) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold">Article not found</h1>
        <p className="text-muted-foreground mt-2">
          The article you are looking for does not exist.
        </p>
        <Button asChild className="mt-6">
          <Link href="/parent/care">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Care Resources
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button asChild variant="outline" size="sm">
          <Link href="/parent/care">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Articles
          </Link>
        </Button>
      </div>
      <Card className="overflow-hidden">
        <CardHeader className="p-0 border-b">
           <Image
            src={article.imageUrl}
            alt={article.title}
            width={1200}
            height={600}
            className="w-full object-cover aspect-video"
          />
        </CardHeader>
        <CardContent className="p-8">
          <CardTitle className="text-4xl font-bold font-headline mb-2">
            {article.title}
          </CardTitle>
          <p className="text-muted-foreground mb-6">By {article.author}</p>
          <div className="prose prose-lg max-w-none text-foreground/90">
            <p>{article.description}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
