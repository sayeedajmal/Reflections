import { useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Start writing your story...",
  className = ""
}: RichTextEditorProps) {
  const quillRef = useRef<ReactQuill>(null);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'blockquote', 'code-block',
    'link', 'image'
  ];

  useEffect(() => {
    // Custom styling for the Quill editor to match our dark theme
    const style = document.createElement('style');
    style.textContent = `
      .ql-snow {
        border: 1px solid hsl(var(--border));
        border-radius: calc(var(--radius) - 2px);
        background: hsl(var(--background));
      }
      
      .ql-snow .ql-toolbar {
        border-bottom: 1px solid hsl(var(--border));
        background: hsl(var(--muted));
      }
      
      .ql-snow .ql-container {
        border: none;
        font-family: var(--font-body);
        font-size: 16px;
        line-height: 1.6;
      }
      
      .ql-editor {
        color: hsl(var(--foreground));
        min-height: 400px;
        padding: 24px;
      }
      
      .ql-editor.ql-blank::before {
        color: hsl(var(--muted-foreground));
        font-style: normal;
      }
      
      .ql-snow .ql-stroke {
        stroke: hsl(var(--foreground));
      }
      
      .ql-snow .ql-fill {
        fill: hsl(var(--foreground));
      }
      
      .ql-snow .ql-picker {
        color: hsl(var(--foreground));
      }
      
      .ql-snow .ql-picker-options {
        background: hsl(var(--popover));
        border: 1px solid hsl(var(--border));
      }
      
      .ql-snow .ql-picker-item:hover {
        background: hsl(var(--accent));
      }
      
      .ql-snow .ql-tooltip {
        background: hsl(var(--popover));
        border: 1px solid hsl(var(--border));
        color: hsl(var(--foreground));
      }
      
      .ql-snow .ql-tooltip input {
        background: hsl(var(--input));
        border: 1px solid hsl(var(--border));
        color: hsl(var(--foreground));
      }
      
      .ql-editor h1, .ql-editor h2, .ql-editor h3 {
        font-family: var(--font-heading);
      }
      
      .ql-editor blockquote {
        border-left: 4px solid hsl(var(--primary));
        background: hsl(var(--muted));
        padding: 16px 24px;
        margin: 16px 0;
        font-style: italic;
      }
      
      .ql-editor pre {
        background: hsl(var(--muted));
        border: 1px solid hsl(var(--border));
        border-radius: calc(var(--radius) - 2px);
        padding: 16px;
        overflow-x: auto;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className={className}>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  );
}