import { MCPTool } from '../types/mcp.types';

export const tools: MCPTool[] = [
  // Project Management Tools
  {
    name: 'create_project',
    description: 'Create a new documentation project in Doxify',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'The name of the project',
        },
        slug: {
          type: 'string',
          description: 'URL-friendly slug for the project (auto-generated if not provided)',
        },
        description: {
          type: 'string',
          description: 'Optional description of the project',
        },
        userId: {
          type: 'string',
          description: 'User ID creating the project',
        },
      },
      required: ['name', 'userId'],
    },
  },
  {
    name: 'list_projects',
    description: 'List all documentation projects for a user',
    inputSchema: {
      type: 'object',
      properties: {
        userId: {
          type: 'string',
          description: 'User ID to filter projects',
        },
      },
      required: ['userId'],
    },
  },
  {
    name: 'get_project',
    description: 'Get details of a specific project',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: {
          type: 'string',
          description: 'The ID of the project',
        },
      },
      required: ['projectId'],
    },
  },
  {
    name: 'update_project',
    description: 'Update an existing project',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: {
          type: 'string',
          description: 'The ID of the project to update',
        },
        name: {
          type: 'string',
          description: 'New name for the project',
        },
        description: {
          type: 'string',
          description: 'New description for the project',
        },
      },
      required: ['projectId'],
    },
  },
  {
    name: 'delete_project',
    description: 'Delete a documentation project',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: {
          type: 'string',
          description: 'The ID of the project to delete',
        },
      },
      required: ['projectId'],
    },
  },

  // Page Management Tools
  {
    name: 'create_page',
    description: 'Create a new documentation page in a project',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: {
          type: 'string',
          description: 'The ID of the project',
        },
        title: {
          type: 'string',
          description: 'Title of the page',
        },
        slug: {
          type: 'string',
          description: 'URL-friendly slug for the page',
        },
        content: {
          type: 'string',
          description: 'HTML content of the page',
        },
        sectionId: {
          type: 'string',
          description: 'Optional section ID to organize the page',
        },
      },
      required: ['projectId', 'title', 'content'],
    },
  },
  {
    name: 'list_pages',
    description: 'List all pages in a project',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: {
          type: 'string',
          description: 'The ID of the project',
        },
      },
      required: ['projectId'],
    },
  },
  {
    name: 'get_page',
    description: 'Get details of a specific page',
    inputSchema: {
      type: 'object',
      properties: {
        pageId: {
          type: 'string',
          description: 'The ID of the page',
        },
      },
      required: ['pageId'],
    },
  },
  {
    name: 'update_page',
    description: 'Update an existing page',
    inputSchema: {
      type: 'object',
      properties: {
        pageId: {
          type: 'string',
          description: 'The ID of the page to update',
        },
        title: {
          type: 'string',
          description: 'New title for the page',
        },
        content: {
          type: 'string',
          description: 'New content for the page',
        },
      },
      required: ['pageId'],
    },
  },
  {
    name: 'delete_page',
    description: 'Delete a documentation page',
    inputSchema: {
      type: 'object',
      properties: {
        pageId: {
          type: 'string',
          description: 'The ID of the page to delete',
        },
      },
      required: ['pageId'],
    },
  },

  // Section Management Tools
  {
    name: 'create_section',
    description: 'Create a new section in a project to organize pages',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: {
          type: 'string',
          description: 'The ID of the project',
        },
        name: {
          type: 'string',
          description: 'Name of the section',
        },
        order: {
          type: 'number',
          description: 'Display order of the section',
        },
      },
      required: ['projectId', 'name'],
    },
  },
  {
    name: 'list_sections',
    description: 'List all sections in a project',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: {
          type: 'string',
          description: 'The ID of the project',
        },
      },
      required: ['projectId'],
    },
  },

  // Search Tools
  {
    name: 'search_documentation',
    description: 'Search across all documentation pages in a project',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: {
          type: 'string',
          description: 'The ID of the project to search',
        },
        query: {
          type: 'string',
          description: 'Search query',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results to return (default: 10)',
        },
      },
      required: ['projectId', 'query'],
    },
  },

  // Publishing Tools
  {
    name: 'publish_project',
    description: 'Publish a project to make it publicly accessible',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: {
          type: 'string',
          description: 'The ID of the project to publish',
        },
        seoTitle: {
          type: 'string',
          description: 'SEO title for the public site',
        },
        seoDescription: {
          type: 'string',
          description: 'SEO description for the public site',
        },
      },
      required: ['projectId'],
    },
  },
  {
    name: 'unpublish_project',
    description: 'Unpublish a project to make it private',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: {
          type: 'string',
          description: 'The ID of the project to unpublish',
        },
      },
      required: ['projectId'],
    },
  },

  // Export Tools
  {
    name: 'export_project',
    description: 'Export project documentation in various formats',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: {
          type: 'string',
          description: 'The ID of the project to export',
        },
        format: {
          type: 'string',
          enum: ['markdown', 'html', 'pdf', 'json'],
          description: 'Export format',
        },
      },
      required: ['projectId', 'format'],
    },
  },

  // Navigation Tools
  {
    name: 'get_navigation',
    description: 'Get the navigation structure of a project',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: {
          type: 'string',
          description: 'The ID of the project',
        },
      },
      required: ['projectId'],
    },
  },
];
