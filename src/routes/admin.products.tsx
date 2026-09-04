import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AdminPage } from "@/components/AdminPage";
import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  Field,
  Input,
  Modal,
  PageHeader,
  Select,
  StatCard,
  TableWrap,
  Td,
  Textarea,
  Th,
  statusTone,
} from "@/components/kit";
import { inr } from "@/lib/format";
import { CATEGORIES, UNITS, type Product } from "@/lib/mock-data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/admin/products")({
  head: () => ({
    meta: [
      { title: "Products — KVP Polymers LLP" },
      { name: "description", content: "Polymer product catalogue with pricing and stock levels." },
      { property: "og:title", content: "Products — KVP Polymers LLP" },
      { property: "og:description", content: "Add, edit and manage polymer products." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <AdminPage>
      <ProductsPage />
    </AdminPage>
  ),
});

const blank: Product = {
  id: "",
  name: "",
  sku: "",
  category: CATEGORIES[0],
  description: "",
  unit: UNITS[0],
  purchasePrice: 0,
  sellingPrice: 0,
  stock: 0,
  minStock: 0,
  taxRate: 18,
  status: "Active",
};

const stockLabel = (p: Product) =>
  p.stock <= 0 ? "Out of Stock" : p.stock < p.minStock ? "Low Stock" : "In Stock";

function ProductsPage() {
  const { products, saveProduct, deleteProduct } = useStore();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [form, setForm] = useState<Product | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toDelete, setToDelete] = useState<Product | null>(null);
  const [view, setView] = useState<Product | null>(null);

  const rows = useMemo(
    () =>
      products.filter(
        (p) =>
          (p.name + p.sku).toLowerCase().includes(q.toLowerCase().trim()) &&
          (cat === "All" || p.category === cat),
      ),
    [products, q, cat],
  );

  const set = (patch: Partial<Product>) => setForm((f) => (f ? { ...f, ...patch } : f));

  const submit = () => {
    if (!form) return;
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Product name is required";
    if (!form.sku.trim()) e.sku = "SKU is required";
    if (form.sellingPrice <= 0) e.sellingPrice = "Selling price must be greater than 0";
    setErrors(e);
    if (Object.keys(e).length) return;
    saveProduct(form);
    setForm(null);
  };

  return (
    <div>
      <PageHeader
        title="Products"
        subtitle="Polymer product catalogue of KVP Polymers LLP"
        action={
          <Button
            onClick={() => {
              setErrors({});
              setForm({ ...blank });
            }}
          >
            + Add Product
          </Button>
        }
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Products" value={String(products.length)} tone="primary" />
        <StatCard
          label="Active"
          value={String(products.filter((p) => p.status === "Active").length)}
          tone="success"
        />
        <StatCard
          label="Low Stock"
          value={String(products.filter((p) => p.stock > 0 && p.stock < p.minStock).length)}
          tone="warning"
        />
        <StatCard
          label="Out of Stock"
          value={String(products.filter((p) => p.stock <= 0).length)}
          tone="danger"
        />
      </div>

      <Card
        title="Product List"
        action={
          <div className="flex flex-wrap gap-2">
            <Input
              placeholder="Search product or SKU…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="sm:w-64"
            />
            <Select value={cat} onChange={(e) => setCat(e.target.value)} className="sm:w-48">
              <option>All</option>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </Select>
          </div>
        }
      >
        {rows.length === 0 ? (
          <EmptyState message="No products found. Try a different search." />
        ) : (
          <TableWrap>
            <thead>
              <tr>
                <Th>Product Name</Th>
                <Th>SKU</Th>
                <Th>Category</Th>
                <Th right>Stock</Th>
                <Th>Unit</Th>
                <Th right>Purchase</Th>
                <Th right>Selling</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className="hover:bg-muted/40">
                  <Td className="font-medium">{p.name}</Td>
                  <Td>{p.sku}</Td>
                  <Td>{p.category}</Td>
                  <Td right>{p.stock.toLocaleString("en-IN")}</Td>
                  <Td>{p.unit}</Td>
                  <Td right>{inr(p.purchasePrice)}</Td>
                  <Td right>{inr(p.sellingPrice)}</Td>
                  <Td>
                    <Badge tone={statusTone(stockLabel(p))}>{stockLabel(p)}</Badge>
                  </Td>
                  <Td>
                    <div className="flex flex-wrap gap-1.5">
                      <Button size="sm" variant="outline" onClick={() => setView(p)}>
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setErrors({});
                          setForm({ ...p });
                        }}
                      >
                        Edit
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => setToDelete(p)}>
                        Delete
                      </Button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        )}
      </Card>

      <Modal
        open={!!form}
        wide
        onClose={() => setForm(null)}
        title={form?.id ? "Edit Product" : "Add Product"}
        footer={
          <>
            <Button variant="outline" onClick={() => setForm(null)}>
              Cancel
            </Button>
            <Button onClick={submit}>Save Product</Button>
          </>
        }
      >
        {form && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Product Name" error={errors.name}>
              <Input value={form.name} onChange={(e) => set({ name: e.target.value })} />
            </Field>
            <Field label="SKU" error={errors.sku}>
              <Input value={form.sku} onChange={(e) => set({ sku: e.target.value })} />
            </Field>
            <Field label="Category">
              <Select value={form.category} onChange={(e) => set({ category: e.target.value })}>
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </Select>
            </Field>
            <Field label="Unit">
              <Select value={form.unit} onChange={(e) => set({ unit: e.target.value })}>
                {UNITS.map((u) => (
                  <option key={u}>{u}</option>
                ))}
              </Select>
            </Field>
            <Field label="Description" className="sm:col-span-2">
              <Textarea
                rows={2}
                value={form.description}
                onChange={(e) => set({ description: e.target.value })}
              />
            </Field>
            <Field label="Purchase Price (₹)">
              <Input
                type="number"
                value={form.purchasePrice}
                onChange={(e) => set({ purchasePrice: Number(e.target.value) || 0 })}
              />
            </Field>
            <Field label="Selling Price (₹)" error={errors.sellingPrice}>
              <Input
                type="number"
                value={form.sellingPrice}
                onChange={(e) => set({ sellingPrice: Number(e.target.value) || 0 })}
              />
            </Field>
            <Field label="Opening Stock">
              <Input
                type="number"
                value={form.stock}
                onChange={(e) => set({ stock: Number(e.target.value) || 0 })}
              />
            </Field>
            <Field label="Minimum Stock">
              <Input
                type="number"
                value={form.minStock}
                onChange={(e) => set({ minStock: Number(e.target.value) || 0 })}
              />
            </Field>
            <Field label="Tax Rate (%)">
              <Input
                type="number"
                value={form.taxRate}
                onChange={(e) => set({ taxRate: Number(e.target.value) || 0 })}
              />
            </Field>
            <Field label="Product Status">
              <Select
                value={form.status}
                onChange={(e) => set({ status: e.target.value as Product["status"] })}
              >
                <option>Active</option>
                <option>Inactive</option>
              </Select>
            </Field>
          </div>
        )}
      </Modal>

      <Modal open={!!view} onClose={() => setView(null)} title={view?.name || "Product"}>
        {view && (
          <dl className="space-y-2 text-sm">
            <Detail label="SKU" value={view.sku} />
            <Detail label="Category" value={view.category} />
            <Detail label="Description" value={view.description} />
            <Detail label="Stock" value={`${view.stock.toLocaleString("en-IN")} ${view.unit}`} />
            <Detail label="Minimum Stock" value={`${view.minStock} ${view.unit}`} />
            <Detail label="Purchase Price" value={inr(view.purchasePrice)} />
            <Detail label="Selling Price" value={inr(view.sellingPrice)} />
            <Detail label="Tax Rate" value={`${view.taxRate}%`} />
            <Detail label="Status" value={view.status} />
          </dl>
        )}
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        message={`Delete product “${toDelete?.name}”? This cannot be undone.`}
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete) deleteProduct(toDelete.id);
          setToDelete(null);
        }}
      />
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border pb-2">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium text-foreground">{value}</dd>
    </div>
  );
}
