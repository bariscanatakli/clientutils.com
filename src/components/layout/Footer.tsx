import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border px-4 py-6 lg:px-6">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-2 text-xs text-muted">
          <span>© {new Date().getFullYear()} ClientUtils.</span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">
            All tools run 100% in your browser. No data is ever sent to any server.
          </span>
        </div>
        <nav className="flex items-center gap-4" aria-label="Footer navigation">
          <Link
            href="/"
            className="text-xs text-muted hover:text-foreground transition-colors duration-150"
          >
            Home
          </Link>
          <a
            href="https://github.com/clientutils"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted hover:text-foreground transition-colors duration-150"
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
