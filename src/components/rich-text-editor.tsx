
"use client";

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import Quill from 'quill';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export interface RichTextEditorRef {
  getSelection: () => { text: string; index: number; length: number } | null;
  replaceSelection: (html: string) => void;
}

export const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(
  ({ value, onChange, placeholder }, ref) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const quillInstance = useRef<Quill | null>(null);

    useImperativeHandle(ref, () => ({
      getSelection: () => {
        const quill = quillInstance.current;
        if (!quill) return null;
        const range = quill.getSelection();
        if (!range || range.length === 0) return null;
        const text = quill.getText(range.index, range.length);
        return { text, index: range.index, length: range.length };
      },
      replaceSelection: (htmlToInsert: string) => {
        const quill = quillInstance.current;
        if (!quill) return;
        const range = quill.getSelection();

        if (range) {
          // Get the full content *before* the insertion point
          const contentBefore = quill.root.innerHTML.substring(0, range.index);
          
          // Get the full content *after* the selection that will be replaced
          const contentAfter = quill.root.innerHTML.substring(range.index + range.length);
          
          // Construct the new, complete HTML string
          const newContent = contentBefore + htmlToInsert + contentAfter;
          
          // Call the parent's onChange with the complete new state.
          // This will trigger a re-render and update the editor via the `value` prop.
          onChange(newContent);
        }
      }
    }));

    useEffect(() => {
      if (editorRef.current && !quillInstance.current) {
        quillInstance.current = new Quill(editorRef.current, {
          theme: 'snow',
          modules: {
            toolbar: [
              [{ 'header': [1, 2, 3, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{'list': 'ordered'}, {'list': 'bullet'}],
              ['link', 'image'],
              ['clean']
            ],
          },
          placeholder,
        });
        
        quillInstance.current.on('text-change', (delta, oldDelta, source) => {
          if (source === 'user') {
            const currentContent = quillInstance.current?.root.innerHTML || '';
            // Prevent infinite loops by checking if the content has actually changed
            if (value !== currentContent) {
              onChange(currentContent);
            }
          }
        });
      }

      // Cleanup
      return () => {
        if (quillInstance.current) {
          quillInstance.current = null;
        }
      };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [placeholder]);

    // Handle external value changes from parent
    useEffect(() => {
        if (quillInstance.current && value !== quillInstance.current.root.innerHTML) {
            // Store cursor position
            const range = quillInstance.current.getSelection();
            
            // Update contents
            quillInstance.current.root.innerHTML = value;

            // Restore cursor position
            if (range) {
                // A short timeout is sometimes needed to allow the DOM to update
                setTimeout(() => quillInstance.current?.setSelection(range.index, range.length), 0);
            }
        }
    }, [value]);

    return (
      <div className="bg-card text-card-foreground rounded-md border">
          <div ref={editorRef} style={{minHeight: '400px'}} />
      </div>
    );
  }
);

RichTextEditor.displayName = 'RichTextEditor';
