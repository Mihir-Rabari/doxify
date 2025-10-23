import { MCPToolResponse } from '../types/mcp.types';
import apiService from '../services/api.service';

export const toolHandlers: Record<string, (args: any) => Promise<MCPToolResponse>> = {
  // Project Management Handlers
  async create_project(args) {
    try {
      const { name, slug, description, userId } = args;
      const project = await apiService.createProject({
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        description,
        userId,
      });

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: true,
            message: 'Project created successfully',
            project,
          }, null, 2),
        }],
      };
    } catch (error: any) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: error.message || 'Failed to create project',
          }, null, 2),
        }],
        isError: true,
      };
    }
  },

  async list_projects(args) {
    try {
      const { userId } = args;
      const projects = await apiService.listProjects(userId);

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: true,
            count: projects.length,
            projects,
          }, null, 2),
        }],
      };
    } catch (error: any) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: error.message || 'Failed to list projects',
          }, null, 2),
        }],
        isError: true,
      };
    }
  },

  async get_project(args) {
    try {
      const { projectId } = args;
      const project = await apiService.getProject(projectId);

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: true,
            project,
          }, null, 2),
        }],
      };
    } catch (error: any) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: error.message || 'Failed to get project',
          }, null, 2),
        }],
        isError: true,
      };
    }
  },

  async update_project(args) {
    try {
      const { projectId, ...updates } = args;
      const project = await apiService.updateProject(projectId, updates);

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: true,
            message: 'Project updated successfully',
            project,
          }, null, 2),
        }],
      };
    } catch (error: any) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: error.message || 'Failed to update project',
          }, null, 2),
        }],
        isError: true,
      };
    }
  },

  async delete_project(args) {
    try {
      const { projectId } = args;
      await apiService.deleteProject(projectId);

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: true,
            message: 'Project deleted successfully',
          }, null, 2),
        }],
      };
    } catch (error: any) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: error.message || 'Failed to delete project',
          }, null, 2),
        }],
        isError: true,
      };
    }
  },

  // Page Management Handlers
  async create_page(args) {
    try {
      const { projectId, title, slug, content, sectionId } = args;
      const page = await apiService.createPage({
        projectId,
        title,
        slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
        content,
        sectionId,
      });

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: true,
            message: 'Page created successfully',
            page,
          }, null, 2),
        }],
      };
    } catch (error: any) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: error.message || 'Failed to create page',
          }, null, 2),
        }],
        isError: true,
      };
    }
  },

  async list_pages(args) {
    try {
      const { projectId } = args;
      const pages = await apiService.listPages(projectId);

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: true,
            count: pages.length,
            pages,
          }, null, 2),
        }],
      };
    } catch (error: any) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: error.message || 'Failed to list pages',
          }, null, 2),
        }],
        isError: true,
      };
    }
  },

  async get_page(args) {
    try {
      const { pageId } = args;
      const page = await apiService.getPage(pageId);

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: true,
            page,
          }, null, 2),
        }],
      };
    } catch (error: any) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: error.message || 'Failed to get page',
          }, null, 2),
        }],
        isError: true,
      };
    }
  },

  async update_page(args) {
    try {
      const { pageId, ...updates } = args;
      const page = await apiService.updatePage(pageId, updates);

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: true,
            message: 'Page updated successfully',
            page,
          }, null, 2),
        }],
      };
    } catch (error: any) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: error.message || 'Failed to update page',
          }, null, 2),
        }],
        isError: true,
      };
    }
  },

  async delete_page(args) {
    try {
      const { pageId } = args;
      await apiService.deletePage(pageId);

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: true,
            message: 'Page deleted successfully',
          }, null, 2),
        }],
      };
    } catch (error: any) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: error.message || 'Failed to delete page',
          }, null, 2),
        }],
        isError: true,
      };
    }
  },

  // Section Management Handlers
  async create_section(args) {
    try {
      const { projectId, name, order } = args;
      const section = await apiService.createSection({
        projectId,
        name,
        order: order || 0,
      });

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: true,
            message: 'Section created successfully',
            section,
          }, null, 2),
        }],
      };
    } catch (error: any) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: error.message || 'Failed to create section',
          }, null, 2),
        }],
        isError: true,
      };
    }
  },

  async list_sections(args) {
    try {
      const { projectId } = args;
      const sections = await apiService.listSections(projectId);

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: true,
            count: sections.length,
            sections,
          }, null, 2),
        }],
      };
    } catch (error: any) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: error.message || 'Failed to list sections',
          }, null, 2),
        }],
        isError: true,
      };
    }
  },

  // Search Handler
  async search_documentation(args) {
    try {
      const { projectId, query, limit = 10 } = args;
      const results = await apiService.searchPages(projectId, query, limit);

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: true,
            query,
            count: results.count || 0,
            results: results.results || results,
          }, null, 2),
        }],
      };
    } catch (error: any) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: error.message || 'Failed to search documentation',
          }, null, 2),
        }],
        isError: true,
      };
    }
  },

  // Publishing Handlers
  async publish_project(args) {
    try {
      const { projectId, seoTitle, seoDescription } = args;
      const project = await apiService.publishProject(projectId, {
        seoTitle,
        seoDescription,
      });

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: true,
            message: 'Project published successfully',
            publicUrl: project.publicUrl || `${process.env.PUBLIC_URL}/sites/${project.slug}`,
            project,
          }, null, 2),
        }],
      };
    } catch (error: any) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: error.message || 'Failed to publish project',
          }, null, 2),
        }],
        isError: true,
      };
    }
  },

  async unpublish_project(args) {
    try {
      const { projectId } = args;
      await apiService.unpublishProject(projectId);

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: true,
            message: 'Project unpublished successfully',
          }, null, 2),
        }],
      };
    } catch (error: any) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: error.message || 'Failed to unpublish project',
          }, null, 2),
        }],
        isError: true,
      };
    }
  },

  // Export Handler
  async export_project(args) {
    try {
      const { projectId, format } = args;
      const exportData = await apiService.exportProject(projectId, format);

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: true,
            message: `Project exported as ${format}`,
            format,
            data: exportData,
          }, null, 2),
        }],
      };
    } catch (error: any) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: error.message || 'Failed to export project',
          }, null, 2),
        }],
        isError: true,
      };
    }
  },

  // Navigation Handler
  async get_navigation(args) {
    try {
      const { projectId } = args;
      const navigation = await apiService.getNavigation(projectId);

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: true,
            navigation,
          }, null, 2),
        }],
      };
    } catch (error: any) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: error.message || 'Failed to get navigation',
          }, null, 2),
        }],
        isError: true,
      };
    }
  },
};
