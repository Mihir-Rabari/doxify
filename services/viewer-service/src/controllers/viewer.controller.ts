import { Request, Response } from 'express';
import { Firestore } from '@google-cloud/firestore';
import { IProject } from '../models/project.model';
import { IPage } from '../models/page.model';

const db = new Firestore();
const projectsCollection = db.collection('projects');
const pagesCollection = db.collection('pages');

// Get published project by slug
export const getPublishedProject = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const snapshot = await projectsCollection
      .where('slug', '==', slug)
      .where('publishSettings.isPublished', '==', true)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ 
        error: 'Project not found or not published',
        slug 
      });
    }

    const projectDoc = snapshot.docs[0];
    const project = projectDoc.data() as IProject;

    res.json({
      success: true,
      project: {
        id: projectDoc.id,
        name: project.name,
        slug: project.slug,
        description: project.description,
        theme: project.theme,
        publishSettings: {
          seoTitle: project.publishSettings?.seoTitle,
          seoDescription: project.publishSettings?.seoDescription,
          favicon: project.publishSettings?.favicon,
          analytics: project.publishSettings?.analytics,
        },
        publishedAt: project.publishSettings?.publishedAt,
      }
    });
  } catch (error) {
    console.error('Get published project error:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
};

// Get all pages for a published project
export const getPublishedPages = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    // First verify project is published
    const projectSnapshot = await projectsCollection
      .where('slug', '==', slug)
      .where('publishSettings.isPublished', '==', true)
      .limit(1)
      .get();

    if (projectSnapshot.empty) {
      return res.status(404).json({ 
        error: 'Project not found or not published' 
      });
    }

    const projectId = projectSnapshot.docs[0].id;

    // Get all pages for this project
    const pagesSnapshot = await pagesCollection
      .where('projectId', '==', projectId)
      .orderBy('section', 'asc')
      .orderBy('order', 'asc')
      .get();

    const pages = pagesSnapshot.docs.map((doc: any) => {
      const data = doc.data() as IPage;
      return {
        id: doc.id,
        title: data.title,
        slug: data.slug,
        content: data.content,
        section: data.section,
        order: data.order
      };
    });

    // Group pages by section
    const sections = pages.reduce((acc: any, page) => {
      const section = page.section || 'General';
      if (!acc[section]) {
        acc[section] = [];
      }
      acc[section].push(page);
      return acc;
    }, {});

    res.json({
      success: true,
      projectSlug: slug,
      pages,
      sections,
      totalPages: pages.length
    });
  } catch (error) {
    console.error('Get published pages error:', error);
    res.status(500).json({ error: 'Failed to fetch pages' });
  }
};

// Get a single page from a published project
export const getPublishedPage = async (req: Request, res: Response) => {
  try {
    const { slug, pageSlug } = req.params;

    // First verify project is published
    const projectSnapshot = await projectsCollection
      .where('slug', '==', slug)
      .where('publishSettings.isPublished', '==', true)
      .limit(1)
      .get();

    if (projectSnapshot.empty) {
      return res.status(404).json({ 
        error: 'Project not found or not published' 
      });
    }

    const projectId = projectSnapshot.docs[0].id;

    // Get the specific page (try different slug variations)
    const slugVariations = [
      pageSlug,
      `/${pageSlug}`,
      pageSlug.startsWith('/') ? pageSlug.slice(1) : `/${pageSlug}`
    ];

    let page: any = null;
    for (const slugVar of slugVariations) {
      const pageSnapshot = await pagesCollection
        .where('projectId', '==', projectId)
        .where('slug', '==', slugVar)
        .limit(1)
        .get();
      
      if (!pageSnapshot.empty) {
        const doc = pageSnapshot.docs[0];
        const data = doc.data() as IPage;
        page = {
          id: doc.id,
          title: data.title,
          slug: data.slug,
          content: data.content,
          section: data.section,
          order: data.order
        };
        break;
      }
    }

    if (!page) {
      return res.status(404).json({ 
        error: 'Page not found',
        pageSlug 
      });
    }

    res.json({
      success: true,
      projectSlug: slug,
      page
    });
  } catch (error) {
    console.error('Get published page error:', error);
    res.status(500).json({ error: 'Failed to fetch page' });
  }
};

// Get navigation structure for a published project
export const getPublishedNavigation = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    // Verify project is published
    const projectSnapshot = await projectsCollection
      .where('slug', '==', slug)
      .where('publishSettings.isPublished', '==', true)
      .limit(1)
      .get();

    if (projectSnapshot.empty) {
      return res.status(404).json({ 
        error: 'Project not found or not published' 
      });
    }

    const projectId = projectSnapshot.docs[0].id;

    // Get pages with minimal data for navigation
    const pagesSnapshot = await pagesCollection
      .where('projectId', '==', projectId)
      .orderBy('section', 'asc')
      .orderBy('order', 'asc')
      .get();

    const pages = pagesSnapshot.docs.map((doc: any) => {
      const data = doc.data() as IPage;
      return {
        title: data.title,
        slug: data.slug,
        section: data.section,
        order: data.order
      };
    });

    // Group by section
    const sections = pages.reduce((acc: any, page) => {
      const section = page.section || 'General';
      if (!acc[section]) {
        acc[section] = [];
      }
      acc[section].push({
        title: page.title,
        slug: page.slug,
        order: page.order
      });
      return acc;
    }, {});

    res.json({
      success: true,
      projectSlug: slug,
      navigation: sections
    });
  } catch (error) {
    console.error('Get navigation error:', error);
    res.status(500).json({ error: 'Failed to fetch navigation' });
  }
};
