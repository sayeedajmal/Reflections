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
  replaceSelection: (text: string) => void;
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
      replaceSelection: (text: string) => {
        const quill = quillInstance.current;
        if (!quill) return;
        const range = quill.getSelection();
        if (range) {
           quill.deleteText(range.index, range.length);
           quill.insertText(range.index, text, 'user');
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

        // Set initial value
        if(value) {
          quillInstance.current.root.innerHTML = value;
        }
        
        quillInstance.current.on('text-change', (delta, oldDelta, source) => {
          if (source === 'user') {
            onChange(quillInstance.current?.root.innerHTML || '');
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

    // Handle external value changes
    useEffect(() => {
      if (quillInstance.current && value !== quillInstance.current.root.innerHTML) {
          const delta = quillInstance.current.clipboard.convert(value);
          quillInstance.current.setContents(delta, 'silent');
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
