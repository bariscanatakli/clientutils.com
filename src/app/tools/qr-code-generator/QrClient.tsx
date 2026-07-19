"use client";

import { useState, useRef } from "react";
import { Download, Link as LinkIcon, Smartphone, Wifi, Mail } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

type QrType = "text" | "url" | "wifi" | "email";

export default function QrClient() {
  const [qrType, setQrType] = useState<QrType>("text");
  
  // Content States
  const [text, setText] = useState("https://clientutils.com");
  const [url, setUrl] = useState("https://clientutils.com");
  const [wifiSsid, setWifiSsid] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiEncryption, setWifiEncryption] = useState("WPA");
  const [emailTo, setEmailTo] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");

  // Styling States
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [size, setSize] = useState(256);
  const [level, setLevel] = useState<"L" | "M" | "Q" | "H">("H");
  const [includeMargin, setIncludeMargin] = useState(true);

  const qrRef = useRef<SVGSVGElement>(null);

  // Compute final QR value based on selected type
  const getQrValue = () => {
    switch (qrType) {
      case "url":
        return url;
      case "wifi":
        return `WIFI:T:${wifiEncryption};S:${wifiSsid};P:${wifiPassword};;`;
      case "email":
        return `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      case "text":
      default:
        return text;
    }
  };

  const qrValue = getQrValue();

  const downloadSvg = () => {
    if (!qrRef.current) return;
    const svgData = new XMLSerializer().serializeToString(qrRef.current);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = "qrcode.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPng = () => {
    if (!qrRef.current) return;
    const svgData = new XMLSerializer().serializeToString(qrRef.current);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = size;
      canvas.height = size;
      if (ctx) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = pngFile;
        link.download = "qrcode.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Settings Panel (Left/Top) */}
      <div className="lg:col-span-2 space-y-6">
        {/* Type Selection */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
          <h3 className="font-semibold text-lg">QR Code Type</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: "text", label: "Text", icon: Smartphone },
              { id: "url", label: "URL", icon: LinkIcon },
              { id: "wifi", label: "Wi-Fi", icon: Wifi },
              { id: "email", label: "Email", icon: Mail },
            ].map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setQrType(type.id as QrType)}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                    qrType === type.id
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-background border-border hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5 mb-2" />
                  <span className="text-sm font-medium">{type.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-border mt-4">
            {/* TEXT */}
            {qrType === "text" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Text Content</label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter any text here..."
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[120px]"
                />
              </div>
            )}

            {/* URL */}
            {qrType === "url" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">URL Link</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
            )}

            {/* WIFI */}
            {qrType === "wifi" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Network Name (SSID)</label>
                  <input
                    type="text"
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                    placeholder="My WiFi Network"
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password</label>
                    <input
                      type="password"
                      value={wifiPassword}
                      onChange={(e) => setWifiPassword(e.target.value)}
                      placeholder="secretpassword"
                      className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Encryption</label>
                    <select
                      value={wifiEncryption}
                      onChange={(e) => setWifiEncryption(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="WPA">WPA/WPA2</option>
                      <option value="WEP">WEP</option>
                      <option value="nopass">None</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* EMAIL */}
            {qrType === "email" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Send To</label>
                  <input
                    type="email"
                    value={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                    placeholder="hello@example.com"
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="Subject line"
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Body</label>
                  <textarea
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    placeholder="Email message..."
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[80px]"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Styling Panel */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
          <h3 className="font-semibold text-lg">Design & Colors</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Foreground Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="h-10 w-12 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="flex-1 rounded-md border border-input bg-transparent px-3 py-2 text-sm uppercase font-mono shadow-sm"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Background Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="h-10 w-12 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="flex-1 rounded-md border border-input bg-transparent px-3 py-2 text-sm uppercase font-mono shadow-sm"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Error Correction Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as "L" | "M" | "Q" | "H")}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
              >
                <option value="L">Low (7%)</option>
                <option value="M">Medium (15%)</option>
                <option value="Q">Quartile (25%)</option>
                <option value="H">High (30% - Best for logos)</option>
              </select>
            </div>
            <label className="flex items-center gap-3 pt-6 cursor-pointer">
              <input
                type="checkbox"
                checked={includeMargin}
                onChange={(e) => setIncludeMargin(e.target.checked)}
                className="w-5 h-5 rounded border-input text-primary focus:ring-primary accent-primary"
              />
              <span className="text-sm font-medium">Include Margin</span>
            </label>
          </div>
        </div>
      </div>

      {/* Preview Panel (Right) */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col items-center">
        <h3 className="font-semibold text-lg w-full mb-6">Preview</h3>
        
        <div 
          className="p-4 rounded-xl border border-border shadow-sm mb-8 transition-colors duration-200 flex items-center justify-center bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYNgNwMjAyPAB0Tz/f4Hq8RgGA4MRGAwD12EwDIBmKTAwMMB1GAx8AAA+wE+H/Z10pAAAAABJRU5ErkJggg==')]"
        >
          <div style={{ background: bgColor }} className="p-2 rounded shadow-sm">
            {qrValue ? (
              <QRCodeSVG
                value={qrValue}
                size={220}
                fgColor={fgColor}
                bgColor={bgColor}
                level={level}
                includeMargin={includeMargin}
                ref={qrRef}
              />
            ) : (
              <div className="w-[220px] h-[220px] flex items-center justify-center text-muted-foreground text-sm border-2 border-dashed border-muted">
                Empty
              </div>
            )}
          </div>
        </div>

        <div className="w-full space-y-3">
          <button 
            onClick={downloadPng} 
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md font-medium transition-colors disabled:opacity-50" 
            disabled={!qrValue}
          >
            <Download className="h-4 w-4" />
            Download PNG
          </button>
          <button 
            onClick={downloadSvg} 
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-background hover:bg-muted text-foreground border border-input rounded-md font-medium transition-colors disabled:opacity-50" 
            disabled={!qrValue}
          >
            <Download className="h-4 w-4" />
            Download SVG
          </button>
        </div>
      </div>
    </div>
  );
}
