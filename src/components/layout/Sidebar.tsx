"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TOOL_CATEGORIES, TOOLS, searchTools } from "@/lib/constants/tools";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function Sidebar() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return null;
    return searchTools(searchQuery);
  }, [searchQuery]);

  const isActive = (path: string) => pathname === path;

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <Link href="/" className="flex px-6 py-6 select-none group pressable items-center justify-center lg:justify-start">
          <div className="flex items-baseline">
            <span className="text-2xl font-light tracking-tight text-foreground transition-colors">
              client
            </span>
            <span className="text-2xl font-bold tracking-tighter text-primary transition-colors">
              utils
            </span>
          </div>
      </Link>

      {/* Search */}
      <div className="px-3 pb-3">
        <div className="relative">
          <svg
            className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <input
            id="sidebar-search"
            type="text"
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-input py-1.5 pl-8 pr-3
                       text-xs text-foreground placeholder:text-muted
                       transition-colors duration-150
                       focus:border-input-focus focus:outline-none"
          />
        </div>
      </div>

      {/* Tool list */}
      <nav className="flex-1 overflow-y-auto px-2 pb-4" aria-label="Tools navigation">
        {filteredTools ? (
          /* Search results */
          <div>
            <p className="px-2 pb-1.5 text-[10px] font-medium uppercase tracking-wider text-muted">
              {filteredTools.length} result{filteredTools.length !== 1 ? "s" : ""}
            </p>
            <ul className="space-y-0.5">
              {filteredTools.map((tool) => (
                <li key={tool.id}>
                  <Link
                    href={tool.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium
                      transition-colors duration-150
                      ${
                        isActive(tool.path)
                          ? "bg-sidebar-active text-sidebar-active-text"
                          : "text-sidebar-foreground hover:bg-sidebar-hover"
                      }`}
                  >
                    <span className="text-sm leading-none shrink-0 w-5 flex justify-center whitespace-nowrap">{tool.icon}</span>
                    <span className="truncate flex-1">{tool.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          /* Categories */
          <div className="space-y-4">
            {TOOL_CATEGORIES.map((category) => {
              const tools = TOOLS.filter((t) => t.category === category.id);
              if (tools.length === 0) return null;
              return (
                <div key={category.id}>
                  <p className="flex items-center gap-1.5 px-2 pb-1.5 text-[10px] font-medium uppercase tracking-wider text-muted">
                    <span>{category.icon}</span>
                    <span>{category.nameEn}</span>
                  </p>
                  <ul className="space-y-0.5">
                    {tools.map((tool) => (
                      <li key={tool.id}>
                        <Link
                          href={tool.path}
                          onClick={() => setMobileOpen(false)}
                          className={`group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium
                            transition-colors duration-150
                            ${
                              isActive(tool.path)
                                ? "bg-sidebar-active text-sidebar-active-text"
                                : "text-sidebar-foreground hover:bg-sidebar-hover"
                            }`}
                        >
                          <span className="text-sm leading-none shrink-0 w-5 flex justify-center whitespace-nowrap">{tool.icon}</span>
                          <span className="truncate flex-1">{tool.name}</span>
                          {tool.isNew && (
                            <span className="ml-auto shrink-0 rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-semibold text-primary">
                              NEW
                            </span>
                          )}
                          {tool.isPopular && !tool.isNew && (
                            <span className="ml-auto shrink-0 rounded-full bg-warning/10 px-1.5 py-0.5 text-[9px] font-semibold text-warning">
                              HOT
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </nav>

      {/* Footer controls */}
      <div className="border-t border-border px-3 py-3">
        <div className="flex items-center justify-between">
          <ThemeToggle />
          <a
            href="https://github.com/clientutils"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs text-muted
                       hover:bg-sidebar-hover hover:text-sidebar-foreground
                       transition-colors duration-150"
            aria-label="GitHub repository"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        id="mobile-menu-toggle"
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed left-3 top-3 z-50 flex h-10 w-10 items-center justify-center
                   rounded-xl glass lg:hidden"
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
      >
        <div className="flex flex-col gap-1">
          <span
            className="block h-0.5 w-4 rounded-full bg-foreground"
            style={{
              transform: mobileOpen ? "rotate(45deg) translateY(3px)" : "none",
              transition: "transform 200ms cubic-bezier(0.23,1,0.32,1)",
            }}
          />
          <span
            className="block h-0.5 w-4 rounded-full bg-foreground"
            style={{
              opacity: mobileOpen ? 0 : 1,
              transition: "opacity 150ms cubic-bezier(0.23,1,0.32,1)",
            }}
          />
          <span
            className="block h-0.5 w-4 rounded-full bg-foreground"
            style={{
              transform: mobileOpen ? "rotate(-45deg) translateY(-3px)" : "none",
              transition: "transform 200ms cubic-bezier(0.23,1,0.32,1)",
            }}
          />
        </div>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          style={{
            animation: "fade-in 200ms cubic-bezier(0.23,1,0.32,1) both",
          }}
        />
      )}

      {/* Mobile sidebar (Apple: slide in with drawer curve) */}
      <aside
        className="fixed inset-y-0 left-0 z-40 w-64 border-r border-sidebar-border
                   bg-sidebar lg:hidden"
        style={{
          transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 300ms cubic-bezier(0.32,0.72,0,1)",
        }}
        aria-hidden={!mobileOpen}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex lg:w-60 lg:flex-col lg:border-r lg:border-sidebar-border
                   lg:bg-sidebar"
      >
        {sidebarContent}
      </aside>
    </>
  );
}
