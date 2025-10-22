import { Request, Response } from 'express';
import Page from '../models/page.model';

// Search pages using MongoDB text search
export const searchPages = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { q, limit = 20, section } = req.query;

    if (!q || typeof q !== 'string' || q.trim().length === 0) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    // Build search query
    const searchQuery: any = {
      projectId,
      $text: { $search: q.trim() }
    };

    // Optional: filter by section
    if (section && typeof section === 'string') {
      searchQuery.section = section;
    }

    // Execute text search with score projection
    const results = await Page.find(
      searchQuery,
      {
        score: { $meta: 'textScore' }
      }
    )
    .sort({ score: { $meta: 'textScore' } }) // Sort by relevance score
    .limit(parseInt(limit as string, 10))
    .select('title slug content section order createdAt updatedAt')
    .lean()
    .exec();

    // Add search highlights/snippets for matched content
    const enhancedResults = results.map((page: any) => {
      const searchTerm = q.toLowerCase();
      let preview = '';
      let matchedIn = 'title';

      // Check if query matches in title
      if (page.title.toLowerCase().includes(searchTerm)) {
        matchedIn = 'title';
      } 
      // Otherwise, extract content snippet
      else if (page.content) {
        const contentLower = page.content.toLowerCase();
        const index = contentLower.indexOf(searchTerm);
        
        if (index !== -1) {
          matchedIn = 'content';
          const start = Math.max(0, index - 50);
          const end = Math.min(page.content.length, index + searchTerm.length + 100);
          
          // Strip HTML tags for preview
          const snippet = page.content.substring(start, end).replace(/<[^>]*>/g, ' ').trim();
          preview = (start > 0 ? '...' : '') + snippet + (end < page.content.length ? '...' : '');
        }
      }

      return {
        _id: page._id,
        title: page.title,
        slug: page.slug,
        section: page.section,
        score: page.score,
        matchedIn,
        preview: preview || page.content?.substring(0, 150).replace(/<[^>]*>/g, ' ').trim(),
        createdAt: page.createdAt,
        updatedAt: page.updatedAt
      };
    });

    res.json({
      query: q,
      count: enhancedResults.length,
      results: enhancedResults
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to search pages' });
  }
};

// Get search suggestions (autocomplete)
export const getSearchSuggestions = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { q, limit = 5 } = req.query;

    if (!q || typeof q !== 'string' || q.trim().length < 2) {
      return res.json({ suggestions: [] });
    }

    // Use regex for prefix matching on title (faster for autocomplete)
    const suggestions = await Page.find({
      projectId,
      title: { $regex: `^${q}`, $options: 'i' }
    })
    .sort({ order: 1, createdAt: -1 })
    .limit(parseInt(limit as string, 10))
    .select('title slug section')
    .lean()
    .exec();

    res.json({ suggestions });
  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({ error: 'Failed to get suggestions' });
  }
};

// Get recent pages (for search UI)
export const getRecentPages = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { limit = 10 } = req.query;

    const recentPages = await Page.find({ projectId })
      .sort({ updatedAt: -1 })
      .limit(parseInt(limit as string, 10))
      .select('title slug section updatedAt')
      .lean()
      .exec();

    res.json({ pages: recentPages });
  } catch (error) {
    console.error('Recent pages error:', error);
    res.status(500).json({ error: 'Failed to get recent pages' });
  }
};
