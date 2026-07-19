import Link from "next/link";
import { TOOL_CATEGORIES, TOOLS } from "@/lib/constants/tools";

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl">
      {/* Hero — Apple: purpose, clarity, hierarchy from weight+size+leading */}
      <section className="pb-10 pt-4 lg:pb-14 lg:pt-8">
        <div className="stagger-children">
          <div className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 mb-4">
            <div className="h-1.5 w-1.5 rounded-full bg-success" />
            <span className="text-xs font-medium text-muted">
              100% Client-Side · No Data Sent to Servers
            </span>
          </div>
          <h1 className="heading-display text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Developer Tools
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              That Respect Your Privacy
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-base text-muted lg:text-lg" style={{ lineHeight: 1.6 }}>
            Free, open-source utilities that run entirely in your browser.
            Format JSON, decode JWTs, generate UUIDs, test regex, and more —
            your data never leaves your machine.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/tools/json-formatter"
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium
                         text-primary-foreground hover:bg-primary-hover
                         transition-colors duration-150"
            >
              Try JSON Formatter
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              href="#tools"
              className="inline-flex h-10 items-center rounded-xl border border-border px-5 text-sm font-medium
                         text-foreground hover:bg-card-hover
                         transition-colors duration-150"
            >
              Browse All Tools
            </Link>
          </div>
        </div>
      </section>

      {/* Tool Grid */}
      <section id="tools" className="pb-16">
        <div className="space-y-10">
          {TOOL_CATEGORIES.map((category) => {
            const tools = TOOLS.filter((t) => t.category === category.id);
            if (tools.length === 0) return null;

            return (
              <div key={category.id}>
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-lg">{category.icon}</span>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
                    {category.nameEn}
                  </h2>
                  <div className="ml-2 h-px flex-1 bg-border" />
                </div>

                {/* Emil: stagger cards 50ms apart */}
                <div className="stagger-children grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {tools.map((tool) => (
                    <Link
                      key={tool.id}
                      href={tool.path}
                      className="hover-lift group relative flex flex-col gap-2 rounded-xl border border-border
                                 bg-card p-4
                                 transition-colors duration-150
                                 hover:border-primary/30 hover:bg-card-hover"
                    >
                      {/* Badges */}
                      {(tool.isNew || tool.isPopular) && (
                        <span
                          className={`absolute right-3 top-3 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase
                            ${
                              tool.isNew
                                ? "bg-primary/10 text-primary"
                                : "bg-warning/10 text-warning"
                            }`}
                        >
                          {tool.isNew ? "New" : "Popular"}
                        </span>
                      )}

                      <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-soft text-sm">
                          {tool.icon}
                        </span>
                        <h3 className="text-sm font-semibold text-card-foreground">
                          {tool.name}
                        </h3>
                      </div>
                      <p className="text-xs leading-relaxed text-muted">
                        {tool.shortDescription}
                      </p>

                      {/* Arrow — Emil: reveal on hover with opacity, not position */}
                      <div
                        className="mt-auto flex items-center gap-1 pt-2 text-[11px] font-medium text-primary"
                        style={{
                          opacity: 0.6,
                          transition: "opacity 150ms cubic-bezier(0.23,1,0.32,1)",
                        }}
                      >
                        <span>Open tool</span>
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Privacy Section */}
      <section className="border-t border-border py-12">
        <div className="stagger-children mx-auto max-w-2xl text-center">
          <h2 className="text-lg font-semibold text-foreground">
            🔒 Privacy First
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Every tool runs entirely in your browser using client-side JavaScript.
            Your JSON, JWT tokens, SQL queries, and passwords are never transmitted
            to any server. We don&apos;t collect, store, or even see your data.
          </p>
          <div className="mt-6 inline-flex items-center gap-4 rounded-xl border border-border bg-card px-6 py-3 text-xs text-muted">
            <span>✓ No server processing</span>
            <span className="h-3 w-px bg-border" />
            <span>✓ No data collection</span>
            <span className="h-3 w-px bg-border" />
            <span>✓ Open source</span>
          </div>
        </div>
      </section>
    </div>
  );
}
