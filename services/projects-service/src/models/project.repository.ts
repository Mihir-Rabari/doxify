import { Firestore } from '@google-cloud/firestore';
import { IProject, ITheme, IPublishSettings } from './project.model';

export class ProjectRepository {
  private db: Firestore;
  private collectionName = 'projects';

  constructor(db: Firestore) {
    this.db = db;
  }

  private collection() {
    return this.db.collection(this.collectionName);
  }

  async create(projectData: Omit<IProject, 'id' | 'createdAt' | 'updatedAt'>): Promise<IProject> {
    const now = new Date();
    const docRef = this.collection().doc();
    
    const project: IProject = {
      ...projectData,
      name: projectData.name.trim(),
      slug: projectData.slug.toLowerCase().trim(),
      description: projectData.description?.trim(),
      createdAt: now,
      updatedAt: now,
    };
    
    await docRef.set(project);
    return { ...project, id: docRef.id };
  }

  async findById(id: string): Promise<IProject | null> {
    const doc = await this.collection().doc(id).get();
    if (!doc.exists) return null;
    return { ...(doc.data() as IProject), id: doc.id };
  }

  async findBySlug(slug: string): Promise<IProject | null> {
    const snapshot = await this.collection()
      .where('slug', '==', slug.toLowerCase())
      .limit(1)
      .get();
    
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { ...(doc.data() as IProject), id: doc.id };
  }

  async findByUserId(userId: string): Promise<IProject[]> {
    const snapshot = await this.collection()
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();
    
    return snapshot.docs.map(doc => ({ ...(doc.data() as IProject), id: doc.id }));
  }

  async findByUserIdAndSlug(userId: string, slug: string): Promise<IProject | null> {
    const snapshot = await this.collection()
      .where('userId', '==', userId)
      .where('slug', '==', slug.toLowerCase())
      .limit(1)
      .get();
    
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { ...(doc.data() as IProject), id: doc.id };
  }

  async update(id: string, updates: Partial<IProject>): Promise<IProject | null> {
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

  async findPublishedProjects(): Promise<IProject[]> {
    const snapshot = await this.collection()
      .where('publishSettings.isPublished', '==', true)
      .orderBy('publishSettings.publishedAt', 'desc')
      .get();
    
    return snapshot.docs.map(doc => ({ ...(doc.data() as IProject), id: doc.id }));
  }
}

let projectRepository: ProjectRepository | null = null;

export const initProjectRepository = (db: Firestore) => {
  projectRepository = new ProjectRepository(db);
};

export const getProjectRepository = (): ProjectRepository => {
  if (!projectRepository) {
    throw new Error('ProjectRepository not initialized');
  }
  return projectRepository;
};
