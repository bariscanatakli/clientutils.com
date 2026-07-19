"use client";

import { useState, useEffect, useMemo } from "react";
import { timestampToDate, dateToTimestamp, detectMilliseconds } from "@/lib/tools/timestamp-converter";
import { CopyButton } from "@/components/ui/CopyButton";

export function TimestampConverterClient() {
  const [currentEpoch, setCurrentEpoch] = useState<number>(Math.floor(Date.now() / 1000));
  
  const [inputEpoch, setInputEpoch] = useState<string>("");
  const [inputDateStr, setInputDateStr] = useState<string>("");

  // Live timer for current epoch
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentEpoch(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Set initial input
  useEffect(() => {
    const now = new Date();
    setInputEpoch(Math.floor(now.getTime() / 1000).toString());
    
    // Format YYYY-MM-DDTHH:mm for datetime-local input
    const pad = (n: number) => n.toString().padStart(2, "0");
    const localDateTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
    setInputDateStr(localDateTime);
  }, []);

  // Handle epoch changes -> update date formats
  const handleEpochChange = (val: string) => {
    setInputEpoch(val);
    const num = parseInt(val, 10);
    if (!isNaN(num)) {
      const res = timestampToDate(num);
      if (res.isValid && res.date) {
        const d = res.date;
        const pad = (n: number) => n.toString().padStart(2, "0");
        const localDateTime = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
        setInputDateStr(localDateTime);
      }
    }
  };

  // Handle date changes -> update epoch
  const handleDateChange = (val: string) => {
    setInputDateStr(val);
    if (val) {
      const d = new Date(val);
      if (!isNaN(d.getTime())) {
        setInputEpoch(dateToTimestamp(d, false).toString());
      }
    }
  };

  const parsedEpoch = parseInt(inputEpoch, 10);
  const result = useMemo(() => timestampToDate(parsedEpoch), [parsedEpoch]);

  return (
    <div className="stagger-children max-w-5xl mx-auto space-y-8">
      {/* Header & Live Tracker */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Unix Timestamp Converter</h1>
          <p className="text-sm text-muted mt-2">
            Convert epoch to human readable dates and vice versa. Zero latency, client-side.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-primary/10 border border-primary/20 rounded-xl px-4 py-3">
          <div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-primary mb-1">Şu Anki Epoch Süresi</div>
            <div className="font-mono text-xl font-bold text-foreground">{currentEpoch}</div>
          </div>
          <button 
             onClick={() => handleEpochChange(currentEpoch.toString())}
             className="ml-2 text-xs font-semibold bg-primary text-primary-foreground px-3 py-1.5 rounded-lg
                        hover:bg-primary-hover active:scale-97 pressable transition-all"
          >
            Ayarla
          </button>
        </div>
      </div>

      {/* Input Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Timestamp Input */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground flex items-center justify-between">
            <span>Unix Timestamp</span>
            {result.isMilliseconds && (
               <span className="text-[10px] font-bold bg-warning/20 text-warning px-2 py-0.5 rounded-md">Milisaniye Algılandı</span>
            )}
          </label>
          <input
            type="number"
            value={inputEpoch}
            onChange={(e) => handleEpochChange(e.target.value)}
            className="w-full font-mono text-lg rounded-xl border border-input-border bg-input px-4 py-3
                       text-foreground transition-colors duration-200
                       focus:border-input-focus focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="e.g. 1689859200"
          />
        </div>

        {/* Date Input */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Tarih Seçici</label>
          <input
            type="datetime-local"
            value={inputDateStr}
            onChange={(e) => handleDateChange(e.target.value)}
            className="w-full font-mono text-lg rounded-xl border border-input-border bg-input px-4 py-3
                       text-foreground transition-colors duration-200
                       focus:border-input-focus focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Results Section */}
      {result.isValid ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <ResultCard label="Yerel Zaman" value={result.formats.local} />
          <ResultCard label="Göreli Zaman (Relative)" value={result.formats.relative} highlight />
          <ResultCard label="ISO 8601" value={result.formats.iso} />
          <ResultCard label="UTC" value={result.formats.utc} />
        </div>
      ) : (
         <div className="text-center py-12 rounded-xl border border-border bg-card">
           <p className="text-muted">Geçerli bir tarih veya timestamp girin.</p>
         </div>
      )}
    </div>
  );
}

function ResultCard({ label, value, highlight = false }: { label: string, value: string, highlight?: boolean }) {
  return (
    <div className={`relative flex flex-col justify-center rounded-xl border p-4 group transition-colors hover:bg-card-hover ${highlight ? "bg-primary-soft border-primary/20" : "bg-card border-border"}`}>
      <span className="text-xs font-semibold text-muted mb-1">{label}</span>
      <span className={`font-mono text-sm sm:text-base ${highlight ? "text-primary font-bold" : "text-foreground"}`}>{value}</span>
      
      <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <CopyButton text={value} size="sm" />
      </div>
    </div>
  );
}
