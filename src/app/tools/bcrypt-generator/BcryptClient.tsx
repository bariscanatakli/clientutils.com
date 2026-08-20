"use client";

import { useState } from "react";
import { Copy, Check, Lock, ShieldCheck, ShieldAlert } from "lucide-react";
import bcrypt from "bcryptjs";

export default function BcryptClient() {
  const [activeTab, setActiveTab] = useState<"hash" | "verify">("hash");

  // Hash State
  const [textToHash, setTextToHash] = useState("");
  const [saltRounds, setSaltRounds] = useState(10);
  const [hashedResult, setHashedResult] = useState("");
  const [isHashing, setIsHashing] = useState(false);
  const [hashCopied, setHashCopied] = useState(false);

  // Verify State
  const [verifyText, setVerifyText] = useState("");
  const [verifyHash, setVerifyHash] = useState("");
  const [verifyResult, setVerifyResult] = useState<boolean | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleHash = async () => {
    if (!textToHash) return;
    setIsHashing(true);
    // Use setTimeout to allow UI to render "isHashing" state before blocking sync operation
    setTimeout(() => {
      try {
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(textToHash, salt);
        setHashedResult(hash);
      } catch {
        setHashedResult("Error generating hash");
      } finally {
        setIsHashing(false);
      }
    }, 50);
  };

  const handleVerify = () => {
    if (!verifyText || !verifyHash) return;
    setIsVerifying(true);
    setTimeout(() => {
      try {
        const isValid = bcrypt.compareSync(verifyText, verifyHash);
        setVerifyResult(isValid);
      } catch {
        setVerifyResult(false);
      } finally {
        setIsVerifying(false);
      }
    }, 50);
  };

  const copyHash = async () => {
    if (!hashedResult || hashedResult.startsWith("Error")) return;
    await navigator.clipboard.writeText(hashedResult);
    setHashCopied(true);
    setTimeout(() => setHashCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex p-1 space-x-1 bg-muted rounded-xl">
        <button
          onClick={() => setActiveTab("hash")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${
            activeTab === "hash" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Lock className="w-4 h-4" />
          Generate Hash
        </button>
        <button
          onClick={() => setActiveTab("verify")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${
            activeTab === "verify" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Verify Hash
        </button>
      </div>

      {activeTab === "hash" && (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">String to Hash</label>
              <textarea
                value={textToHash}
                onChange={(e) => setTextToHash(e.target.value)}
                placeholder="Enter string to hash..."
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[100px] resize-y"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Salt Rounds (Cost)</label>
                <span className="text-sm font-mono bg-muted px-2 py-1 rounded-md">{saltRounds}</span>
              </div>
              <input
                type="range"
                min="4"
                max="14"
                value={saltRounds}
                onChange={(e) => setSaltRounds(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <p className="text-xs text-muted-foreground">
                Higher rounds increase security but take exponentially longer to compute. 10 is standard.
              </p>
            </div>
            
            <button 
              onClick={handleHash} 
              disabled={!textToHash || isHashing} 
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md font-medium transition-colors disabled:opacity-50"
            >
              {isHashing ? "Hashing..." : "Generate Bcrypt Hash"}
            </button>
          </div>

          {hashedResult && (
            <div className="pt-4 border-t border-border space-y-4">
              <label className="block text-sm font-medium">Result Hash</label>
              <div className="relative">
                <textarea
                  readOnly
                  value={hashedResult}
                  className="w-full rounded-md border border-input bg-muted/50 px-3 py-4 text-sm font-mono shadow-sm min-h-[80px] break-all pr-24"
                />
                <button
                  onClick={copyHash}
                  className="absolute right-2 top-2 flex items-center gap-2 px-3 py-1.5 bg-background hover:bg-muted text-foreground border border-border rounded-md text-xs font-medium transition-colors"
                >
                  {hashCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {hashCopied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "verify" && (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Original String</label>
              <input
                type="text"
                value={verifyText}
                onChange={(e) => {
                  setVerifyText(e.target.value);
                  setVerifyResult(null);
                }}
                placeholder="Enter the original text..."
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Bcrypt Hash</label>
              <textarea
                value={verifyHash}
                onChange={(e) => {
                  setVerifyHash(e.target.value);
                  setVerifyResult(null);
                }}
                placeholder="Enter the bcrypt hash (starts with $2a$, $2b$, or $2y$)..."
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm font-mono shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[80px]"
              />
            </div>
            
            <button 
              onClick={handleVerify} 
              disabled={!verifyText || !verifyHash || isVerifying} 
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md font-medium transition-colors disabled:opacity-50"
            >
              {isVerifying ? "Verifying..." : "Verify Match"}
            </button>
          </div>

          {verifyResult !== null && (
            <div className={`mt-6 p-4 rounded-lg flex items-center gap-3 border ${
              verifyResult ? "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400" : "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400"
            }`}>
              {verifyResult ? (
                <ShieldCheck className="h-6 w-6" />
              ) : (
                <ShieldAlert className="h-6 w-6" />
              )}
              <div className="flex flex-col">
                <span className="font-semibold text-base">
                  {verifyResult ? "Match Verified!" : "No Match!"}
                </span>
                <span className="text-sm opacity-90">
                  {verifyResult ? "The string matches the hash perfectly." : "The string does not match the provided hash."}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
