
'use server';

import clientPromise from "@/lib/mongodb";
import { Db, Collection } from "mongodb";
import slugify from 'slugify';

let client;
let db: Db;
let blogCollection: Collection;

async function init() {
  if (db) return;
  try {
    client = await clientPromise;
    db = client.db();
    blogCollection = db.collection('blog_content');
  } catch (error) {
    throw new Error('Failed to connect to the database for blog.');
  }
}

(async () => {
  await init();
})();

export type BlogPost = {
    _id?: string;
    title: string;
    content: string;
    author: string;
    imageUrl: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
}

export const createBlogPost = async (postData: Omit<BlogPost, 'slug' | 'createdAt' | 'updatedAt'>): Promise<BlogPost> => {
    if (!db) await init();

    const newPost: BlogPost = {
        ...postData,
        slug: slugify(postData.title, { lower: true, strict: true }),
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const result = await blogCollection.insertOne(newPost);
    return { ...newPost, _id: result.insertedId.toString() };
};

export const getAllBlogPosts = async (): Promise<BlogPost[]> => {
    if (!db) await init();
    const posts = await blogCollection.find({}).sort({ createdAt: -1 }).toArray();
    return posts.map(post => ({ ...post, _id: post._id.toString() })) as BlogPost[];
};

export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
    if (!db) await init();
    const post = await blogCollection.findOne({ slug });
    if (!post) return null;
    return { ...post, _id: post._id.toString() } as BlogPost;
};
