
'use server';

import clientPromise from "@/lib/mongodb";
import { Db, Collection, ObjectId } from "mongodb";

let client;
let db: Db;
let notificationsCollection: Collection;

async function init() {
  if (db) return;
  try {
    client = await clientPromise;
    db = client.db();
    notificationsCollection = db.collection('notifications');
  } catch (error) {
    throw new Error('Failed to connect to the database for notifications.');
  }
}

(async () => {
  await init();
})();

export type Notification = {
    _id?: ObjectId;
    userId: string; // The ID of the user who should receive the notification
    title: string;
    description: string;
    href?: string;
    read: boolean;
    createdAt: Date;
}

export const createNotification = async (notificationData: Omit<Notification, 'read' | 'createdAt' | '_id'>): Promise<Notification> => {
    if (!db) await init();
    
    const newNotification: Notification = {
        ...notificationData,
        read: false,
        createdAt: new Date(),
    };
    
    const result = await notificationsCollection.insertOne(newNotification);
    
    return { ...newNotification, _id: result.insertedId };
}

export const getNotificationsForUser = async (userId: string) => {
    if (!db) await init();
    const notifications = await notificationsCollection.find({ userId }).sort({ createdAt: -1 }).limit(20).toArray();
    return notifications.map(n => ({...n, _id: n._id.toString()}));
}

export const markNotificationsAsRead = async (userId: string) => {
    if (!db) await init();
    return await notificationsCollection.updateMany({ userId, read: false }, { $set: { read: true } });
}
