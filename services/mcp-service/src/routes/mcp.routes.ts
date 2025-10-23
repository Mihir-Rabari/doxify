import express from 'express';
import { tools } from '../tools/tool-definitions';
import { toolHandlers } from '../tools/tool-handlers';
import { MCPRequest } from '../types/mcp.types';

const router = express.Router();

// Get all available tools
router.get('/tools', (req, res) => {
  res.json({
    tools,
    count: tools.length,
    version: '1.0.0',
    protocol: 'Model Context Protocol',
  });
});

// Get specific tool info
router.get('/tools/:toolName', (req, res) => {
  const { toolName } = req.params;
  const tool = tools.find(t => t.name === toolName);
  
  if (!tool) {
    return res.status(404).json({
      error: `Tool '${toolName}' not found`,
      availableTools: tools.map(t => t.name),
    });
  }

  res.json(tool);
});

// Execute a tool
router.post('/execute', async (req, res) => {
  try {
    const { name, arguments: args }: MCPRequest = req.body;

    // Validate tool exists
    const tool = tools.find(t => t.name === name);
    if (!tool) {
      return res.status(404).json({
        error: `Tool '${name}' not found`,
        availableTools: tools.map(t => t.name),
      });
    }

    // Validate handler exists
    const handler = toolHandlers[name];
    if (!handler) {
      return res.status(500).json({
        error: `Handler not implemented for tool '${name}'`,
      });
    }

    // Execute tool
    const result = await handler(args);
    
    res.json(result);
  } catch (error: any) {
    console.error('Tool execution error:', error);
    res.status(500).json({
      content: [{
        type: 'text',
        text: JSON.stringify({
          success: false,
          error: error.message || 'Internal server error',
        }, null, 2),
      }],
      isError: true,
    });
  }
});

// Batch execute multiple tools
router.post('/batch-execute', async (req, res) => {
  try {
    const { requests } = req.body;

    if (!Array.isArray(requests)) {
      return res.status(400).json({
        error: 'requests must be an array',
      });
    }

    const results = await Promise.allSettled(
      requests.map(async (request: MCPRequest) => {
        const { name, arguments: args } = request;
        const handler = toolHandlers[name];
        
        if (!handler) {
          return {
            tool: name,
            success: false,
            error: `Handler not found for tool '${name}'`,
          };
        }

        try {
          const result = await handler(args);
          return {
            tool: name,
            result,
          };
        } catch (error: any) {
          return {
            tool: name,
            success: false,
            error: error.message,
          };
        }
      })
    );

    res.json({
      results: results.map((r, i) => ({
        tool: requests[i].name,
        status: r.status,
        ...(r.status === 'fulfilled' ? r.value : { error: r.reason }),
      })),
      count: results.length,
    });
  } catch (error: any) {
    console.error('Batch execution error:', error);
    res.status(500).json({
      error: error.message || 'Batch execution failed',
    });
  }
});

// Get MCP server info
router.get('/info', (req, res) => {
  res.json({
    name: 'Doxify MCP Server',
    version: '1.0.0',
    description: 'Model Context Protocol server for Doxify documentation platform',
    protocol: 'MCP',
    capabilities: {
      tools: true,
      resources: false,
      prompts: false,
    },
    endpoints: {
      tools: '/mcp/tools',
      execute: '/mcp/execute',
      batchExecute: '/mcp/batch-execute',
      info: '/mcp/info',
    },
    toolCount: tools.length,
  });
});

export default router;
