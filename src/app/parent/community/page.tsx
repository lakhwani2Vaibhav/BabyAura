"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { communityPosts as initialPosts } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageSquare, PenSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CommunityPage() {
  const [posts, setPosts] = useState(initialPosts);
  const [newPostContent, setNewPostContent] = useState("");
  const { toast } = useToast();

  const handlePost = () => {
    if (newPostContent.trim() === "") return;

    const newPost = {
      id: Date.now(),
      author: {
        name: "Parent's Name",
        avatarUrl: "https://placehold.co/40x40.png",
      },
      timestamp: "Just now",
      content: newPostContent,
      likes: 0,
      comments: 0,
    };

    setPosts([newPost, ...posts]);
    setNewPostContent("");
    toast({
      title: "Post Published!",
      description: "Your post is now live in the community feed.",
    });
  };

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-start gap-4">
            <Avatar>
              <AvatarImage
                src="https://placehold.co/40x40.png"
                data-ai-hint="woman smiling"
                alt="@parent"
              />
              <AvatarFallback>P</AvatarFallback>
            </Avatar>
            <div className="w-full">
              <Textarea
                placeholder="Share your thoughts or ask a question..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
              />
              <Button className="mt-2" onClick={handlePost}>
                <PenSquare className="mr-2 h-4 w-4" /> Post
              </Button>
            </div>
          </CardHeader>
        </Card>

        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader className="flex flex-row items-start gap-4">
                <Avatar>
                  <AvatarImage src={post.author.avatarUrl} />
                  <AvatarFallback>
                    {post.author.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{post.author.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {post.timestamp}
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <p>{post.content}</p>
              </CardContent>
              <CardFooter className="gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Heart className="h-4 w-4" /> {post.likes}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" /> {post.comments}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Trending Topics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="hover:text-primary cursor-pointer">#SleepTraining</p>
            <p className="hover:text-primary cursor-pointer">
              #FeedingTroubles
            </p>
            <p className="hover:text-primary cursor-pointer">
              #FirstYearMilestones
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
