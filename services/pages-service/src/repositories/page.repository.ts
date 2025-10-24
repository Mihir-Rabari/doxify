import { Firestore, FieldValue } from '@google-cloud/firestore';

export interface IPageMetadata {
  sidebarPosition: number;
  tags: string[];
  description?: string;
  author?: string;
}

export interface IBlock {
  type: string;
  content: string;
  lang?: string;
  variant?: string;
  meta?: Record<string, any>;
}

export interface IPage {
  id?: string;
  projectId: string;
  title: string;
  slug: string;
  content: string;
  blocks: IBlock[];
  section: string;
  order: number;
  metadata: IPageMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export class PageRepository {
  private db: Firestore;
  private collectionName = 'pages';

  constructor(db: Firestore) {
    this.db = db;
  }

  private collection() {
    return this.db.collection(this.collectionName);
  }

  async create(pageData: Omit<IPage, 'id' | 'createdAt' | 'updatedAt'>): Promise<IPage> {
    const now = new Date();
    const docRef = this.collection().doc();
    
    const page: IPage = {
      ...pageData,
      title: pageData.title.trim(),
      slug: pageData.slug.trim(),
      section: pageData.section?.trim() || 'General',
      content: pageData.content || '',
      blocks: pageData.blocks || [],
      order: pageData.order || 0,
      metadata: pageData.metadata || { sidebarPosition: 0, tags: [] },
      createdAt: now,
      updatedAt: now,
    };
    
    await docRef.set(page);
    return { ...page, id: docRef.id };
  }

  async findById(id: string): Promise<IPage | null> {
    const doc = await this.collection().doc(id).get();
    if (!doc.exists) return null;
    return { ...(doc.data() as IPage), id: doc.id };
  }

  async findByProjectId(projectId: string): Promise<IPage[]> {
    const snapshot = await this.collection()
      .where('projectId', '==', projectId)
      .orderBy('section', 'asc')
      .orderBy('order', 'asc')
      .get();
    
    return snapshot.docs.map(doc => ({ ...(doc.data() as IPage), id: doc.id }));
  }

  async findByProjectIdAndSlug(projectId: string, slug: string): Promise<IPage | null> {
    const snapshot = await this.collection()
      .where('projectId', '==', projectId)
      .where('slug', '==', slug.trim())
      .limit(1)
      .get();
    
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { ...(doc.data() as IPage), id: doc.id };
  }

  async findByProjectIdAndSection(projectId: string, section: string): Promise<IPage[]> {
    const snapshot = await this.collection()
      .where('projectId', '==', projectId)
      .where('section', '==', section)
      .orderBy('order', 'asc')
      .get();
    
    return snapshot.docs.map(doc => ({ ...(doc.data() as IPage), id: doc.id }));
  }

  async update(id: string, updates: Partial<IPage>): Promise<IPage | null> {
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

  async deleteByProjectId(projectId: string): Promise<void> {
    const snapshot = await this.collection()
      .where('projectId', '==', projectId)
      .get();
    
    const batch = this.db.batch();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
  }

  // Simple text search (Firestore doesn't have full-text search like MongoDB)
  // For production, consider using Algolia or Elasticsearch
  async search(projectId: string, query: string): Promise<IPage[]> {
    const pages = await this.findByProjectId(projectId);
    const lowerQuery = query.toLowerCase();
    
    return pages.filter(page => 
      page.title.toLowerCase().includes(lowerQuery) ||
      page.content.toLowerCase().includes(lowerQuery) ||
      page.section.toLowerCase().includes(lowerQuery)
    ).sort((a, b) => {
      // Prioritize title matches
      const aTitle = a.title.toLowerCase().includes(lowerQuery);
      const bTitle = b.title.toLowerCase().includes(lowerQuery);
      if (aTitle && !bTitle) return -1;
      if (!aTitle && bTitle) return 1;
      return 0;
    });
  }
}

let pageRepository: PageRepository | null = null;

export const initPageRepository = (db: Firestore) => {
  pageRepository = new PageRepository(db);
};

export const getPageRepository = (): PageRepository => {
  if (!pageRepository) {
    throw new Error('PageRepository not initialized');
  }
  return pageRepository;
};
