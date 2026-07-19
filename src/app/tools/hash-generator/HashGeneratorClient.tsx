"use client";

import { useState, useEffect } from "react";
import { generateHashes, verifyHash, HashResult } from "@/lib/tools/hash-generator";
import { CopyButton } from "@/components/ui/CopyButton";

export function HashGeneratorClient() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<HashResult[]>([
    { algorithm: "MD5", hash: "" },
    { algorithm: "SHA-1", hash: "" },
    { algorithm: "SHA-256", hash: "" },
    { algorithm: "SHA-512", hash: "" },
    { algorithm: "bcrypt", hash: "" },
  ]);
  const [isHashing, setIsHashing] = useState(false);
  
  // Verification Mode State
  const [mode, setMode] = useState<"generate" | "verify">("generate");
  const [verifyInput, setVerifyInput] = useState("");
  const [knownHash, setKnownHash] = useState("");
  const [verifyResult, setVerifyResult] = useState<boolean | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Debounced hash generation for input
  useEffect(() => {
    if (mode !== "generate") return;
    
    if (!input) {
      setHashes([
        { algorithm: "MD5", hash: "" },
        { algorithm: "SHA-1", hash: "" },
        { algorithm: "SHA-256", hash: "" },
        { algorithm: "SHA-512", hash: "" },
        { algorithm: "bcrypt", hash: "" },
      ]);
      return;
    }

    setIsHashing(true);
    const timer = setTimeout(async () => {
      const results = await generateHashes(input);
      setHashes(results);
      setIsHashing(false);
    }, 300); // 300ms debounce to avoid freezing UI while typing

    return () => clearTimeout(timer);
  }, [input, mode]);

  const handleVerify = async () => {
    if (!verifyInput || !knownHash) return;
    setIsVerifying(true);
    const isBcrypt = knownHash.startsWith("$2a$") || knownHash.startsWith("$2b$") || knownHash.startsWith("$2y$");
    
    // Slight timeout to allow UI update before blocking thread
    setTimeout(async () => {
      const isValid = await verifyHash(verifyInput, knownHash, isBcrypt);
      setVerifyResult(isValid);
      setIsVerifying(false);
    }, 10);
  };

  return (
    <div className="stagger-children max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Hash Generator & Verifier</h1>
          <p className="text-sm text-muted mt-2">
            Generate multiple hashes simultaneously including MD5, SHA families, and bcrypt.
          </p>
        </div>
        
        {/* Mode Tabs */}
        <div className="flex items-center gap-1 bg-input rounded-lg p-1 border border-border w-max">
          <button
            onClick={() => setMode("generate")}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
              mode === "generate" ? "bg-card text-foreground shadow-sm" : "text-muted hover:text-foreground"
            }`}
          >
            Generate
          </button>
          <button
            onClick={() => setMode("verify")}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
              mode === "verify" ? "bg-card text-foreground shadow-sm" : "text-muted hover:text-foreground"
            }`}
          >
            Verify
          </button>
        </div>
      </div>

      {mode === "generate" ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
          {/* Input Area */}
          <div className="flex flex-col border border-border rounded-xl bg-code-bg overflow-hidden h-[400px]">
            <div className="bg-sidebar border-b border-border px-4 py-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">Input Text</span>
              {input && <button onClick={() => setInput("")} className="text-[10px] text-muted hover:text-foreground">Clear</button>}
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text to hash..."
              className="flex-1 w-full bg-transparent p-4 font-mono text-sm text-foreground outline-none resize-none leading-relaxed"
              spellCheck={false}
            />
          </div>

          {/* Outputs Area */}
          <div className="flex flex-col border border-border rounded-xl bg-card overflow-hidden h-fit min-h-[400px]">
            <div className="bg-sidebar border-b border-border px-4 py-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground flex items-center gap-2">
                Hash Results
                {isHashing && <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />}
              </span>
            </div>
            
            <div className="divide-y divide-border flex-1 flex flex-col">
              {hashes.map((h) => (
                <div key={h.algorithm} className="p-4 flex flex-col gap-2 group hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted group-hover:text-primary transition-colors">{h.algorithm}</span>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                       {h.hash && <CopyButton text={h.hash} size="sm" />}
                    </div>
                  </div>
                  <div className="font-mono text-sm text-code-foreground break-all h-auto min-h-[20px]">
                    {h.hash ? h.hash : <span className="text-muted/50 italic text-xs">Waiting for input...</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Verify Mode */
        <div className="rounded-xl border border-border bg-card p-6 max-w-2xl mx-auto space-y-6">
          <div className="space-y-4">
             <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Known Hash</label>
                <input
                  type="text"
                  value={knownHash}
                  onChange={(e) => { setKnownHash(e.target.value); setVerifyResult(null); }}
                  placeholder="Paste the hash here (e.g. $2a$10$... or e10adc...)"
                  className="w-full font-mono text-sm rounded-lg border border-input-border bg-input px-3 py-2
                             text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
             </div>
             
             <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Plain Text Input</label>
                <textarea
                  value={verifyInput}
                  onChange={(e) => { setVerifyInput(e.target.value); setVerifyResult(null); }}
                  placeholder="Enter the plain text..."
                  className="w-full font-mono text-sm rounded-lg border border-input-border bg-input px-3 py-2
                             text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-y min-h-[100px]"
                />
             </div>
             
             <button
                onClick={handleVerify}
                disabled={!verifyInput || !knownHash || isVerifying}
                className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground 
                           hover:bg-primary-hover active:scale-97 pressable transition-all disabled:opacity-50 flex justify-center items-center gap-2"
             >
                {isVerifying && <span className="flex h-2 w-2 rounded-full bg-primary-foreground animate-pulse" />}
                {isVerifying ? "Doğrulanıyor..." : "Doğrula (Verify)"}
             </button>
             
             {/* Result Card */}
             {verifyResult !== null && (
               <div className={`mt-4 p-4 rounded-xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-2
                 ${verifyResult ? "bg-success/10 border-success text-success" : "bg-danger/10 border-danger text-danger"}
               `}>
                 {verifyResult ? (
                   <>
                     <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                       <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                     </svg>
                     <div>
                       <div className="font-bold">Match Successful</div>
                       <div className="text-xs opacity-80">The input text generates this exact hash.</div>
                     </div>
                   </>
                 ) : (
                   <>
                     <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                       <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                     </svg>
                     <div>
                       <div className="font-bold">No Match</div>
                       <div className="text-xs opacity-80">The input text does not match the provided hash.</div>
                     </div>
                   </>
                 )}
               </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
}
