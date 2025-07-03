// MarkdownEditor.tsx
// A reusable markdown editor with preview, code highlighting, LaTeX, and HTML sanitization

import React, { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from 'rehype-sanitize';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import 'katex/dist/katex.min.css';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string|undefined) => void;
  error?: string;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ value, onChange, error }) => {
  return (
    <div className="space-y-2">
      <MDEditor
        value={value}
        onChange={onChange}
        previewOptions={{
          rehypePlugins: [[rehypeSanitize], [rehypeKatex]],
          remarkPlugins: [remarkGfm, remarkMath],
        }}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default MarkdownEditor;
