"use client";

import { useState, useEffect, useCallback } from "react";
import { Copy, RefreshCw, Check } from "lucide-react";
import { CopyState } from "@/types/tools";

const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

export default function PasswordGeneratorClient() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [useUppercase, setUseUppercase] = useState(true);
  const [useLowercase, setUseLowercase] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [copyState, setCopyState] = useState<CopyState>({ copied: false, text: "" });

  const generatePassword = useCallback(() => {
    let charset = "";
    if (useUppercase) charset += UPPERCASE;
    if (useLowercase) charset += LOWERCASE;
    if (useNumbers) charset += NUMBERS;
    if (useSymbols) charset += SYMBOLS;

    if (charset === "") {
      setPassword("Select at least one character type");
      return;
    }

    let generatedPassword = "";
    const randomValues = new Uint32Array(length);
    window.crypto.getRandomValues(randomValues);

    for (let i = 0; i < length; i++) {
      generatedPassword += charset[randomValues[i] % charset.length];
    }

    setPassword(generatedPassword);
  }, [length, useUppercase, useLowercase, useNumbers, useSymbols]);

  // Generate initial password on mount
  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const handleCopy = async () => {
    if (!password || password.includes("Select at least")) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopyState({ copied: true, text: password });
      setTimeout(() => setCopyState({ copied: false, text: "" }), 2000);
    } catch (err) {
      console.error("Failed to copy password", err);
    }
  };

  const calculateStrength = () => {
    if (password.includes("Select at least")) return { label: "", color: "bg-muted" };
    let entropy = 0;
    let poolSize = 0;
    if (useUppercase) poolSize += 26;
    if (useLowercase) poolSize += 26;
    if (useNumbers) poolSize += 10;
    if (useSymbols) poolSize += 32;

    if (poolSize > 0) {
      entropy = length * Math.log2(poolSize);
    }

    if (entropy < 40) return { label: "Weak", color: "bg-red-500" };
    if (entropy < 60) return { label: "Fair", color: "bg-yellow-500" };
    if (entropy < 80) return { label: "Good", color: "bg-blue-500" };
    return { label: "Strong", color: "bg-green-500" };
  };

  const strength = calculateStrength();

  return (
    <div className="space-y-6">
      {/* Output Section */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full bg-muted/50 rounded-lg border border-input p-4 min-h-[4rem] flex items-center justify-center break-all font-mono text-xl sm:text-2xl text-center">
            {password}
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={handleCopy}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-md font-medium transition-colors disabled:opacity-50"
              disabled={password.includes("Select at least")}
            >
              {copyState.copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copyState.copied ? "Copied" : "Copy"}
            </button>
            <button 
              onClick={generatePassword} 
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md font-medium transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Generate
            </button>
          </div>
        </div>

        {/* Strength Indicator */}
        <div className="mt-6 flex items-center gap-4">
          <div className="text-sm font-medium text-muted-foreground w-16">
            Strength
          </div>
          <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden flex">
            <div
              className={`h-full transition-all duration-300 ${strength.color}`}
              style={{
                width:
                  strength.label === "Weak" ? "25%" :
                  strength.label === "Fair" ? "50%" :
                  strength.label === "Good" ? "75%" :
                  strength.label === "Strong" ? "100%" : "0%"
              }}
            />
          </div>
          <div className={`text-sm font-semibold w-16 text-right ${
             strength.label === "Weak" ? "text-red-500" :
             strength.label === "Fair" ? "text-yellow-500" :
             strength.label === "Good" ? "text-blue-500" :
             strength.label === "Strong" ? "text-green-500" : "text-muted-foreground"
          }`}>
            {strength.label}
          </div>
        </div>
      </div>

      {/* Settings Section */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-6">
        <h3 className="text-lg font-semibold">Customization</h3>
        
        {/* Length Slider */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Password Length</label>
            <span className="text-lg font-mono bg-muted px-2 py-1 rounded-md">{length}</span>
          </div>
          <input
            type="range"
            min="4"
            max="128"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        <div className="h-px bg-border my-6" />

        {/* Checkboxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={useUppercase}
              onChange={(e) => setUseUppercase(e.target.checked)}
              className="w-5 h-5 rounded border-input text-primary focus:ring-primary accent-primary"
            />
            <div className="flex flex-col">
              <span className="font-medium">Uppercase</span>
              <span className="text-xs text-muted-foreground font-mono">A-Z</span>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={useLowercase}
              onChange={(e) => setUseLowercase(e.target.checked)}
              className="w-5 h-5 rounded border-input text-primary focus:ring-primary accent-primary"
            />
            <div className="flex flex-col">
              <span className="font-medium">Lowercase</span>
              <span className="text-xs text-muted-foreground font-mono">a-z</span>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={useNumbers}
              onChange={(e) => setUseNumbers(e.target.checked)}
              className="w-5 h-5 rounded border-input text-primary focus:ring-primary accent-primary"
            />
            <div className="flex flex-col">
              <span className="font-medium">Numbers</span>
              <span className="text-xs text-muted-foreground font-mono">0-9</span>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={useSymbols}
              onChange={(e) => setUseSymbols(e.target.checked)}
              className="w-5 h-5 rounded border-input text-primary focus:ring-primary accent-primary"
            />
            <div className="flex flex-col">
              <span className="font-medium">Symbols</span>
              <span className="text-xs text-muted-foreground font-mono">!@#$%^&*...</span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
