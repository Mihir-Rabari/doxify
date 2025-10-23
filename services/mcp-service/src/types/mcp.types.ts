export interface MCPTool {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
}

export interface MCPToolResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
  isError?: boolean;
}

export interface MCPRequest {
  name: string;
  arguments: Record<string, any>;
}

export interface Project {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  userId: string;
  publishSettings?: {
    isPublished: boolean;
    seoTitle?: string;
    seoDescription?: string;
  };
}

export interface Page {
  _id?: string;
  projectId: string;
  title: string;
  slug: string;
  content: string;
  sectionId?: string;
  order?: number;
}

export interface Section {
  _id?: string;
  projectId: string;
  name: string;
  order: number;
}
