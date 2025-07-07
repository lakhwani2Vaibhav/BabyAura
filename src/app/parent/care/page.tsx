import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { careArticles } from "@/lib/data";
import { ArrowRight, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CarePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Care Resources</h1>
        <p className="text-muted-foreground">
          Find articles and resources for baby care.
        </p>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search articles on feeding, sleeping, etc."
          className="pl-10 h-12"
        />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {careArticles.map((article) => (
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
              <CardTitle className="text-lg font-semibold leading-snug">
                {article.title}
              </CardTitle>
              <CardDescription className="mt-2 line-clamp-3">
                {article.description}
              </CardDescription>
            </CardContent>
            <CardFooter>
              <Link
                href="#"
                className="flex items-center text-sm font-medium text-primary hover:underline"
              >
                Read More <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
