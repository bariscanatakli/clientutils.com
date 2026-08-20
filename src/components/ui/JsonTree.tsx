"use client";

import { useState } from "react";
import { CopyButton } from "@/components/ui/CopyButton";

interface JsonTreeProps {
  data: unknown;
  initiallyExpanded?: boolean;
}

export function JsonTree({ data, initiallyExpanded = true }: JsonTreeProps) {
  if (data === undefined || data === null) {
    return <span className="text-gray-500 font-mono text-sm">null</span>;
  }

  if (typeof data === "string") {
    return <span className="text-success font-mono text-sm break-words">&quot;{data}&quot;</span>;
  }

  if (typeof data === "number") {
    return <span className="text-primary font-mono text-sm">{data}</span>;
  }

  if (typeof data === "boolean") {
    return <span className="text-warning font-mono text-sm">{data ? "true" : "false"}</span>;
  }

  if (Array.isArray(data)) {
    return <JsonArray arr={data} initiallyExpanded={initiallyExpanded} />;
  }

  if (typeof data === "object") {
    return <JsonObject obj={data as Record<string, unknown>} initiallyExpanded={initiallyExpanded} />;
  }

  return <span className="text-muted font-mono text-sm">{String(data)}</span>;
}

function JsonArray({ arr, initiallyExpanded }: { arr: unknown[]; initiallyExpanded: boolean }) {
  const [expanded, setExpanded] = useState(initiallyExpanded);

  if (arr.length === 0) {
    return <span className="text-foreground font-mono text-sm">[]</span>;
  }

  return (
    <div className="font-mono text-sm flex flex-col">
      <div 
        className="flex items-center cursor-pointer select-none text-foreground hover:bg-black/5 dark:hover:bg-white/5 rounded-sm w-max pr-2 transition-colors group"
        onClick={() => setExpanded(!expanded)}
      >
        <svg className={`h-3 w-3 mr-1 text-muted transition-transform duration-200 ${expanded ? "rotate-90" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
        <span className="font-bold">[</span>
        {!expanded && <span className="text-muted text-xs mx-2">... {arr.length} items ...</span>}
        {!expanded && <span className="font-bold">]</span>}
      </div>
      
      <div 
        className={`ml-4 pl-2 border-l border-border transition-all duration-300 ease-in-out overflow-hidden
          ${expanded ? "max-h-[5000px] opacity-100 mt-1 mb-1" : "max-h-0 opacity-0"}`}
      >
        {arr.map((item, index) => (
          <div key={index} className="flex group/item relative">
             <div className="flex-1">
               <JsonTree data={item} initiallyExpanded={initiallyExpanded} />
               {index < arr.length - 1 && <span className="text-foreground">,</span>}
             </div>
             {/* Copy feature for individual items */}
             <div className="opacity-0 group-hover/item:opacity-100 absolute right-0 bg-card/80 backdrop-blur-sm px-2 -translate-y-1/2 top-1/2">
                <CopyButton text={typeof item === 'object' ? JSON.stringify(item, null, 2) : String(item)} size="sm" label="" />
             </div>
          </div>
        ))}
      </div>
      
      {expanded && <div className="font-bold text-foreground w-max">]</div>}
    </div>
  );
}

function JsonObject({ obj, initiallyExpanded }: { obj: Record<string, unknown>; initiallyExpanded: boolean }) {
  const [expanded, setExpanded] = useState(initiallyExpanded);
  const entries = Object.entries(obj);

  if (entries.length === 0) {
    return <span className="text-foreground font-mono text-sm">{"{}"}</span>;
  }

  return (
    <div className="font-mono text-sm flex flex-col">
      <div 
        className="flex items-center cursor-pointer select-none text-foreground hover:bg-black/5 dark:hover:bg-white/5 rounded-sm w-max pr-2 transition-colors group"
        onClick={() => setExpanded(!expanded)}
      >
        <svg className={`h-3 w-3 mr-1 text-muted transition-transform duration-200 ${expanded ? "rotate-90" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
        <span className="font-bold">{"{"}</span>
        {!expanded && <span className="text-muted text-xs mx-2">... {entries.length} keys ...</span>}
        {!expanded && <span className="font-bold">{"}"}</span>}
      </div>
      
      <div 
        className={`ml-4 pl-2 border-l border-border transition-all duration-300 ease-in-out overflow-hidden
          ${expanded ? "max-h-[10000px] opacity-100 mt-1 mb-1" : "max-h-0 opacity-0"}`}
      >
        {entries.map(([key, value], index) => (
          <div key={key} className="flex group/item relative py-[1px]">
            <span className="text-accent mr-2 whitespace-nowrap">&quot;{key}&quot;:</span>
            <div className="flex-1 min-w-0">
               <JsonTree data={value} initiallyExpanded={initiallyExpanded} />
               {index < entries.length - 1 && <span className="text-foreground">,</span>}
            </div>
            
            <div className="opacity-0 group-hover/item:opacity-100 absolute right-0 bg-card/90 backdrop-blur-sm px-2 -translate-y-1/2 top-1/2 z-10 transition-opacity">
                <CopyButton text={typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)} size="sm" label="Copy" />
             </div>
          </div>
        ))}
      </div>
      
      {expanded && <div className="font-bold text-foreground w-max">{"}"}</div>}
    </div>
  );
}
