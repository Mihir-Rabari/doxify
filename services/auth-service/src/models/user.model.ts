import { Firestore } from '@google-cloud/firestore';

export interface IUser {
  id?: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

class UserRepository {
  private db: Firestore;
  private collectionName = 'users';

  constructor(db: Firestore) {
    this.db = db;
  }

  private collection() {
    return this.db.collection(this.collectionName);
  }

  async create(userData: Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<IUser> {
    const now = new Date();
    const docRef = this.collection().doc();
    const user: IUser = {
      ...userData,
      email: userData.email.toLowerCase().trim(),
      name: userData.name.trim(),
      createdAt: now,
      updatedAt: now,
    };
    
    await docRef.set(user);
    return { ...user, id: docRef.id };
  }

  async findOne(query: Partial<IUser>): Promise<IUser | null> {
    let firestoreQuery = this.collection();
    
    if (query.email) {
      firestoreQuery = firestoreQuery.where('email', '==', query.email.toLowerCase()) as any;
    }
    if (query.id) {
      const doc = await this.collection().doc(query.id).get();
      if (!doc.exists) return null;
      return { ...(doc.data() as IUser), id: doc.id };
    }

    const snapshot = await firestoreQuery.limit(1).get();
    if (snapshot.empty) return null;
    
    const doc = snapshot.docs[0];
    return { ...(doc.data() as IUser), id: doc.id };
  }

  async findById(id: string): Promise<IUser | null> {
    const doc = await this.collection().doc(id).get();
    if (!doc.exists) return null;
    return { ...(doc.data() as IUser), id: doc.id };
  }

  async update(id: string, updates: Partial<IUser>): Promise<IUser | null> {
    const docRef = this.collection().doc(id);
    const now = new Date();
    
    await docRef.update({
      ...updates,
      updatedAt: now,
    });
    
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.collection().doc(id).delete();
  }
}

let userRepository: UserRepository | null = null;

export const initUserRepository = (db: Firestore) => {
  userRepository = new UserRepository(db);
};

export const getUserRepository = (): UserRepository => {
  if (!userRepository) {
    throw new Error('UserRepository not initialized');
  }
  return userRepository;
};

export default getUserRepository;
