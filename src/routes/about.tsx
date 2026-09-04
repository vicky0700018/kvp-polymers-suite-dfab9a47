import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/components/PublicLayout";
import { Card } from "@/components/kit";
import { BUSINESS } from "@/lib/mock-data";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About KVP Polymers LLP — Polymer Manufacturing & Trading" },
      {
        name: "description",
        content:
          "KVP Polymers LLP supplies industrial polymer granules, compounds and masterbatch to manufacturers across India.",
      },
      { property: "og:title", content: "About KVP Polymers LLP" },
      {
        property: "og:description",
        content: "Industrial polymer manufacturing and trading business based in Maharashtra.",
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <PublicLayout>
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <h1 className="text-3xl font-bold text-primary">About {BUSINESS.name}</h1>
        <p className="mt-4 text-base text-muted-foreground">
          {BUSINESS.name} is a polymer manufacturing and trading business supplying raw polymer
          granules, recycled granules, masterbatch and engineering plastic compounds to moulders,
          packaging units and industrial manufacturers across India.
        </p>
        <p className="mt-4 text-base text-muted-foreground">
          Led by {BUSINESS.owner}, the company focuses on consistent material quality, reliable
          dispatch schedules and transparent commercial practices. This platform is our internal
          business management suite covering billing, inventory, purchases, party ledgers and
          reporting.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            ["Quality First", "Batch-tested polymer grades with documented specifications."],
            ["On-Time Supply", "Planned inventory and dispatch from our MIDC facility."],
            ["Transparent Billing", "GST-compliant invoicing and clear ledger statements."],
          ].map(([t, d]) => (
            <div key={t} className="card p-5">
              <h2 className="text-base font-semibold text-foreground">{t}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>

        <Card className="mt-10 p-6" title="Business details">
          <dl className="grid gap-4 p-1 sm:grid-cols-2">
            {[
              ["Business Name", BUSINESS.name],
              ["Owner", BUSINESS.owner],
              ["Business Type", BUSINESS.type],
              ["Phone", BUSINESS.phone],
              ["Address", BUSINESS.address],
              ["GSTIN", BUSINESS.gstin],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {k}
                </dt>
                <dd className="text-sm font-medium text-foreground">{v}</dd>
              </div>
            ))}
          </dl>
        </Card>
      </div>
    </PublicLayout>
  );
}
