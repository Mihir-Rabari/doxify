import { Extension } from '@tiptap/core';
import { ReactRenderer } from '@tiptap/react';
import Suggestion from '@tiptap/suggestion';
import { Editor } from '@tiptap/react';
import tippy, { Instance as TippyInstance } from 'tippy.js';
import SlashMenu from './SlashMenu';

export const SlashCommand = Extension.create({
  name: 'slashCommand',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        startOfLine: false,
        command: ({ editor, range, props }: { editor: Editor; range: any; props: any }) => {
          props.command({ editor, range });
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        char: '/',
        startOfLine: false,
        ...this.options.suggestion,
      }),
    ];
  },
});

export const renderSlashMenu = () => {
  let component: ReactRenderer | null = null;
  let popup: TippyInstance[] | null = null;

  return {
    items: ({ query }: { query: string }) => {
      // Return empty array to let SlashMenu component handle the items
      return [];
    },

    render: () => {
      return {
        onStart: (props: any) => {
          component = new ReactRenderer(SlashMenu, {
            props: {
              editor: props.editor,
              query: props.query || '',
              onSelect: () => {
                props.editor.commands.deleteRange({ from: props.range.from, to: props.range.to });
                popup?.[0]?.hide();
              },
            },
            editor: props.editor,
          });

          if (!props.clientRect) {
            return;
          }

          popup = tippy('body', {
            getReferenceClientRect: props.clientRect,
            appendTo: () => document.body,
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: 'manual',
            placement: 'bottom-start',
            theme: 'slash-menu',
            maxWidth: 'none',
          });
        },

        onUpdate(props: any) {
          component?.updateProps({
            editor: props.editor,
            query: props.query || '',
            onSelect: () => {
              props.editor.commands.deleteRange({ from: props.range.from, to: props.range.to });
              popup?.[0]?.hide();
            },
          });

          if (!props.clientRect) {
            return;
          }

          popup?.[0]?.setProps({
            getReferenceClientRect: props.clientRect,
          });
        },

        onKeyDown(props: any) {
          if (props.event.key === 'Escape') {
            popup?.[0]?.hide();
            return true;
          }
          return false;
        },

        onExit() {
          popup?.[0]?.destroy();
          component?.destroy();
        },
      };
    },
  };
};
