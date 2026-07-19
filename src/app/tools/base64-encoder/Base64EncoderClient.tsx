"use client";

import { useState, useRef, useMemo } from "react";
import { encodeText, decodeText, encodeFile, getBase64Stats, isValidBase64 } from "@/lib/tools/base64-encoder";
import { CopyButton } from "@/components/ui/CopyButton";

export function Base64EncoderClient() {
  const [mode, setMode] = useState<"text" | "file">("text");
  const [action, setAction] = useState<"encode" | "decode">("encode");
  
  const [input, setInput] = useState("");
  const [fileDataUri, setFileDataUri] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Text Mode Logic
  const textOutput = useMemo(() => {
    if (mode !== "text" || !input) return "";
    if (action === "encode") {
      return encodeText(input);
    } else {
      return decodeText(input).text;
    }
  }, [input, action, mode]);

  const textError = useMemo(() => {
    if (mode === "text" && action === "decode" && input && !isValidBase64(input)) {
      return "Geçersiz Base64 dizgesi.";
    }
    return null;
  }, [input, action, mode]);

  const stats = useMemo(() => {
    const target = mode === "text" && action === "encode" ? textOutput : input;
    if (!target) return null;
    return getBase64Stats(target);
  }, [input, textOutput, action, mode]);

  // File Mode Logic
  const handleFileChange = async (file: File) => {
    if (!file) return;
    setFileName(file.name);
    try {
      const uri = await encodeFile(file);
      setFileDataUri(uri);
    } catch (err) {
      alert("Dosya okuma hatası.");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // Base64 without data type prefix for copy
  const rawFileBase64 = useMemo(() => {
    if (!fileDataUri) return "";
    const parts = fileDataUri.split(',');
    return parts.length > 1 ? parts[1] : parts[0];
  }, [fileDataUri]);

  return (
    <div className="stagger-children max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Base64 Encoder / Decoder</h1>
          <p className="text-sm text-muted mt-2">
            Encode and decode text or files to Base64 format instantly.
          </p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-4 md:p-6 space-y-6">
        
        {/* Mode & Action Selectors */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Mode Tabs */}
          <div className="flex items-center gap-1 bg-input rounded-lg p-1 border border-border w-max">
            <button
              onClick={() => { setMode("text"); setInput(""); }}
              className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
                mode === "text" ? "bg-card text-foreground shadow-sm" : "text-muted hover:text-foreground"
              }`}
            >
              Text Mode
            </button>
            <button
              onClick={() => setMode("file")}
              className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
                mode === "file" ? "bg-card text-foreground shadow-sm" : "text-muted hover:text-foreground"
              }`}
            >
              File / Image Mode
            </button>
          </div>

          {/* Encode / Decode Toggle (Text mode only) */}
          {mode === "text" && (
            <div className="flex items-center gap-1 bg-input rounded-lg p-1 border border-border w-max">
               <button
                onClick={() => setAction("encode")}
                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  action === "encode" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted hover:text-foreground"
                }`}
              >
                Encode
              </button>
              <button
                onClick={() => setAction("decode")}
                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  action === "decode" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted hover:text-foreground"
                }`}
              >
                Decode
              </button>
            </div>
          )}
        </div>

        {/* Workspaces */}
        {mode === "text" ? (
          <div className="grid gap-4 md:grid-cols-2 h-[350px]">
             {/* Left Text Input */}
             <div className="flex flex-col border border-border rounded-xl overflow-hidden bg-code-bg">
               <div className="bg-sidebar border-b border-border px-4 py-2 flex items-center justify-between">
                 <span className="text-xs font-mono text-muted">{action === "encode" ? "Plain Text Input" : "Base64 Input"}</span>
                 {input && <button onClick={() => setInput("")} className="text-[10px] text-muted hover:text-foreground">Clear</button>}
               </div>
               <textarea
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 placeholder={action === "encode" ? "Enter text to encode..." : "Paste Base64 here..."}
                 className="flex-1 w-full bg-transparent p-4 font-mono text-sm text-foreground outline-none resize-none leading-relaxed"
                 spellCheck={false}
               />
               {textError && <div className="bg-danger/10 text-danger text-xs px-4 py-2 border-t border-danger/20">{textError}</div>}
             </div>

             {/* Right Text Output */}
             <div className="flex flex-col border border-border rounded-xl overflow-hidden bg-code-bg">
               <div className="bg-sidebar border-b border-border px-4 py-2 flex items-center justify-between">
                 <span className="text-xs font-mono text-muted">{action === "encode" ? "Base64 Output" : "Plain Text Output"}</span>
                 <CopyButton text={textOutput} size="sm" label="Kopyala" />
               </div>
               <textarea
                 value={textOutput}
                 readOnly
                 placeholder="Result will appear here..."
                 className="flex-1 w-full bg-transparent p-4 font-mono text-sm text-foreground outline-none resize-none leading-relaxed"
                 spellCheck={false}
               />
             </div>
          </div>
        ) : (
          /* File Mode Workspace */
          <div className="grid gap-6 md:grid-cols-2">
             <div 
               onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
               onDragLeave={() => setIsDragging(false)}
               onDrop={handleDrop}
               onClick={() => fileInputRef.current?.click()}
               className={`flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 h-[300px]
                 ${isDragging ? "border-primary bg-primary/5 scale-[0.99]" : "border-border bg-code-bg hover:border-primary/50 hover:bg-black/5 dark:hover:bg-white/5"}
               `}
             >
               <input 
                 type="file" 
                 ref={fileInputRef} 
                 onChange={(e) => { if (e.target.files?.[0]) handleFileChange(e.target.files[0]); }} 
                 className="hidden" 
               />
               <svg className={`h-12 w-12 mb-4 transition-colors ${isDragging ? "text-primary" : "text-muted"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
               </svg>
               <p className="text-foreground font-semibold mb-1">Dosya seçin veya sürükleyin</p>
               <p className="text-xs text-muted text-center max-w-[250px]">
                 Tüm dosyalar desteklenir. Tarayıcıda (client-side) güvenle işlenir.
               </p>
             </div>

             <div className="flex flex-col border border-border rounded-xl overflow-hidden bg-code-bg h-[300px]">
               <div className="bg-sidebar border-b border-border px-4 py-2 flex items-center justify-between">
                 <span className="text-xs font-mono text-muted">Data URI (Base64)</span>
                 <CopyButton text={rawFileBase64} size="sm" label="Kopyala" />
               </div>
               
               {fileDataUri ? (
                 <div className="flex-1 flex flex-col p-4 overflow-hidden">
                    <div className="mb-3 text-sm font-semibold text-foreground truncate">{fileName}</div>
                    
                    {fileDataUri.startsWith("data:image") ? (
                      <div className="flex-1 bg-black/5 dark:bg-white/5 rounded-lg border border-border flex items-center justify-center p-2 mb-3 overflow-hidden">
                         {/* eslint-disable-next-line @next/next/no-img-element */}
                         <img src={fileDataUri} alt="Preview" className="max-w-full max-h-full object-contain rounded-md" />
                      </div>
                    ) : (
                      <textarea
                        value={rawFileBase64}
                        readOnly
                        className="flex-1 w-full bg-transparent font-mono text-xs text-muted outline-none resize-none mb-3 break-all"
                        spellCheck={false}
                      />
                    )}
                 </div>
               ) : (
                 <div className="flex-1 flex items-center justify-center text-muted text-sm p-4 text-center">
                   Dosya yüklendiğinde Base64 çıktısı burada görünecek.
                 </div>
               )}
             </div>
          </div>
        )}

        {/* Stats Footer */}
        {stats && (
          <div className="flex items-center gap-6 px-2 py-1 text-xs text-muted font-mono animate-in fade-in">
             <div className="flex items-center gap-2">
               <span className="text-foreground">Karakter:</span> {stats.charCount}
             </div>
             <div className="flex items-center gap-2">
               <span className="text-foreground">Yaklaşık Boyut:</span> {stats.formattedSize}
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
