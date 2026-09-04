import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AdminPage } from "@/components/AdminPage";
import { InvoicePreview } from "@/components/InvoicePreview";
import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  Input,
  PageHeader,
  Select,
  StatCard,
  TableWrap,
  Td,
  Th,
  statusTone,
} from "@/components/kit";
import { dmy, inr } from "@/lib/format";
import { balanceOf, payStatus, useStore } from "@/lib/store";
import type { Invoice } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/sales/")({
  head: () => ({
    meta: [
      { title: "Sales & Invoices — KVP Polymers LLP" },
      { name: "description", content: "Manage sales invoices, payments and balances." },
      { property: "og:title", content: "Sales & Invoices — KVP Polymers LLP" },
      { property: "og:description", content: "Invoice list with search, filters and actions." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <AdminPage>
      <SalesPage />
    </AdminPage>
  ),
});

function SalesPage() {
  const { invoices, updateInvoice, deleteInvoice } = useStore();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const [preview, setPreview] = useState<Invoice | null>(null);
  const [editing, setEditing] = useState<Invoice | null>(null);
  const [payAmount, setPayAmount] = useState("0");
  const [toDelete, setToDelete] = useState<Invoice | null>(null);

  const rows = useMemo(
    () =>
      invoices.filter((i) => {
        const text = (i.number + i.partyName).toLowerCase();
        const okQ = text.includes(q.toLowerCase().trim());
        const okS = status === "All" || payStatus(i) === status;
        return okQ && okS;
      }),
    [invoices, q, status],
  );

  const total = rows.reduce((s, i) => s + i.total, 0);
  const paid = rows.reduce((s, i) => s + i.paid, 0);

  return (
    <div>
      <PageHeader
        title="Sales & Billing"
        subtitle="All sales invoices raised by KVP Polymers LLP"
        action={
          <Link to="/admin/sales/create">
            <Button>+ Create Invoice</Button>
          </Link>
        }
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Invoices" value={String(rows.length)} tone="primary" />
        <StatCard label="Total Sales" value={inr(total)} tone="info" />
        <StatCard label="Amount Received" value={inr(paid)} tone="success" />
        <StatCard label="Outstanding" value={inr(total - paid)} tone="warning" />
      </div>

      <Card
        title="Invoice List"
        action={
          <div className="flex flex-wrap gap-2">
            <Input
              placeholder="Search invoice or customer…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="sm:w-64"
            />
            <Select value={status} onChange={(e) => setStatus(e.target.value)} className="sm:w-40">
              {["All", "Paid", "Partial", "Unpaid"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </Select>
          </div>
        }
      >
        {rows.length === 0 ? (
          <EmptyState message="No invoices match your search." />
        ) : (
          <TableWrap>
            <thead>
              <tr>
                <Th>Invoice No.</Th>
                <Th>Customer</Th>
                <Th>Date</Th>
                <Th>Due Date</Th>
                <Th right>Total</Th>
                <Th right>Paid</Th>
                <Th right>Balance</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((i) => (
                <tr key={i.id} className="hover:bg-muted/40">
                  <Td className="font-semibold text-primary">{i.number}</Td>
                  <Td>{i.partyName}</Td>
                  <Td>{dmy(i.date)}</Td>
                  <Td>{dmy(i.dueDate)}</Td>
                  <Td right>{inr(i.total)}</Td>
                  <Td right>{inr(i.paid)}</Td>
                  <Td right>{inr(balanceOf(i))}</Td>
                  <Td>
                    <Badge tone={statusTone(payStatus(i))}>{payStatus(i)}</Badge>
                  </Td>
                  <Td>
                    <div className="flex flex-wrap gap-1.5">
                      <Button size="sm" variant="outline" onClick={() => setPreview(i)}>
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditing(i);
                          setPayAmount(String(i.paid));
                        }}
                      >
                        Edit
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => window.print()}>
                        Print
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => setToDelete(i)}>
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

      <InvoicePreview doc={preview} kind="invoice" onClose={() => setPreview(null)} />

      {editing && (
        <ConfirmEditPayment
          invoice={editing}
          value={payAmount}
          onChange={setPayAmount}
          onCancel={() => setEditing(null)}
          onSave={() => {
            updateInvoice({
              ...editing,
              paid: Math.min(editing.total, Math.max(0, Number(payAmount) || 0)),
            });
            setEditing(null);
          }}
        />
      )}

      <ConfirmDialog
        open={!!toDelete}
        message={`Delete invoice ${toDelete?.number}? This cannot be undone.`}
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete) deleteInvoice(toDelete.id);
          setToDelete(null);
        }}
      />
    </div>
  );
}

function ConfirmEditPayment({
  invoice,
  value,
  onChange,
  onCancel,
  onSave,
}: {
  invoice: Invoice;
  value: string;
  onChange: (v: string) => void;
  onCancel: () => void;
  onSave: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-surface p-5 shadow-pop">
        <h3 className="text-base font-semibold">Update payment — {invoice.number}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Invoice total {inr(invoice.total)} for {invoice.partyName}.
        </p>
        <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Amount received
        </label>
        <Input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1.5"
        />
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onSave}>Save Changes</Button>
        </div>
      </div>
    </div>
  );
}
