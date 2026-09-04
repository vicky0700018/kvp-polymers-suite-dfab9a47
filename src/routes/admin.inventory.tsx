import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AdminPage } from "@/components/AdminPage";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Field,
  Input,
  Modal,
  PageHeader,
  Select,
  StatCard,
  TableWrap,
  Td,
  Th,
  statusTone,
} from "@/components/kit";
import { dmy, inr } from "@/lib/format";
import type { Product, StockMove } from "@/lib/mock-data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/admin/inventory")({
  head: () => ({
    meta: [
      { title: "Stock & Inventory — KVP Polymers LLP" },
      { name: "description", content: "Track polymer stock levels and record stock adjustments." },
      { property: "og:title", content: "Stock & Inventory — KVP Polymers LLP" },
      { property: "og:description", content: "Stock in, stock out and adjustment history." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <AdminPage>
      <InventoryPage />
    </AdminPage>
  ),
});

const stockLabel = (p: Product) =>
  p.stock <= 0 ? "Out of Stock" : p.stock < p.minStock ? "Low Stock" : "In Stock";

function InventoryPage() {
  const { products, stockMoves, adjustStock } = useStore();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("All");
  const [adjust, setAdjust] = useState<{
    productId: string;
    type: StockMove["type"];
    qty: number;
    reason: string;
  } | null>(null);
  const [error, setError] = useState("");

  const rows = useMemo(
    () =>
      products.filter(
        (p) =>
          (p.name + p.sku).toLowerCase().includes(q.toLowerCase().trim()) &&
          (filter === "All" || stockLabel(p) === filter),
      ),
    [products, q, filter],
  );

  const stockValue = products.reduce((s, p) => s + p.stock * p.purchasePrice, 0);
  const totalIn = stockMoves.filter((m) => m.qty > 0).reduce((s, m) => s + m.qty, 0);
  const totalOut = stockMoves.filter((m) => m.qty < 0).reduce((s, m) => s - m.qty, 0);

  const submitAdjust = () => {
    if (!adjust) return;
    if (!adjust.productId) return setError("Select a product");
    if (!adjust.qty || adjust.qty <= 0) return setError("Enter a quantity greater than 0");
    adjustStock(
      adjust.productId,
      adjust.type,
      adjust.type === "Stock Out" ? adjust.qty : adjust.qty,
      adjust.reason.trim() || "Manual adjustment",
    );
    setAdjust(null);
    setError("");
  };

  return (
    <div>
      <PageHeader
        title="Stock & Inventory"
        subtitle="Live polymer stock position with adjustment history"
        action={
          <div className="flex flex-wrap gap-2">
            <Link to="/admin/products">
              <Button variant="outline">Manage Products</Button>
            </Link>
            <Button
              onClick={() => {
                setError("");
                setAdjust({
                  productId: products[0]?.id ?? "",
                  type: "Stock In",
                  qty: 0,
                  reason: "",
                });
              }}
            >
              + Stock Adjustment
            </Button>
          </div>
        }
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total Products" value={String(products.length)} tone="primary" />
        <StatCard label="Stock Value" value={inr(stockValue)} tone="accent" />
        <StatCard label="Stock In (Qty)" value={totalIn.toLocaleString("en-IN")} tone="success" />
        <StatCard label="Stock Out (Qty)" value={totalOut.toLocaleString("en-IN")} tone="info" />
        <StatCard
          label="Low / Out of Stock"
          value={`${products.filter((p) => p.stock > 0 && p.stock < p.minStock).length} / ${
            products.filter((p) => p.stock <= 0).length
          }`}
          tone="danger"
        />
      </div>

      <Card
        title="Current Stock"
        className="mb-5"
        action={
          <div className="flex flex-wrap gap-2">
            <Input
              placeholder="Search product or SKU…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="sm:w-60"
            />
            <Select value={filter} onChange={(e) => setFilter(e.target.value)} className="sm:w-44">
              <option>All</option>
              <option>In Stock</option>
              <option>Low Stock</option>
              <option>Out of Stock</option>
            </Select>
          </div>
        }
      >
        {rows.length === 0 ? (
          <EmptyState message="No products match this filter." />
        ) : (
          <TableWrap>
            <thead>
              <tr>
                <Th>Product</Th>
                <Th>SKU</Th>
                <Th right>Current Stock</Th>
                <Th right>Min. Stock</Th>
                <Th>Unit</Th>
                <Th right>Stock Value</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className="hover:bg-muted/40">
                  <Td className="font-medium">{p.name}</Td>
                  <Td>{p.sku}</Td>
                  <Td right>{p.stock.toLocaleString("en-IN")}</Td>
                  <Td right>{p.minStock.toLocaleString("en-IN")}</Td>
                  <Td>{p.unit}</Td>
                  <Td right>{inr(p.stock * p.purchasePrice)}</Td>
                  <Td>
                    <Badge tone={statusTone(stockLabel(p))}>{stockLabel(p)}</Badge>
                  </Td>
                  <Td>
                    <div className="flex flex-wrap gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setError("");
                          setAdjust({ productId: p.id, type: "Stock In", qty: 0, reason: "" });
                        }}
                      >
                        Add Stock
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setError("");
                          setAdjust({ productId: p.id, type: "Stock Out", qty: 0, reason: "" });
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        )}
      </Card>

      <Card title="Stock Movement History">
        {stockMoves.length === 0 ? (
          <EmptyState message="No stock movements recorded yet." />
        ) : (
          <TableWrap>
            <thead>
              <tr>
                <Th>Date</Th>
                <Th>Product</Th>
                <Th>Type</Th>
                <Th right>Quantity</Th>
                <Th>Reason</Th>
              </tr>
            </thead>
            <tbody>
              {stockMoves.map((m) => (
                <tr key={m.id} className="hover:bg-muted/40">
                  <Td>{dmy(m.date)}</Td>
                  <Td className="font-medium">{m.productName}</Td>
                  <Td>
                    <Badge
                      tone={
                        m.type === "Stock In" ? "success" : m.type === "Stock Out" ? "info" : "warning"
                      }
                    >
                      {m.type}
                    </Badge>
                  </Td>
                  <Td right className={m.qty < 0 ? "text-danger" : "text-success"}>
                    {m.qty > 0 ? "+" : ""}
                    {m.qty.toLocaleString("en-IN")}
                  </Td>
                  <Td>{m.reason}</Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        )}
      </Card>

      <Modal
        open={!!adjust}
        onClose={() => setAdjust(null)}
        title="Stock Adjustment"
        footer={
          <>
            <Button variant="outline" onClick={() => setAdjust(null)}>
              Cancel
            </Button>
            <Button onClick={submitAdjust}>Save Adjustment</Button>
          </>
        }
      >
        {adjust && (
          <div className="grid gap-4">
            <Field label="Product">
              <Select
                value={adjust.productId}
                onChange={(e) => setAdjust({ ...adjust, productId: e.target.value })}
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.stock.toLocaleString("en-IN")} {p.unit})
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Adjustment Type">
              <Select
                value={adjust.type}
                onChange={(e) =>
                  setAdjust({ ...adjust, type: e.target.value as StockMove["type"] })
                }
              >
                <option>Stock In</option>
                <option>Stock Out</option>
                <option>Adjustment</option>
              </Select>
            </Field>
            <Field label="Quantity" error={error}>
              <Input
                type="number"
                value={adjust.qty}
                onChange={(e) => setAdjust({ ...adjust, qty: Number(e.target.value) })}
              />
            </Field>
            <Field label="Reason">
              <Input
                placeholder="e.g. Damaged bags written off"
                value={adjust.reason}
                onChange={(e) => setAdjust({ ...adjust, reason: e.target.value })}
              />
            </Field>
          </div>
        )}
      </Modal>
    </div>
  );
}
