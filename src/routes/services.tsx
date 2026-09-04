import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/components/PublicLayout";
import { Button } from "@/components/kit";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Polymer Supply & Business Management | KVP Polymers LLP" },
      {
        name: "description",
        content:
          "Polymer trading, custom compounding, recycled granule supply and complete billing, inventory and reporting management.",
      },
      { property: "og:title", content: "Services | KVP Polymers LLP" },
      {
        property: "og:description",
        content: "Polymer supply, compounding, logistics and business management services.",
      },
    ],
  }),
  component: Services,
});

const SERVICES = [
  ["Polymer Trading & Supply", "Bulk supply of PP, HDPE, LDPE, PVC and ABS granules with consistent grade quality."],
  ["Custom Compounding", "Filled and reinforced polymer compounds developed to your application spec."],
  ["Recycled Granules", "Cost-efficient recycled PP and HDPE granules for non-critical applications."],
  ["Masterbatch Supply", "White, black and filler masterbatch in standard bag packing."],
  ["Logistics & Dispatch", "Planned dispatch from MIDC Pune with documentation and e-way bills."],
  ["Business Management Suite", "Digital billing, inventory, party ledger and MIS reporting for the whole business."],
];

function Services() {
  return (
    <PublicLayout>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <h1 className="text-3xl font-bold text-primary">Our Services</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          From raw material supply to complete digital business operations, we cover the full cycle
          of a polymer manufacturing and trading business.
        </p>

        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map(([t, d], i) => (
            <div key={t} className="card p-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary-soft text-sm font-bold text-secondary">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2 className="mt-3 text-base font-semibold text-foreground">{t}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>

        <div className="card mt-10 flex flex-wrap items-center justify-between gap-4 p-6">
          <div>
            <h2 className="text-lg font-bold text-primary">See the management suite in action</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Log in with the demo credentials to explore every module.
            </p>
          </div>
          <Link to="/admin/login">
            <Button>Admin Login</Button>
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}
