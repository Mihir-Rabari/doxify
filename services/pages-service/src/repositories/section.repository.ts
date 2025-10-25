import { Firestore } from '@google-cloud/firestore';
import { ISection } from '../models/section.model';

export class SectionRepository {
  private db: Firestore;
  private collectionName = 'sections';

  constructor(db: Firestore) {
    this.db = db;
  }

  private collection() {
    return this.db.collection(this.collectionName);
  }

  async create(sectionData: Omit<ISection, 'id' | 'createdAt' | 'updatedAt'>): Promise<ISection> {
    const now = new Date();
    const docRef = this.collection().doc();
    
    const section: ISection = {
      ...sectionData,
      name: sectionData.name.trim(),
      order: sectionData.order || 0,
      createdAt: now,
      updatedAt: now,
    };
    
    await docRef.set(section);
    return { ...section, id: docRef.id };
  }

  async findById(id: string): Promise<ISection | null> {
    const doc = await this.collection().doc(id).get();
    if (!doc.exists) return null;
    return { ...(doc.data() as ISection), id: doc.id };
  }

  async findByProjectId(projectId: string): Promise<ISection[]> {
    const snapshot = await this.collection()
      .where('projectId', '==', projectId)
      .orderBy('order', 'asc')
      .get();
    
    return snapshot.docs.map(doc => ({ ...(doc.data() as ISection), id: doc.id }));
  }

  async findByProjectIdAndName(projectId: string, name: string): Promise<ISection | null> {
    const snapshot = await this.collection()
      .where('projectId', '==', projectId)
      .where('name', '==', name.trim())
      .limit(1)
      .get();
    
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { ...(doc.data() as ISection), id: doc.id };
  }

  async update(id: string, updates: Partial<ISection>): Promise<ISection | null> {
    const docRef = this.collection().doc(id);
    const now = new Date();
    
    await docRef.update({
      ...updates,
      updatedAt: now,
    });
    
    const doc = await docRef.get();
    if (!doc.exists) return null;
    return { ...(doc.data() as ISection), id: doc.id };
  }

  async delete(id: string): Promise<void> {
    await this.collection().doc(id).delete();
  }
}

let sectionRepository: SectionRepository;

export const initSectionRepository = (db: Firestore) => {
  sectionRepository = new SectionRepository(db);
};

export const getSectionRepository = (): SectionRepository => {
  if (!sectionRepository) {
    throw new Error('SectionRepository not initialized');
  }
  return sectionRepository;
};
