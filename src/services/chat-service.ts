
'use server';

import clientPromise from "@/lib/mongodb";
import { Db, Collection, ObjectId } from "mongodb";

let client;
let db: Db;
let messagesCollection: Collection;

async function init() {
  if (db) return;
  try {
    client = await clientPromise;
    db = client.db();
    messagesCollection = db.collection('messages');
  } catch (error) {
    throw new Error('Failed to connect to the database for chat.');
  }
}

(async () => {
  await init();
})();

const generateConversationId = (userId1: string, userId2: string) => {
    // Sort the IDs to ensure the conversationId is always the same regardless of who starts the chat
    const sortedIds = [userId1, userId2].sort();
    return sortedIds.join('-');
};

export type Message = {
    _id?: ObjectId;
    conversationId: string; // A unique ID for the chat between two users, e.g., `parent_id-doctor_id`
    senderId: string;
    receiverId: string;
    senderRole: 'Parent' | 'Doctor' | 'Admin' | 'Nurse';
    content: string;
    read: boolean;
    createdAt: Date;
}

export const createMessage = async (message: Omit<Message, 'read' | 'createdAt' | '_id' | 'conversationId'> & { senderId: string, receiverId: string }): Promise<Message> => {
    if (!db) await init();
    
    const newMessage: Message = {
        ...message,
        conversationId: generateConversationId(message.senderId, message.receiverId),
        read: false,
        createdAt: new Date(),
    };
    
    const result = await messagesCollection.insertOne(newMessage);
    
    return { ...newMessage, _id: result.insertedId };
}

export const getMessagesForConversation = async (userId1: string, userId2: string) => {
    if (!db) await init();
    const conversationId = generateConversationId(userId1, userId2);
    return await messagesCollection.find({ conversationId }).sort({ createdAt: 1 }).toArray();
}
