import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-20 text-center">
      <div className="stagger-children">
        <p className="text-6xl font-bold text-primary">404</p>
        <h1 className="mt-4 text-xl font-semibold text-foreground">
          Page Not Found
        </h1>
        <p className="mt-2 text-sm text-muted">
          The tool or page you&apos;re looking for doesn&apos;t exist yet.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium
                     text-primary-foreground hover:bg-primary-hover
                     transition-colors duration-150"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Home
        </Link>
      </div>
    </div>
  );
}
