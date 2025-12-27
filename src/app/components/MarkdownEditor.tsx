'use client'
import React from 'react';
import dynamic from 'next/dynamic';
import "easymde/dist/easymde.min.css"; // O CSS obrigatório dele

// Importação dinâmica para evitar erro de "window not found" no Next.js
const SimpleMdeReact = dynamic(
  () => import("react-simplemde-editor"),
  { ssr: false }
);

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function MarkdownEditor({ value, onChange }: EditorProps) {
  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '8px' }}>
      <SimpleMdeReact 
        value={value} 
        onChange={onChange}
      />
    </div>
  );
}