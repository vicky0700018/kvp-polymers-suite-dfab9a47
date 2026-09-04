import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { BUSINESS } from "@/lib/mock-data";
import { Button, cx } from "./kit";

const LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Products", to: "/products" },
  { label: "Services", to: "/services" },
  { label: "Contact", to: "/contact" },
];

export function PublicLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              KVP
            </span>
            <span className="text-base font-bold text-primary">{BUSINESS.name}</span>
          </Link>

          <nav className="ml-auto hidden items-center gap-1 md:flex">
            {LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                activeProps={{ className: "text-secondary font-semibold" }}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
            <Link to="/admin/login" className="ml-2">
              <Button size="sm">Admin Login</Button>
            </Link>
          </nav>

          <button
            className="ml-auto rounded-md border border-border px-3 py-1.5 text-sm md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>

        <div className={cx("border-t border-border md:hidden", open ? "block" : "hidden")}>
          <div className="space-y-1 px-4 py-3">
            {LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
              >
                {l.label}
              </Link>
            ))}
            <Link to="/admin/login" onClick={() => setOpen(false)} className="block pt-1">
              <Button size="sm" className="w-full">
                Admin Login
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-16 bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
          <div>
            <p className="text-lg font-bold">{BUSINESS.name}</p>
            <p className="mt-2 max-w-sm text-sm text-primary-foreground/70">
              Business management and industrial polymer solutions — billing, inventory,
              purchases and reporting in one platform.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide">Quick Links</p>
            <ul className="mt-3 space-y-2 text-sm text-primary-foreground/75">
              {LINKS.filter((l) => l.label !== "Services").map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:text-primary-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/admin/login" className="hover:text-primary-foreground">
                  Admin Login
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="font-semibold text-accent">
                  Admin Panel
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide">Contact</p>
            <ul className="mt-3 space-y-2 text-sm text-primary-foreground/75">
              <li>Owner: {BUSINESS.owner}</li>
              <li>Phone: {BUSINESS.phone}</li>
              <li>{BUSINESS.address}</li>
              <li>GSTIN: {BUSINESS.gstin}</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-foreground/15 px-4 py-4 text-center text-xs text-primary-foreground/60">
          © {new Date().getFullYear()} {BUSINESS.name}. Demo business management software.
        </div>
      </footer>
    </div>
  );
}
