# 🤖 Doxify MCP Service

**Model Context Protocol (MCP) Server** for Doxify documentation platform.  
Enables AI tools like Claude, ChatGPT, and other AI agents to interact with your documentation programmatically.

---

## 🌟 Features

### Project Management
- ✅ Create, update, delete projects
- ✅ List all projects for a user
- ✅ Get project details

### Page Management
- ✅ Create, update, delete documentation pages
- ✅ List all pages in a project
- ✅ Rich content support (HTML/Markdown)

### Organization
- ✅ Create sections to organize pages
- ✅ Get navigation structure
- ✅ Hierarchical documentation

### Search & Discovery
- ✅ Full-text search across documentation
- ✅ Search by title or content
- ✅ Relevance scoring

### Publishing
- ✅ Publish projects to public URLs
- ✅ SEO settings (title, description)
- ✅ Unpublish projects

### Export
- ✅ Export to Markdown, HTML, PDF, JSON
- ✅ Batch export support

---

## 📡 API Endpoints

### Base URL
```
http://localhost:4008/mcp
```

### Available Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/mcp/info` | GET | Get MCP server information |
| `/mcp/tools` | GET | List all available tools |
| `/mcp/tools/:toolName` | GET | Get specific tool details |
| `/mcp/execute` | POST | Execute a single tool |
| `/mcp/batch-execute` | POST | Execute multiple tools |

---

## 🛠️ Available Tools

### Project Tools
- `create_project` - Create a new project
- `list_projects` - List all projects
- `get_project` - Get project details
- `update_project` - Update project
- `delete_project` - Delete project

### Page Tools
- `create_page` - Create a documentation page
- `list_pages` - List all pages
- `get_page` - Get page details
- `update_page` - Update page content
- `delete_page` - Delete page

### Section Tools
- `create_section` - Create a section
- `list_sections` - List all sections

### Utility Tools
- `search_documentation` - Search pages
- `get_navigation` - Get navigation structure
- `publish_project` - Publish project
- `unpublish_project` - Unpublish project
- `export_project` - Export documentation

---

## 🚀 Quick Start

### Install Dependencies
```bash
cd services/mcp-service
npm install
```

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

---

## 📝 Usage Examples

### Get Available Tools
```bash
curl http://localhost:4008/mcp/tools
```

### Create a Project
```bash
curl -X POST http://localhost:4008/mcp/execute \
  -H "Content-Type: application/json" \
  -d '{
    "name": "create_project",
    "arguments": {
      "name": "My Documentation",
      "slug": "my-docs",
      "description": "API documentation",
      "userId": "user123"
    }
  }'
```

### Create a Page
```bash
curl -X POST http://localhost:4008/mcp/execute \
  -H "Content-Type: application/json" \
  -d '{
    "name": "create_page",
    "arguments": {
      "projectId": "proj123",
      "title": "Getting Started",
      "content": "<h1>Welcome</h1><p>Get started...</p>"
    }
  }'
```

### Search Documentation
```bash
curl -X POST http://localhost:4008/mcp/execute \
  -H "Content-Type: application/json" \
  -d '{
    "name": "search_documentation",
    "arguments": {
      "projectId": "proj123",
      "query": "installation",
      "limit": 10
    }
  }'
```

---

## 🔧 Configuration

### Environment Variables
```env
PORT=4008
AUTH_SERVICE_URL=http://localhost:4001
PROJECTS_SERVICE_URL=http://localhost:4002
PAGES_SERVICE_URL=http://localhost:4003
VIEWER_SERVICE_URL=http://localhost:4007
EXPORT_SERVICE_URL=http://localhost:4006
PUBLIC_URL=http://localhost:5173
```

---

## 🎯 Integration with AI Tools

### Claude Desktop
Add to your Claude configuration:
```json
{
  "mcpServers": {
    "doxify": {
      "url": "http://localhost:4008/mcp",
      "type": "http"
    }
  }
}
```

### Custom AI Agent
```python
import requests

def call_doxify_tool(tool_name, arguments):
    response = requests.post(
        'http://localhost:4008/mcp/execute',
        json={
            'name': tool_name,
            'arguments': arguments
        }
    )
    return response.json()

# Create a project
result = call_doxify_tool('create_project', {
    'name': 'AI Docs',
    'userId': 'user123'
})
print(result)
```

---

## 📊 Architecture

```
┌─────────────────┐
│   AI Tool       │
│ (Claude/GPT)    │
└────────┬────────┘
         │
         │ HTTP/MCP Protocol
         ▼
┌─────────────────┐
│  MCP Service    │
│   (Port 4008)   │
└────────┬────────┘
         │
         │ Internal APIs
         ▼
┌─────────────────────────────────────┐
│  Microservices                      │
│  • Projects Service (4002)          │
│  • Pages Service (4003)             │
│  • Export Service (4006)            │
│  • Viewer Service (4007)            │
└─────────────────────────────────────┘
```

---

## 🧪 Testing

### Health Check
```bash
curl http://localhost:4008/health
```

### List Tools
```bash
curl http://localhost:4008/mcp/tools | jq
```

### Server Info
```bash
curl http://localhost:4008/mcp/info | jq
```

---

## 📖 MCP Protocol

This service implements the Model Context Protocol, allowing AI models to:
- ✅ Discover available tools
- ✅ Execute tools with validated inputs
- ✅ Receive structured responses
- ✅ Handle errors gracefully
- ✅ Batch execute multiple operations

---

## 🔒 Security Considerations

- Add authentication middleware for production
- Implement rate limiting
- Validate all inputs
- Use HTTPS in production
- Restrict CORS origins

---

## 📚 Documentation

For more details, visit:
- Main Docs: [http://localhost:5173](http://localhost:5173)
- MCP Tools: [http://localhost:4008/mcp/tools](http://localhost:4008/mcp/tools)
- MCP Info: [http://localhost:4008/mcp/info](http://localhost:4008/mcp/info)

---

## 🤝 Contributing

1. Add new tools in `src/tools/tool-definitions.ts`
2. Implement handlers in `src/tools/tool-handlers.ts`
3. Test thoroughly
4. Update this README

---

## 📝 License

Part of the Doxify project.
