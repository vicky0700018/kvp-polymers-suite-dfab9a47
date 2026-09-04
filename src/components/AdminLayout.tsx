import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { useStore } from "@/lib/store";
import { Button, cx } from "./kit";

interface Item {
  label: string;
  to: string;
}
interface Group {
  label: string;
  items: Item[];
}

const NAV: Group[] = [
  { label: "Overview", items: [{ label: "Dashboard", to: "/admin/dashboard" }] },
  {
    label: "Sales",
    items: [
      { label: "Invoices", to: "/admin/sales" },
      { label: "Create Invoice", to: "/admin/sales/create" },
      { label: "Payments Received", to: "/admin/payments" },
    ],
  },
  {
    label: "Purchases",
    items: [
      { label: "Purchase Bills", to: "/admin/purchases" },
      { label: "Create Purchase", to: "/admin/purchases/create" },
      { label: "Payments Made", to: "/admin/payments" },
    ],
  },
  {
    label: "Inventory",
    items: [
      { label: "Products", to: "/admin/products" },
      { label: "Stock", to: "/admin/inventory" },
      { label: "Stock Adjustment", to: "/admin/inventory" },
    ],
  },
  {
    label: "Parties",
    items: [
      { label: "Customers", to: "/admin/customers" },
      { label: "Suppliers", to: "/admin/suppliers" },
    ],
  },
  {
    label: "Accounting",
    items: [
      { label: "Ledger", to: "/admin/ledger" },
      { label: "Transactions", to: "/admin/payments" },
    ],
  },
  {
    label: "Reports",
    items: [
      { label: "Sales Report", to: "/admin/reports" },
      { label: "Purchase Report", to: "/admin/reports" },
      { label: "Stock Report", to: "/admin/reports" },
      { label: "Profit & Loss", to: "/admin/reports" },
      { label: "Outstanding Report", to: "/admin/reports" },
    ],
  },
  { label: "System", items: [{ label: "Settings", to: "/admin/settings" }] },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  const { business, adminProfile } = useStore();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const doLogout = () => {
    logout();
    navigate({ to: "/admin/login" });
  };

  const sidebar = (
    <div className="flex h-full flex-col bg-primary text-primary-foreground">
      <div className="flex items-center gap-3 border-b border-primary-foreground/10 px-4 py-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-sm font-bold">
          KVP
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{business.name}</p>
          <p className="text-xs text-primary-foreground/60">Business Suite</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {NAV.map((group) => (
          <div key={group.label} className="mb-4">
            <p className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-primary-foreground/45">
              {group.label}
            </p>
            {group.items.map((item) => {
              const active =
                pathname === item.to ||
                (item.to !== "/admin/dashboard" && pathname.startsWith(item.to + "/"));
              return (
                <Link
                  key={item.label + item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={cx(
                    "mb-0.5 block rounded-md px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-accent font-semibold text-accent-foreground"
                      : "text-primary-foreground/80 hover:bg-primary-foreground/10",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="border-t border-primary-foreground/10 p-3">
        <Link
          to="/admin/settings"
          onClick={() => setOpen(false)}
          className="mb-2 flex items-center gap-3 rounded-md px-2 py-2 hover:bg-primary-foreground/10"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-bold">
            {adminProfile.name.slice(0, 2).toUpperCase()}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium">{adminProfile.name}</span>
            <span className="block truncate text-xs text-primary-foreground/60">
              {adminProfile.email}
            </span>
          </span>
        </Link>
        <button
          onClick={doLogout}
          className="w-full rounded-md border border-primary-foreground/25 px-3 py-2 text-sm font-medium text-primary-foreground/90 hover:bg-primary-foreground/10"
        >
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">{sidebar}</aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/50" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 shadow-pop">{sidebar}</div>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-surface px-4 py-3 sm:px-6">
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="rounded-md border border-border px-3 py-1.5 text-sm lg:hidden"
          >
            ☰
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-primary">{business.name}</p>
            <p className="hidden text-xs text-muted-foreground sm:block">
              Billing, Inventory & Accounting Panel
            </p>
          </div>
          <Link to="/" className="hidden sm:block">
            <Button variant="outline" size="sm">
              View Website
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={doLogout} className="lg:hidden">
            Logout
          </Button>
        </header>

        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
