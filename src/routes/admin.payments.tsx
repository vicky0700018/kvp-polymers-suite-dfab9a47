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
  Th,
  statusTone,
} from "@/components/kit";
import { dmy, inr, today } from "@/lib/format";
import type { PayMethod, Payment } from "@/lib/mock-data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/admin/payments")({
  head: () => ({
    meta: [
      { title: "Payments — KVP Polymers LLP" },
      { name: "description", content: "Track payments received from customers and paid to suppliers." },
      { property: "og:title", content: "Payments — KVP Polymers LLP" },
      { property: "og:description", content: "Receipts, supplier payments and payment methods." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <AdminPage>
      <PaymentsPage />
    </AdminPage>
  ),
});

const METHODS: PayMethod[] = ["Cash", "Bank Transfer", "UPI", "Cheque"];

type Draft = Omit<Payment, "id">;

function PaymentsPage() {
  const { payments, customers, suppliers, invoices, purchases, addPayment, deletePayment } =
    useStore();
  const [tab, setTab] = useState<"in" | "out">("in");
  const [q, setQ] = useState("");
  const [method, setMethod] = useState("All");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [error, setError] = useState("");
  const [toDelete, setToDelete] = useState<Payment | null>(null);

  const list = useMemo(
    () =>
      payments.filter(
        (p) =>
          p.type === tab &&
          (p.partyName + p.number + p.reference).toLowerCase().includes(q.toLowerCase().trim()) &&
          (method === "All" || p.method === method),
      ),
    [payments, tab, q, method],
  );

  const totalIn = payments.filter((p) => p.type === "in").reduce((s, p) => s + p.amount, 0);
  const totalOut = payments.filter((p) => p.type === "out").reduce((s, p) => s + p.amount, 0);
  const pending = payments.filter((p) => p.status === "Pending").length;

  const parties = tab === "in" ? customers : suppliers;
  const docs = tab === "in" ? invoices : purchases;

  const openNew = () => {
    setError("");
    setDraft({
      number:
        (tab === "in" ? "RCP-" : "PAY-") +
        String(payments.filter((p) => p.type === tab).length + 1).padStart(4, "0"),
      type: tab,
      partyName: parties[0]?.company ?? "",
      reference: docs[0]?.number ?? "",
      date: today(),
      amount: 0,
      method: "Bank Transfer",
      status: "Completed",
    });
  };

  const submit = () => {
    if (!draft) return;
    if (!draft.partyName) return setError("Select a party");
    if (!draft.amount || draft.amount <= 0) return setError("Enter an amount greater than 0");
    addPayment(draft);
    setDraft(null);
    setError("");
  };

  return (
    <div>
      <PageHeader
        title="Payments"
        subtitle="Money received from customers and paid to suppliers"
        action={<Button onClick={openNew}>+ Record Payment</Button>}
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Payments Received" value={inr(totalIn)} tone="success" />
        <StatCard label="Payments Made" value={inr(totalOut)} tone="warning" />
        <StatCard label="Net Cash Flow" value={inr(totalIn - totalOut)} tone="primary" />
        <StatCard label="Pending Entries" value={String(pending)} tone="danger" />
      </div>

      <div className="mb-4 inline-flex rounded-lg border border-border bg-surface p-1">
        {(["in", "out"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={
              "rounded-md px-4 py-2 text-sm font-medium transition-colors " +
              (tab === t
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted")
            }
          >
            {t === "in" ? "Payments Received" : "Payments Made"}
          </button>
        ))}
      </div>

      <Card
        title={tab === "in" ? "Payments Received" : "Payments Made"}
        action={
          <div className="flex flex-wrap gap-2">
            <Input
              placeholder="Search party or reference…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="sm:w-60"
            />
            <Select value={method} onChange={(e) => setMethod(e.target.value)} className="sm:w-44">
              <option>All</option>
              {METHODS.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </Select>
          </div>
        }
      >
        {list.length === 0 ? (
          <EmptyState message="No payment entries found." />
        ) : (
          <TableWrap>
            <thead>
              <tr>
                <Th>{tab === "in" ? "Receipt No." : "Payment No."}</Th>
                <Th>{tab === "in" ? "Customer" : "Supplier"}</Th>
                <Th>{tab === "in" ? "Invoice" : "Bill"}</Th>
                <Th>Date</Th>
                <Th right>Amount</Th>
                <Th>Method</Th>
                <Th>Status</Th>
                <Th>Action</Th>
              </tr>
            </thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.id} className="hover:bg-muted/40">
                  <Td className="font-medium">{p.number}</Td>
                  <Td>{p.partyName}</Td>
                  <Td>{p.reference || "—"}</Td>
                  <Td>{dmy(p.date)}</Td>
                  <Td right className="font-semibold">
                    {inr(p.amount)}
                  </Td>
                  <Td>{p.method}</Td>
                  <Td>
                    <Badge tone={statusTone(p.status)}>{p.status}</Badge>
                  </Td>
                  <Td>
                    <Button size="sm" variant="danger" onClick={() => setToDelete(p)}>
                      Delete
                    </Button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        )}
      </Card>

      <Modal
        open={!!draft}
        onClose={() => setDraft(null)}
        title={tab === "in" ? "Record Payment Received" : "Record Payment Made"}
        footer={
          <>
            <Button variant="outline" onClick={() => setDraft(null)}>
              Cancel
            </Button>
            <Button onClick={submit}>Save Payment</Button>
          </>
        }
      >
        {draft && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Voucher No.">
              <Input
                value={draft.number}
                onChange={(e) => setDraft({ ...draft, number: e.target.value })}
              />
            </Field>
            <Field label="Date">
              <Input
                type="date"
                value={draft.date}
                onChange={(e) => setDraft({ ...draft, date: e.target.value })}
              />
            </Field>
            <Field label={tab === "in" ? "Customer" : "Supplier"}>
              <Select
                value={draft.partyName}
                onChange={(e) => setDraft({ ...draft, partyName: e.target.value })}
              >
                {parties.map((p) => (
                  <option key={p.id}>{p.company}</option>
                ))}
              </Select>
            </Field>
            <Field label={tab === "in" ? "Against Invoice" : "Against Bill"}>
              <Select
                value={draft.reference}
                onChange={(e) => setDraft({ ...draft, reference: e.target.value })}
              >
                <option value="">— None —</option>
                {docs.map((d) => (
                  <option key={d.id}>{d.number}</option>
                ))}
              </Select>
            </Field>
            <Field label="Amount (₹)" error={error}>
              <Input
                type="number"
                value={draft.amount}
                onChange={(e) => setDraft({ ...draft, amount: Number(e.target.value) })}
              />
            </Field>
            <Field label="Payment Method">
              <Select
                value={draft.method}
                onChange={(e) => setDraft({ ...draft, method: e.target.value as PayMethod })}
              >
                {METHODS.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </Select>
            </Field>
            <Field label="Status">
              <Select
                value={draft.status}
                onChange={(e) =>
                  setDraft({ ...draft, status: e.target.value as Payment["status"] })
                }
              >
                <option>Completed</option>
                <option>Pending</option>
              </Select>
            </Field>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        message={`Delete payment ${toDelete?.number}?`}
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete) deletePayment(toDelete.id);
          setToDelete(null);
        }}
      />
    </div>
  );
}
