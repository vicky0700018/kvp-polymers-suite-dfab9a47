import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AdminPage } from "@/components/AdminPage";
import { InvoicePreview } from "@/components/InvoicePreview";
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
import { docTotals, type Invoice, type LineItem } from "@/lib/mock-data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/admin/sales/create")({
  head: () => ({
    meta: [
      { title: "Create Invoice — KVP Polymers LLP" },
      { name: "description", content: "Create a GST sales invoice with dynamic calculations." },
      { property: "og:title", content: "Create Invoice — KVP Polymers LLP" },
      { property: "og:description", content: "Add products, discounts and tax to build a bill." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <AdminPage>
      <CreateInvoice />
    </AdminPage>
  ),
});

const uid = () => Math.random().toString(36).slice(2, 9);

function CreateInvoice() {
  const { customers, products, addInvoice, nextInvoiceNumber, invoiceSettings } = useStore();
  const navigate = useNavigate();

  const [partyId, setPartyId] = useState("");
  const [number, setNumber] = useState(nextInvoiceNumber());
  const [date, setDate] = useState(today());
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + invoiceSettings.paymentTerms);
    return d.toISOString().slice(0, 10);
  });
  const [paid, setPaid] = useState("0");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<LineItem[]>([]);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState<Invoice | null>(null);

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
        rate: p.sellingPrice,
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
      rate: p.sellingPrice,
      tax: p.taxRate,
    });
  };

  const save = (print: boolean) => {
    if (!partyId) return setError("Please select a customer.");
    if (items.length === 0) return setError("Add at least one product line.");
    setError("");
    const customer = customers.find((c) => c.id === partyId);
    const created = addInvoice({
      number,
      partyId,
      partyName: customer?.company || customer?.name || "",
      date,
      dueDate,
      items,
      total: Math.round(totals.total),
      paid: Math.min(Math.round(totals.total), Math.max(0, Number(paid) || 0)),
      notes,
    });
    if (print) setSaved(created);
    else navigate({ to: "/admin/sales" });
  };

  return (
    <div>
      <PageHeader title="Create Invoice" subtitle="Raise a new GST sales invoice" />

      <div className="grid gap-5 lg:grid-cols-3">
        <Card title="Customer & Invoice Details" className="lg:col-span-3">
          <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4 sm:p-5">
            <Field label="Customer">
              <Select value={partyId} onChange={(e) => setPartyId(e.target.value)}>
                <option value="">Select customer…</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.company} — {c.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Invoice Number">
              <Input value={number} onChange={(e) => setNumber(e.target.value)} />
            </Field>
            <Field label="Invoice Date">
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </Field>
            <Field label="Due Date">
              <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
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
            <EmptyState message="No products added yet. Click “Add Product” to start billing." />
          ) : (
            <TableWrap>
              <thead>
                <tr>
                  <Th>Product</Th>
                  <Th>SKU</Th>
                  <Th right>Qty</Th>
                  <Th>Unit</Th>
                  <Th right>Rate</Th>
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
            <Field label="Invoice Notes">
              <Textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </Field>
            <Field label="Amount Received">
              <Input type="number" value={paid} onChange={(e) => setPaid(e.target.value)} />
            </Field>
          </div>
        </Card>

        <Card title="Summary">
          <div className="space-y-2 p-4 text-sm sm:p-5">
            <Line label="Subtotal" value={inr2(totals.subtotal)} />
            <Line label="Discount" value={"- " + inr2(totals.discount)} />
            <Line label="Tax (GST)" value={inr2(totals.tax)} />
            <div className="flex justify-between border-t border-border pt-2 text-base font-bold text-primary">
              <span>Grand Total</span>
              <span>{inr2(totals.total)}</span>
            </div>
            {error && <p className="text-sm font-medium text-danger">{error}</p>}
            <div className="flex flex-wrap gap-2 pt-3">
              <Button onClick={() => save(false)}>Save Invoice</Button>
              <Button variant="secondary" onClick={() => save(true)}>
                Save &amp; Print
              </Button>
              <Button variant="outline" onClick={() => navigate({ to: "/admin/sales" })}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <InvoicePreview
        doc={saved}
        kind="invoice"
        onClose={() => {
          setSaved(null);
          navigate({ to: "/admin/sales" });
        }}
      />
    </div>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-muted-foreground">
      <span>{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
