"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const DEFAULT_MD = `# Hello Markdown!

This is a live preview editor for **GitHub Flavored Markdown** (GFM).

## Features
- **Bold**, *italic*, and ~~strikethrough~~ text.
- Lists and nested lists:
  1. Item one
  2. Item two
     - Nested bullet
- Code blocks with syntax formatting
- Tables and blockquotes

> "Markdown is a text-to-HTML conversion tool for web writers." - John Gruber

\`\`\`javascript
function sayHello() {
  console.log("Hello, World!");
}
\`\`\`

| Syntax | Description |
| ----------- | ----------- |
| Header | Title |
| Paragraph | Text |
`;

export function MarkdownPreviewClient() {
  const [input, setInput] = useState(DEFAULT_MD);

  return (
    <div className="stagger-children max-w-[1400px] mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Markdown Preview & Editor</h1>
          <p className="text-sm text-muted mt-2">
            Write markdown and see it instantly rendered as HTML. Supports GitHub Flavored Markdown (tables, checklists, etc).
          </p>
        </div>
        <button 
          onClick={() => setInput("")} 
          className="text-xs font-semibold bg-card border border-border text-foreground px-4 py-2 rounded-lg hover:bg-card-hover active:scale-97 pressable transition-all"
        >
          Clear
        </button>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:h-[700px]">
        {/* Input Pane */}
        <div className="flex flex-col border border-border rounded-xl bg-code-bg overflow-hidden h-[400px] lg:h-full">
          <div className="bg-sidebar border-b border-border px-4 py-2 flex items-center justify-between">
             <span className="text-xs font-mono text-muted">Markdown Input</span>
          </div>
          <textarea
             value={input}
             onChange={(e) => setInput(e.target.value)}
             className="flex-1 resize-none bg-transparent outline-none p-5 text-sm font-mono text-code-foreground whitespace-pre-wrap leading-relaxed"
             spellCheck={false}
             placeholder="Start typing your markdown here..."
          />
        </div>

        {/* Output Pane */}
        <div className="flex flex-col border border-border rounded-xl bg-card overflow-hidden h-[400px] lg:h-full">
          <div className="bg-sidebar border-b border-border px-4 py-2 flex items-center justify-between shadow-sm z-10">
             <span className="text-xs font-mono text-primary font-semibold">Live Preview</span>
          </div>
          <div className="flex-1 overflow-auto p-8 bg-card">
            {input.trim() ? (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {input}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted text-sm">
                Preview will appear here...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
