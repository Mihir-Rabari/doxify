import { Firestore, CollectionReference, DocumentData, Timestamp } from '@google-cloud/firestore';

let db: Firestore | null = null;

/**
 * Initialize Firestore connection
 * @param projectId - GCP Project ID (optional, will use application default credentials if not provided)
 */
export const initFirestore = (projectId?: string): Firestore => {
  if (db) {
    return db;
  }

  const config: any = {};
  
  if (projectId) {
    config.projectId = projectId;
  }

  db = new Firestore(config);
  console.log('✅ Firestore initialized');
  return db;
};

/**
 * Get Firestore instance
 */
export const getFirestore = (): Firestore => {
  if (!db) {
    throw new Error('Firestore not initialized. Call initFirestore() first.');
  }
  return db;
};

/**
 * Get a collection reference with type safety
 */
export const collection = <T = DocumentData>(collectionName: string): CollectionReference<T> => {
  return getFirestore().collection(collectionName) as CollectionReference<T>;
};

/**
 * Helper to convert Firestore timestamp to Date
 */
export const timestampToDate = (timestamp: any): Date => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  if (timestamp instanceof Date) {
    return timestamp;
  }
  return new Date(timestamp);
};

/**
 * Helper to add timestamps to documents
 */
export const withTimestamps = <T extends object>(data: T, isUpdate = false): T & { createdAt?: Date; updatedAt: Date } => {
  const now = new Date();
  if (isUpdate) {
    return {
      ...data,
      updatedAt: now,
    };
  }
  return {
    ...data,
    createdAt: now,
    updatedAt: now,
  };
};

/**
 * Generate a unique ID
 */
export const generateId = (): string => {
  return getFirestore().collection('_temp').doc().id;
};

export { Firestore, Timestamp };
