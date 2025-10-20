import { Request, Response } from 'express';
import { parse } from '../lib/parser';
import { render } from '../lib/renderer';

export const parseContent = async (req: Request, res: Response) => {
  try {
    const { content, format = 'mdx' } = req.body;

    const result = await parse(content, format);

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Parse error:', error);
    res.status(500).json({
      success: false,
      message: 'Error parsing content',
      error: error.message,
    });
  }
};

export const renderContent = async (req: Request, res: Response) => {
  try {
    const { content, format = 'mdx' } = req.body;

    const html = await render(content, format);

    res.json({
      success: true,
      data: { html },
    });
  } catch (error: any) {
    console.error('Render error:', error);
    res.status(500).json({
      success: false,
      message: 'Error rendering content',
      error: error.message,
    });
  }
};
