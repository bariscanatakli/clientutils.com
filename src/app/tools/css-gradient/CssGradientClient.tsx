"use client";

import { useState, useMemo } from "react";
import { GradientConfig, GradientType, generateGradientCSS, generateTailwindClass } from "@/lib/tools/css-gradient";
import { CopyButton } from "@/components/ui/CopyButton";

export function CssGradientClient() {
  const [config, setConfig] = useState<GradientConfig>({
    type: "linear",
    angle: 90,
    shape: "circle",
    position: "center",
    stops: [
      { id: "1", color: "#4f46e5", position: 0 },
      { id: "2", color: "#ec4899", position: 100 }
    ]
  });

  const cssString = useMemo(() => generateGradientCSS(config), [config]);
  const tailwindString = useMemo(() => generateTailwindClass(config), [config]);

  const updateStopColor = (id: string, color: string) => {
    setConfig(prev => ({
      ...prev,
      stops: prev.stops.map(s => s.id === id ? { ...s, color } : s)
    }));
  };

  const updateStopPosition = (id: string, position: number) => {
    setConfig(prev => ({
      ...prev,
      stops: prev.stops.map(s => s.id === id ? { ...s, position } : s)
    }));
  };

  const addStop = () => {
    if (config.stops.length >= 5) return; // Limit to 5 for simplicity
    const newId = Math.random().toString(36).substr(2, 9);
    setConfig(prev => ({
      ...prev,
      stops: [...prev.stops, { id: newId, color: "#ffffff", position: 50 }]
    }));
  };

  const removeStop = (id: string) => {
    if (config.stops.length <= 2) return; // Minimum 2 stops required
    setConfig(prev => ({
      ...prev,
      stops: prev.stops.filter(s => s.id !== id)
    }));
  };

  // Generate background style for the visual slider track
  const sliderTrackBackground = useMemo(() => {
    const sorted = [...config.stops].sort((a, b) => a.position - b.position);
    const stopsStr = sorted.map(s => `${s.color} ${s.position}%`).join(", ");
    return `linear-gradient(to right, ${stopsStr})`;
  }, [config.stops]);

  return (
    <div className="stagger-children max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">CSS Gradient Generator</h1>
          <p className="text-sm text-muted mt-2">
            Create beautiful linear, radial, and conic gradients. Export to CSS and Tailwind.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        {/* Left: Preview & Editor */}
        <div className="space-y-6">
           {/* Preview Area */}
           <div 
             className="w-full h-[300px] md:h-[400px] rounded-xl border border-border shadow-inner transition-all duration-300 relative overflow-hidden flex items-end justify-end p-4"
             style={{ background: cssString }}
           >
              {/* Optional: Add a subtle overlay grid or glass effect box here for design points */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl text-white font-mono text-sm shadow-xl">
                 Preview
              </div>
           </div>

           {/* Stops Editor */}
           <div className="bg-card border border-border rounded-xl p-5 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Color Stops</h3>
                <button 
                  onClick={addStop} 
                  disabled={config.stops.length >= 5}
                  className="text-xs bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 rounded-lg font-semibold transition-colors disabled:opacity-50 pressable"
                >
                  + Add Color
                </button>
              </div>

              {/* Visual Slider */}
              <div className="relative h-8 rounded-lg mb-8 mx-3 border border-border/50" style={{ background: sliderTrackBackground }}>
                {config.stops.map((stop) => (
                   <div 
                     key={stop.id}
                     className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-2 border-white shadow-md cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
                     style={{ left: `${stop.position}%`, backgroundColor: stop.color }}
                     title={`${stop.position}%`}
                   />
                ))}
              </div>

              {/* Stop Controls */}
              <div className="space-y-3">
                 {[...config.stops].sort((a,b) => a.position - b.position).map((stop) => (
                   <div key={stop.id} className="flex items-center gap-3 bg-input border border-border rounded-lg p-2 group">
                      <div className="h-8 w-8 rounded-md border border-border overflow-hidden relative shrink-0">
                         <input 
                           type="color" 
                           value={stop.color} 
                           onChange={(e) => updateStopColor(stop.id, e.target.value)}
                           className="absolute -inset-2 w-16 h-16 cursor-pointer"
                         />
                      </div>
                      <input 
                        type="text" 
                        value={stop.color.toUpperCase()} 
                        onChange={(e) => updateStopColor(stop.id, e.target.value)}
                        className="w-24 bg-transparent font-mono text-xs text-foreground outline-none border-b border-transparent focus:border-primary px-1"
                      />
                      <input 
                        type="range" 
                        min="0" max="100" 
                        value={stop.position} 
                        onChange={(e) => updateStopPosition(stop.id, parseInt(e.target.value))}
                        className="flex-1 accent-primary"
                      />
                      <span className="w-10 text-right font-mono text-xs text-muted">{stop.position}%</span>
                      
                      <button 
                        onClick={() => removeStop(stop.id)}
                        disabled={config.stops.length <= 2}
                        className="p-1.5 text-danger/50 hover:text-danger hover:bg-danger/10 rounded-md transition-colors disabled:opacity-30"
                      >
                         <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Right: Settings & Code */}
        <div className="space-y-6">
           {/* Settings Panel */}
           <div className="bg-card border border-border rounded-xl p-5 space-y-5">
              <h3 className="text-sm font-semibold text-foreground">Settings</h3>
              
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted uppercase tracking-wider">Type</label>
                <div className="flex bg-input border border-border rounded-lg p-1">
                   {(["linear", "radial", "conic"] as GradientType[]).map(t => (
                     <button
                       key={t}
                       onClick={() => setConfig(prev => ({ ...prev, type: t }))}
                       className={`flex-1 py-1.5 text-xs font-semibold capitalize rounded-md transition-all ${config.type === t ? "bg-card shadow-sm text-foreground" : "text-muted hover:text-foreground"}`}
                     >
                       {t}
                     </button>
                   ))}
                </div>
              </div>

              {(config.type === "linear" || config.type === "conic") && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                     <label className="text-xs font-semibold text-muted uppercase tracking-wider">Angle</label>
                     <span className="text-xs font-mono text-foreground">{config.angle}°</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" max="360" 
                    value={config.angle} 
                    onChange={(e) => setConfig(prev => ({ ...prev, angle: parseInt(e.target.value) }))}
                    className="w-full accent-primary"
                  />
                </div>
              )}

              {config.type === "radial" && (
                <>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted uppercase tracking-wider">Shape</label>
                    <select 
                      value={config.shape} 
                      onChange={(e) => setConfig(prev => ({ ...prev, shape: e.target.value as GradientConfig["shape"] }))}
                      className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:ring-1 focus:ring-primary outline-none"
                    >
                      <option value="circle">Circle</option>
                      <option value="ellipse">Ellipse</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted uppercase tracking-wider">Position</label>
                    <select 
                      value={config.position} 
                      onChange={(e) => setConfig(prev => ({ ...prev, position: e.target.value }))}
                      className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:ring-1 focus:ring-primary outline-none"
                    >
                      <option value="center">Center</option>
                      <option value="top">Top</option>
                      <option value="bottom">Bottom</option>
                      <option value="left">Left</option>
                      <option value="right">Right</option>
                      <option value="top left">Top Left</option>
                      <option value="top right">Top Right</option>
                      <option value="bottom left">Bottom Left</option>
                      <option value="bottom right">Bottom Right</option>
                    </select>
                  </div>
                </>
              )}
           </div>

           {/* Output Code Panel */}
           <div className="bg-code-bg border border-border rounded-xl overflow-hidden flex flex-col">
              <div className="bg-sidebar border-b border-border px-4 py-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">CSS Output</span>
                <CopyButton text={`background: ${cssString};`} size="sm" />
              </div>
              <div className="p-4 font-mono text-xs text-code-foreground break-all bg-transparent">
                 <span className="text-accent">background:</span> {cssString};
              </div>
           </div>

           {/* Tailwind Code Panel */}
           <div className="bg-code-bg border border-border rounded-xl overflow-hidden flex flex-col">
              <div className="bg-sidebar border-b border-border px-4 py-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground flex items-center gap-2">
                  Tailwind CSS 
                  <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded">Beta</span>
                </span>
                <CopyButton text={tailwindString} size="sm" />
              </div>
              <div className="p-4 font-mono text-xs text-code-foreground break-all bg-transparent">
                 {tailwindString.startsWith("/*") ? (
                   <span className="text-muted">{tailwindString}</span>
                 ) : (
                   <span className="text-info">{tailwindString}</span>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
