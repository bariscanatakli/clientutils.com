"use client";

import { useEffect, useState } from "react";

/**
 * Apple: translucent toolbar that reveals on scroll.
 * Scroll edge effect, not hard divider.
 * Emil: only animate transform & opacity.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className="sticky top-0 z-30 flex h-16 items-center justify-between border-b
                 px-4 lg:px-6"
      style={{
        borderColor: scrolled ? "var(--border)" : "transparent",
        background: scrolled ? "var(--glass-bg)" : "var(--sidebar)",
        backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
        transition:
          "border-color 250ms cubic-bezier(0.23,1,0.32,1), background 250ms cubic-bezier(0.23,1,0.32,1), backdrop-filter 250ms cubic-bezier(0.23,1,0.32,1)",
      }}
    >
      {/* Left: breadcrumb / page title area */}
      <div className="flex items-center gap-2 pl-12 lg:pl-0">
        <span className="text-sm font-medium text-foreground">Tools</span>
      </div>

      {/* Right: secondary actions */}
      <div className="flex items-center gap-1.5">
        {/* Privacy badge */}
        <div className="hidden items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 sm:flex">
          <div className="h-1.5 w-1.5 rounded-full bg-success" />
          <span className="text-[10px] font-medium text-success">
            100% Client-Side
          </span>
        </div>
      </div>
    </header>
  );
}
