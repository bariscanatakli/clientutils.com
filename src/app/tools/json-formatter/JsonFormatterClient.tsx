"use client";

import { useState, useRef, useEffect } from "react";
import { parseJSON, formatJSON, minifyJSON } from "@/lib/tools/json-formatter";
import { CopyButton } from "@/components/ui/CopyButton";
import { JsonTree } from "@/components/ui/JsonTree";

const INITIAL_JSON = `{\n  "name": "DevTools",\n  "version": 1.0,\n  "isAwesome": true,\n  "features": ["formatting", "validation", "tree view"]\n}`;

export function JsonFormatterClient() {
  const [input, setInput] = useState(INITIAL_JSON);
  const [indent, setIndent] = useState<number | "tab">(2);
  const [viewMode, setViewMode] = useState<"text" | "tree">("tree");
  
  const parsed = parseJSON(input);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync scroll for line numbers
  const [scrollTop, setScrollTop] = useState(0);
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  const handleFormat = () => {
    if (parsed.isValid) {
      setInput(formatJSON(parsed.data, indent));
    }
  };

  const handleMinify = () => {
    if (parsed.isValid) {
      setInput(minifyJSON(input));
    }
  };

  const handleClear = () => setInput("");

  // Handle Tab key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      
      const tabStr = indent === "tab" ? "\t" : " ".repeat(indent);
      const val = target.value;
      
      setInput(val.substring(0, start) + tabStr + val.substring(end));
      
      // Put caret at right position again (async to allow state update)
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + tabStr.length;
        }
      }, 0);
    }
  };

  const lines = input.split('\n');

  return (
    <div className="stagger-children max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">JSON Formatter & Validator</h1>
          <p className="text-sm text-muted mt-2">
            Format, validate, and explore JSON data. Client-side processing ensures your data stays private.
          </p>
        </div>
        
        {/* Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          <select 
            value={indent} 
            onChange={(e) => setIndent(e.target.value === "tab" ? "tab" : parseInt(e.target.value))}
            className="text-xs bg-input border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          >
            <option value={2}>2 Spaces</option>
            <option value={4}>4 Spaces</option>
            <option value="tab">Tabs</option>
          </select>

          <button onClick={handleFormat} disabled={!parsed.isValid} className="text-xs font-semibold bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary-hover active:scale-97 pressable disabled:opacity-50 disabled:pointer-events-none transition-all">Format</button>
          <button onClick={handleMinify} disabled={!parsed.isValid} className="text-xs font-semibold bg-card border border-border text-foreground px-4 py-2 rounded-lg hover:bg-card-hover active:scale-97 pressable disabled:opacity-50 disabled:pointer-events-none transition-all">Minify</button>
          <button onClick={handleClear} className="text-xs font-semibold bg-card border border-border text-foreground px-4 py-2 rounded-lg hover:bg-card-hover active:scale-97 pressable transition-all">Clear</button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:h-[600px]">
        {/* Input Pane */}
        <div className="flex flex-col border border-border rounded-xl bg-code-bg overflow-hidden h-[300px] lg:h-full relative">
          <div className="bg-sidebar border-b border-border px-4 py-2 flex items-center justify-between">
             <span className="text-xs font-mono text-muted">input.json</span>
             <CopyButton text={input} size="sm" label="Kopyala" />
          </div>
          
          <div className="flex-1 relative flex overflow-hidden">
             {/* Line Numbers */}
             <div 
               className="w-12 bg-sidebar border-r border-border text-right pr-2 py-4 text-xs font-mono text-muted select-none overflow-hidden"
             >
                <div style={{ transform: `translateY(-${scrollTop}px)` }}>
                  {lines.map((_, i) => (
                    <div key={i} className={`h-[21px] leading-[21px] ${parsed.errorLine === i + 1 ? 'text-danger font-bold bg-danger/10' : ''}`}>
                      {i + 1}
                    </div>
                  ))}
                </div>
             </div>
             
             {/* Editor */}
             <textarea
               ref={textareaRef}
               value={input}
               onChange={(e) => setInput(e.target.value)}
               onScroll={handleScroll}
               onKeyDown={handleKeyDown}
               className="flex-1 resize-none bg-transparent outline-none p-4 text-sm font-mono text-code-foreground whitespace-pre leading-[21px]"
               spellCheck={false}
               placeholder="Paste JSON here..."
             />
             
             {/* Error Line Highlight Background */}
             {parsed.errorLine !== null && (
               <div 
                 className="absolute left-12 right-0 pointer-events-none bg-danger/10 border-l-[3px] border-danger"
                 style={{ 
                   top: `${(parsed.errorLine - 1) * 21 + 16 - scrollTop}px`, 
                   height: '21px' 
                 }}
               />
             )}
          </div>

          {/* Validation Status Bar */}
          <div className={`px-4 py-2 text-xs font-medium flex items-center gap-2 ${parsed.isValid ? 'bg-success/10 text-success border-t border-success/20' : input.trim() ? 'bg-danger/10 text-danger border-t border-danger/20' : 'bg-sidebar border-t border-border text-muted'}`}>
            {parsed.isValid ? (
              <>
                 <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                   <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                 </svg>
                 Valid JSON
              </>
            ) : input.trim() ? (
              <>
                 <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                   <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                 </svg>
                 {parsed.error} {parsed.errorLine ? `(Line ${parsed.errorLine})` : ''}
              </>
            ) : (
               "Waiting for input..."
            )}
          </div>
        </div>

        {/* Right: Output/Viewer */}
        <div className="flex flex-col border border-border rounded-xl bg-card overflow-hidden">
          <div className="bg-sidebar border-b border-border px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-1 bg-input rounded-lg p-0.5 border border-border">
              <button
                onClick={() => setViewMode("tree")}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  viewMode === "tree" ? "bg-card text-foreground shadow-sm" : "text-muted hover:text-foreground"
                }`}
              >
                Tree View
              </button>
              <button
                onClick={() => setViewMode("text")}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  viewMode === "text" ? "bg-card text-foreground shadow-sm" : "text-muted hover:text-foreground"
                }`}
              >
                Formatted Text
              </button>
            </div>
            
            {viewMode === "text" && parsed.isValid && (
               <CopyButton text={formatJSON(parsed.data, indent)} size="sm" label="Kopyala" />
            )}
          </div>

          <div className="flex-1 overflow-auto p-4 bg-code-bg">
             {!input.trim() ? (
               <div className="h-full flex items-center justify-center text-muted text-sm">
                 Waiting for JSON input...
               </div>
             ) : !parsed.isValid ? (
               <div className="h-full flex flex-col items-center justify-center text-danger/70 text-sm gap-2">
                 <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                 </svg>
                 Invalid JSON Cannot be Viewed
               </div>
             ) : viewMode === "tree" ? (
               <div className="p-2">
                 <JsonTree data={parsed.data} initiallyExpanded={true} />
               </div>
             ) : (
               <pre className="text-sm font-mono text-code-foreground">
                 {formatJSON(parsed.data, indent)}
               </pre>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
