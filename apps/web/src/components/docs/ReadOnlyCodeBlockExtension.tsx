import { mergeAttributes } from '@tiptap/core';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { ReactNodeViewRenderer } from '@tiptap/react';
import ReadOnlyCodeBlock from './ReadOnlyCodeBlock';

export const ReadOnlyCustomCodeBlock = CodeBlockLowlight.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      language: {
        default: 'plaintext',
        parseHTML: (element) => element.getAttribute('data-language'),
        renderHTML: (attributes) => {
          return {
            'data-language': attributes.language,
            class: `language-${attributes.language}`,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'pre',
        preserveWhitespace: 'full',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'pre',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      ['code', {}, 0],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ReadOnlyCodeBlock);
  },
});
