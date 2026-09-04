import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PublicLayout } from "@/components/PublicLayout";
import { Badge, Input, Select, TableWrap, Td, Th, EmptyState, Card } from "@/components/kit";
import { CATEGORIES, products } from "@/lib/mock-data";
import { inr } from "@/lib/format";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Polymer Products — PP, HDPE, PVC & Masterbatch | KVP Polymers LLP" },
      {
        name: "description",
        content:
          "Browse polymer granules, PVC resin, masterbatch and engineering plastic compounds supplied by KVP Polymers LLP.",
      },
      { property: "og:title", content: "Polymer Products | KVP Polymers LLP" },
      {
        property: "og:description",
        content: "PP, HDPE, LDPE, PVC, ABS granules, masterbatch and industrial compounds.",
      },
    ],
  }),
  component: PublicProducts,
});

function PublicProducts() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");

  const list = products.filter(
    (p) =>
      (cat === "All" || p.category === cat) &&
      (p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.sku.toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <PublicLayout>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <h1 className="text-3xl font-bold text-primary">Our Polymer Products</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          Industrial grade polymer raw materials, recycled granules, masterbatch and engineering
          plastic compounds available in Kg, Bag and MT packing.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Input
            placeholder="Search products or SKU…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="max-w-xs"
          />
          <Select value={cat} onChange={(e) => setCat(e.target.value)} className="max-w-xs">
            <option value="All">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </Select>
        </div>

        <Card className="mt-6">
          {list.length === 0 ? (
            <EmptyState message="No products match your search." />
          ) : (
            <TableWrap>
              <thead>
                <tr>
                  <Th>Product</Th>
                  <Th>SKU</Th>
                  <Th>Category</Th>
                  <Th>Unit</Th>
                  <Th right>Price</Th>
                  <Th>Availability</Th>
                </tr>
              </thead>
              <tbody>
                {list.map((p) => (
                  <tr key={p.id}>
                    <Td className="font-medium">{p.name}</Td>
                    <Td>{p.sku}</Td>
                    <Td>{p.category}</Td>
                    <Td>{p.unit}</Td>
                    <Td right>{inr(p.sellingPrice)}</Td>
                    <Td>
                      <Badge tone={p.stock > 0 ? "success" : "danger"}>
                        {p.stock > 0 ? "In Stock" : "On Order"}
                      </Badge>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </TableWrap>
          )}
        </Card>
      </div>
    </PublicLayout>
  );
}
