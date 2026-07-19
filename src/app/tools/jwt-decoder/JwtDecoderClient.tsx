"use client";

import { useState, useMemo } from "react";
import { decodeJWT, getClaimDescription } from "@/lib/tools/jwt-decoder";
import { CopyButton } from "@/components/ui/CopyButton";
import { JsonTree } from "@/components/ui/JsonTree";

export function JwtDecoderClient() {
  const [token, setToken] = useState("");
  const result = useMemo(() => decodeJWT(token), [token]);

  // Handle visual highlights of JWT input string
  const tokenParts = token.split('.');
  const hasParts = tokenParts.length === 3;

  return (
    <div className="stagger-children max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            JWT Decoder
            {result.isValid && result.isExpired !== null && (
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide
                ${result.isExpired ? "bg-danger/20 text-danger" : "bg-success/20 text-success"}
              `}>
                {result.isExpired ? "Expired" : "Valid"}
              </span>
            )}
          </h1>
          <p className="text-sm text-muted mt-2">
            Decode JSON Web Tokens and view headers, payloads, and signatures.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        {/* Left Side: Input area */}
        <div className="flex flex-col border border-border rounded-xl bg-code-bg overflow-hidden h-[500px]">
           <div className="bg-sidebar border-b border-border px-4 py-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">Encoded Token</span>
              {token && <button onClick={() => setToken("")} className="text-[10px] text-muted hover:text-foreground">Clear</button>}
           </div>
           
           <div className="relative flex-1 p-4">
             {/* Textarea for actual input */}
             <textarea
               value={token}
               onChange={(e) => setToken(e.target.value)}
               placeholder="Paste a JWT here..."
               className="absolute inset-0 p-4 font-mono text-sm leading-relaxed text-transparent bg-transparent outline-none resize-none z-10 break-all"
               spellCheck={false}
             />
             
             {/* Overlay for syntax highlighting */}
             <div className="absolute inset-0 p-4 font-mono text-sm leading-relaxed break-all pointer-events-none z-0">
               {hasParts ? (
                 <>
                   <span className="text-danger font-medium">{tokenParts[0]}</span>
                   <span className="text-foreground">.</span>
                   <span className="text-primary font-medium">{tokenParts[1]}</span>
                   <span className="text-foreground">.</span>
                   <span className="text-info font-medium">{tokenParts[2]}</span>
                 </>
               ) : (
                 <span className="text-foreground">{token}</span>
               )}
             </div>
           </div>
           
           {!result.isValid && token.length > 0 && (
             <div className="bg-danger/10 text-danger text-xs px-4 py-2 border-t border-danger/20 flex items-center gap-2">
               <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
               </svg>
               {result.error}
             </div>
           )}
        </div>

        {/* Right Side: Decoded output */}
        <div className="space-y-4 overflow-y-auto max-h-[500px] custom-scrollbar pr-2">
          {/* Header */}
          <div className="flex flex-col border border-danger/30 rounded-xl bg-card overflow-hidden">
            <div className="bg-danger/5 border-b border-danger/20 px-4 py-2 flex items-center justify-between">
               <span className="text-xs font-bold uppercase tracking-wider text-danger">Header <span className="text-danger/70 font-normal lowercase tracking-normal">Algorithm & Token Type</span></span>
               {result.header.decoded && <CopyButton text={JSON.stringify(result.header.decoded, null, 2)} size="sm" />}
            </div>
            <div className="p-4 bg-code-bg">
               {result.header.decoded ? (
                 <JsonTree data={result.header.decoded} />
               ) : (
                 <div className="text-muted text-sm italic">{result.header.error || "Awaiting input..."}</div>
               )}
            </div>
          </div>

          {/* Payload */}
          <div className="flex flex-col border border-primary/30 rounded-xl bg-card overflow-hidden">
            <div className="bg-primary/5 border-b border-primary/20 px-4 py-2 flex items-center justify-between">
               <span className="text-xs font-bold uppercase tracking-wider text-primary">Payload <span className="text-primary/70 font-normal lowercase tracking-normal">Data</span></span>
               {result.payload.decoded && <CopyButton text={JSON.stringify(result.payload.decoded, null, 2)} size="sm" />}
            </div>
            <div className="p-4 bg-code-bg">
               {result.payload.decoded ? (
                 <div className="space-y-4">
                   <JsonTree data={result.payload.decoded} />
                   
                   {/* Standard Claims Explanation */}
                   <div className="pt-4 mt-4 border-t border-border/50">
                     <h4 className="text-[10px] uppercase font-bold text-muted mb-2 tracking-wider">Claims</h4>
                     <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-xs">
                       {Object.keys(result.payload.decoded).map(key => {
                         const isStandard = getClaimDescription(key) !== "Custom Claim";
                         return isStandard ? (
                           <div key={key} className="contents group">
                             <span className="font-mono text-primary group-hover:text-primary-hover">{key}</span>
                             <span className="text-muted group-hover:text-foreground transition-colors">{getClaimDescription(key)}</span>
                           </div>
                         ) : null;
                       })}
                     </div>
                   </div>
                 </div>
               ) : (
                 <div className="text-muted text-sm italic">{result.payload.error || "Awaiting input..."}</div>
               )}
            </div>
          </div>

          {/* Signature */}
          <div className="flex flex-col border border-info/30 rounded-xl bg-card overflow-hidden">
            <div className="bg-info/5 border-b border-info/20 px-4 py-2 flex items-center justify-between">
               <span className="text-xs font-bold uppercase tracking-wider text-info">Signature</span>
            </div>
            <div className="p-4 bg-code-bg font-mono text-xs text-info break-all">
               {result.signature || <span className="text-muted italic">Awaiting input...</span>}
            </div>
            <div className="px-4 py-2 bg-warning/10 border-t border-warning/20">
               <p className="text-[11px] text-warning-foreground m-0 flex items-center gap-1.5 font-medium">
                 <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                   <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                 </svg>
                 Signature is not verified client-side.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
