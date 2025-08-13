
import clientPromise from "@/lib/mongodb";
import { Db, Collection, ObjectId } from "mongodb";

let client;
let db: Db;
let documentsCollection: Collection;


async function init() {
  if (db) return;
  try {
    client = await clientPromise;
    db = client.db();
    documentsCollection = db.collection('documents');
  } catch (error) {
    throw new Error('Failed to connect to the database for documents.');
  }
}

(async () => {
  await init();
})();

const initialDocuments = [
    {
        docId: "hospital_reg_cert",
        name: "Hospital Registration Certificate",
        description: "Official registration document of the hospital.",
        status: 'Pending',
    },
    {
        docId: "owner_pan",
        name: "Owner's PAN Card",
        description: "Identity and tax information for the owner.",
        status: 'Pending',
    },
    {
        docId: "bank_details",
        name: "Bank Account Details",
        description: "Cancelled cheque or bank statement for payouts.",
        status: 'Pending',
    }
];

export const initializeHospitalDocuments = async (hospitalId: string) => {
    if (!db) await init();
    
    const documentStatus = initialDocuments.map(doc => ({ ...doc }));

    const result = await documentsCollection.insertOne({
        hospitalId,
        documents: documentStatus,
        createdAt: new Date(),
    });
    return result;
}


export const getDocumentsByHospitalId = async (hospitalId: string) => {
    if (!db) await init();
    const result = await documentsCollection.findOne({ hospitalId });
    return result ? result.documents : [];
}

export const updateDocumentStatus = async (hospitalId: string, docId: string, newStatus: 'Uploaded' | 'Verified' | 'Rejected') => {
    if (!db) await init();

    const result = await documentsCollection.updateOne(
        { hospitalId: hospitalId, "documents.docId": docId },
        { $set: { "documents.$.status": newStatus, "documents.$.updatedAt": new Date() } }
    );
    return result;
}
