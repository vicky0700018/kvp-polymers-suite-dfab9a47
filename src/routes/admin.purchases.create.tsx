import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AdminPage } from "@/components/AdminPage";
import {
  Button,
  Card,
  EmptyState,
  Field,
  Input,
  PageHeader,
  Select,
  TableWrap,
  Td,
  Th,
  Textarea,
} from "@/components/kit";
import { inr2, today } from "@/lib/format";
import { docTotals, type LineItem } from "@/lib/mock-data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/admin/purchases/create")({
  head: () => ({
    meta: [
      { title: "Create Purchase — KVP Polymers LLP" },
      { name: "description", content: "Record a supplier purchase bill and update stock." },
      { property: "og:title", content: "Create Purchase — KVP Polymers LLP" },
      { property: "og:description", content: "Add raw material lines with rate, discount and tax." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <AdminPage>
      <CreatePurchase />
    </AdminPage>
  ),
});

const uid = () => Math.random().toString(36).slice(2, 9);

function CreatePurchase() {
  const { suppliers, products, addPurchase, nextPurchaseNumber } = useStore();
  const navigate = useNavigate();

  const [partyId, setPartyId] = useState("");
  const [number, setNumber] = useState(nextPurchaseNumber());
  const [date, setDate] = useState(today());
  const [paid, setPaid] = useState("0");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<LineItem[]>([]);
  const [error, setError] = useState("");

  const totals = docTotals(items);

  const addLine = () => {
    const p = products[0];
    if (!p) return;
    setItems((prev) => [
      ...prev,
      {
        id: uid(),
        productId: p.id,
        name: p.name,
        sku: p.sku,
        qty: 1,
        unit: p.unit,
        rate: p.purchasePrice,
        discount: 0,
        tax: p.taxRate,
      },
    ]);
  };

  const update = (id: string, patch: Partial<LineItem>) =>
    setItems((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));

  const pickProduct = (id: string, productId: string) => {
    const p = products.find((x) => x.id === productId);
    if (!p) return;
    update(id, {
      productId: p.id,
      name: p.name,
      sku: p.sku,
      unit: p.unit,
      rate: p.purchasePrice,
      tax: p.taxRate,
    });
  };

  const save = () => {
    if (!partyId) return setError("Please select a supplier.");
    if (items.length === 0) return setError("Add at least one product line.");
    const supplier = suppliers.find((s) => s.id === partyId);
    addPurchase({
      number,
      partyId,
      partyName: supplier?.company || supplier?.name || "",
      date,
      items,
      total: Math.round(totals.total),
      paid: Math.min(Math.round(totals.total), Math.max(0, Number(paid) || 0)),
      notes,
    });
    navigate({ to: "/admin/purchases" });
  };

  return (
    <div>
      <PageHeader title="Create Purchase" subtitle="Record a new purchase bill from a supplier" />

      <div className="grid gap-5 lg:grid-cols-3">
        <Card title="Supplier & Bill Details" className="lg:col-span-3">
          <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 sm:p-5">
            <Field label="Supplier">
              <Select value={partyId} onChange={(e) => setPartyId(e.target.value)}>
                <option value="">Select supplier…</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.company} — {s.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Bill Number">
              <Input value={number} onChange={(e) => setNumber(e.target.value)} />
            </Field>
            <Field label="Bill Date">
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </Field>
          </div>
        </Card>

        <Card
          title="Products"
          className="lg:col-span-3"
          action={
            <Button size="sm" variant="secondary" onClick={addLine}>
              + Add Product
            </Button>
          }
        >
          {items.length === 0 ? (
            <EmptyState message="No products added yet. Add material lines to this purchase." />
          ) : (
            <TableWrap>
              <thead>
                <tr>
                  <Th>Product</Th>
                  <Th>SKU</Th>
                  <Th right>Qty</Th>
                  <Th>Unit</Th>
                  <Th right>Purchase Rate</Th>
                  <Th right>Disc %</Th>
                  <Th right>Tax %</Th>
                  <Th right>Amount</Th>
                  <Th>Remove</Th>
                </tr>
              </thead>
              <tbody>
                {items.map((l) => {
                  const gross = l.qty * l.rate;
                  const afterDisc = gross - (gross * l.discount) / 100;
                  return (
                    <tr key={l.id}>
                      <Td className="min-w-[220px]">
                        <Select
                          value={l.productId}
                          onChange={(e) => pickProduct(l.id, e.target.value)}
                        >
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </Select>
                      </Td>
                      <Td>{l.sku}</Td>
                      <Td right>
                        <Input
                          type="number"
                          className="w-24 text-right"
                          value={l.qty}
                          onChange={(e) => update(l.id, { qty: Number(e.target.value) || 0 })}
                        />
                      </Td>
                      <Td>{l.unit}</Td>
                      <Td right>
                        <Input
                          type="number"
                          className="w-28 text-right"
                          value={l.rate}
                          onChange={(e) => update(l.id, { rate: Number(e.target.value) || 0 })}
                        />
                      </Td>
                      <Td right>
                        <Input
                          type="number"
                          className="w-20 text-right"
                          value={l.discount}
                          onChange={(e) => update(l.id, { discount: Number(e.target.value) || 0 })}
                        />
                      </Td>
                      <Td right>
                        <Input
                          type="number"
                          className="w-20 text-right"
                          value={l.tax}
                          onChange={(e) => update(l.id, { tax: Number(e.target.value) || 0 })}
                        />
                      </Td>
                      <Td right className="font-semibold">
                        {inr2(afterDisc + (afterDisc * l.tax) / 100)}
                      </Td>
                      <Td>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => setItems((prev) => prev.filter((x) => x.id !== l.id))}
                        >
                          ✕
                        </Button>
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </TableWrap>
          )}
        </Card>

        <Card title="Notes" className="lg:col-span-2">
          <div className="space-y-4 p-4 sm:p-5">
            <Field label="Bill Notes">
              <Textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </Field>
            <Field label="Amount Paid">
              <Input type="number" value={paid} onChange={(e) => setPaid(e.target.value)} />
            </Field>
          </div>
        </Card>

        <Card title="Summary">
          <div className="space-y-2 p-4 text-sm sm:p-5">
            <Row label="Subtotal" value={inr2(totals.subtotal)} />
            <Row label="Discount" value={"- " + inr2(totals.discount)} />
            <Row label="Tax (GST)" value={inr2(totals.tax)} />
            <div className="flex justify-between border-t border-border pt-2 text-base font-bold text-primary">
              <span>Grand Total</span>
              <span>{inr2(totals.total)}</span>
            </div>
            {error && <p className="text-sm font-medium text-danger">{error}</p>}
            <div className="flex flex-wrap gap-2 pt-3">
              <Button onClick={save}>Save Purchase</Button>
              <Button variant="outline" onClick={() => navigate({ to: "/admin/purchases" })}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-muted-foreground">
      <span>{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
