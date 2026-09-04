import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero-polymer.jpg";
import { PublicLayout } from "@/components/PublicLayout";
import { Button, Card } from "@/components/kit";
import { BUSINESS, products } from "@/lib/mock-data";
import { inr } from "@/lib/format";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KVP Polymers LLP — Smart Business Management Software" },
      {
        name: "description",
        content:
          "Manage billing, inventory, sales, purchases, customers and business reports for KVP Polymers LLP from one powerful platform.",
      },
      { property: "og:title", content: "KVP Polymers LLP — Smart Business Management" },
      {
        property: "og:description",
        content: "Billing, inventory and accounting suite for polymer manufacturing and trading.",
      },
    ],
  }),
  component: Home,
});

const FEATURES = [
  ["Billing & Invoicing", "GST-ready invoices with automatic tax, discount and balance calculation."],
  ["Inventory Control", "Live stock levels, low-stock alerts and stock adjustment entries."],
  ["Purchase Management", "Record supplier bills, payments made and payable balances."],
  ["Parties & Ledger", "Customer and supplier master with running debit/credit ledger."],
  ["Payments", "Track cash, bank transfer, UPI and cheque receipts and payments."],
  ["Business Reports", "Sales, purchase, stock, outstanding and profit & loss reports."],
];

function Home() {
  return (
    <PublicLayout>
      <section className="border-b border-border bg-surface">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:py-16">
          <div>
            <span className="inline-flex items-center rounded-full bg-secondary-soft px-3 py-1 text-xs font-semibold text-secondary">
              Polymer Manufacturing & Trading
            </span>
            <h1 className="mt-4 text-3xl font-bold leading-tight text-primary sm:text-4xl lg:text-5xl">
              Smart Business Management for {BUSINESS.name}
            </h1>
            <p className="mt-4 max-w-xl text-base text-muted-foreground">
              Manage billing, inventory, sales, purchases, customers and business reports from one
              simple and powerful platform.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/admin/login">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link to="/admin/login">
                <Button size="lg" variant="outline">
                  Admin Login
                </Button>
              </Link>
            </div>
            <dl className="mt-9 grid grid-cols-3 gap-4 border-t border-border pt-6">
              {[
                ["126", "Products"],
                ["18+", "Years Experience"],
                ["250+", "Business Clients"],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="text-xl font-bold text-secondary">{v}</dt>
                  <dd className="text-xs text-muted-foreground">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border shadow-pop">
            <img
              src={hero}
              alt="Polymer granules being processed on a modern manufacturing line"
              className="h-64 w-full object-cover sm:h-80 lg:h-[26rem]"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-bold text-primary">Everything your business needs</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          A complete management suite built around the daily workflow of a polymer manufacturing and
          trading business.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(([title, text]) => (
            <div key={title} className="card p-5">
              <h3 className="text-base font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-2xl font-bold text-primary">Featured polymer products</h2>
            <Link to="/products">
              <Button variant="outline" size="sm">
                View all products
              </Button>
            </Link>
          </div>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 4).map((p) => (
              <div key={p.id} className="card p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                  {p.category}
                </p>
                <h3 className="mt-1 text-sm font-semibold text-foreground">{p.name}</h3>
                <p className="mt-2 text-lg font-bold text-primary">
                  {inr(p.sellingPrice)}
                  <span className="text-xs font-normal text-muted-foreground"> / {p.unit}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <Card className="p-7 text-center">
          <h2 className="text-2xl font-bold text-primary">Ready to explore the demo?</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
            Sign in to the admin panel to try invoicing, inventory, ledger and reports with sample
            business data.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/admin/login">
              <Button size="lg">Open Admin Panel</Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline">
                Contact Us
              </Button>
            </Link>
          </div>
        </Card>
      </section>
    </PublicLayout>
  );
}
