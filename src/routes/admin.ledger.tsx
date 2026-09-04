import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AdminPage } from "@/components/AdminPage";
import {
  Button,
  Card,
  EmptyState,
  Field,
  Input,
  PageHeader,
  Select,
  StatCard,
  TableWrap,
  Td,
  Th,
} from "@/components/kit";
import { dmy, inr, today } from "@/lib/format";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/admin/ledger")({
  head: () => ({
    meta: [
      { title: "Ledger — KVP Polymers LLP" },
      { name: "description", content: "Party-wise ledger with debit, credit and running balance." },
      { property: "og:title", content: "Ledger — KVP Polymers LLP" },
      { property: "og:description", content: "Customer and supplier account statements." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <AdminPage>
      <LedgerPage />
    </AdminPage>
  ),
});

interface Row {
  date: string;
  description: string;
  reference: string;
  debit: number;
  credit: number;
}

const monthsAgo = (n: number) => {
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  return d.toISOString().slice(0, 10);
};

function LedgerPage() {
  const { customers, suppliers, invoices, purchases, payments } = useStore();
  const [kind, setKind] = useState<"customer" | "supplier">("customer");
  const parties = kind === "customer" ? customers : suppliers;
  const [partyId, setPartyId] = useState(parties[0]?.id ?? "");
  const [from, setFrom] = useState(monthsAgo(6));
  const [to, setTo] = useState(today());

  const party = parties.find((p) => p.id === partyId) ?? parties[0];

  const rows = useMemo<Row[]>(() => {
    if (!party) return [];
    const docs = kind === "customer" ? invoices : purchases;
    const out: Row[] = [];
    for (const d of docs.filter((x) => x.partyId === party.id)) {
      out.push({
        date: d.date,
        description: kind === "customer" ? "Sales Invoice" : "Purchase Bill",
        reference: d.number,
        debit: kind === "customer" ? d.total : 0,
        credit: kind === "customer" ? 0 : d.total,
      });
    }
    for (const p of payments.filter(
      (x) => x.partyName === party.company && x.type === (kind === "customer" ? "in" : "out"),
    )) {
      out.push({
        date: p.date,
        description: `Payment ${kind === "customer" ? "Received" : "Made"} (${p.method})`,
        reference: p.reference || p.number,
        debit: kind === "customer" ? 0 : p.amount,
        credit: kind === "customer" ? p.amount : 0,
      });
    }
    return out
      .filter((r) => r.date >= from && r.date <= to)
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [party, kind, invoices, purchases, payments, from, to]);

  const opening = party?.openingBalance ?? 0;
  const totalDebit = rows.reduce((s, r) => s + r.debit, 0);
  const totalCredit = rows.reduce((s, r) => s + r.credit, 0);
  const closing = opening + totalDebit - totalCredit;

  let running = opening;

  return (
    <div>
      <PageHeader
        title="Ledger"
        subtitle="Account statement for customers and suppliers"
        action={<Button variant="outline" onClick={() => window.print()}>Print Statement</Button>}
      />

      <Card title="Filters" className="mb-5">
        <div className="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-4">
          <Field label="Party Type">
            <Select
              value={kind}
              onChange={(e) => {
                const k = e.target.value as "customer" | "supplier";
                setKind(k);
                setPartyId((k === "customer" ? customers : suppliers)[0]?.id ?? "");
              }}
            >
              <option value="customer">Customer</option>
              <option value="supplier">Supplier</option>
            </Select>
          </Field>
          <Field label="Party">
            <Select value={partyId} onChange={(e) => setPartyId(e.target.value)}>
              {parties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.company}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="From Date">
            <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </Field>
          <Field label="To Date">
            <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </Field>
        </div>
      </Card>

      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Opening Balance" value={inr(opening)} tone="info" />
        <StatCard label="Total Debit" value={inr(totalDebit)} tone="accent" />
        <StatCard label="Total Credit" value={inr(totalCredit)} tone="success" />
        <StatCard label="Closing Balance" value={inr(closing)} tone="primary" />
      </div>

      <Card title={party ? `${party.company} — Statement` : "Statement"}>
        {rows.length === 0 ? (
          <EmptyState message="No ledger entries for this party in the selected date range." />
        ) : (
          <TableWrap>
            <thead>
              <tr>
                <Th>Date</Th>
                <Th>Description</Th>
                <Th>Reference</Th>
                <Th right>Debit</Th>
                <Th right>Credit</Th>
                <Th right>Balance</Th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-muted/40">
                <Td>—</Td>
                <Td className="font-semibold">Opening Balance</Td>
                <Td>—</Td>
                <Td right>—</Td>
                <Td right>—</Td>
                <Td right className="font-semibold">
                  {inr(opening)}
                </Td>
              </tr>
              {rows.map((r, i) => {
                running += r.debit - r.credit;
                return (
                  <tr key={i} className="hover:bg-muted/40">
                    <Td>{dmy(r.date)}</Td>
                    <Td>{r.description}</Td>
                    <Td>{r.reference}</Td>
                    <Td right>{r.debit ? inr(r.debit) : "—"}</Td>
                    <Td right>{r.credit ? inr(r.credit) : "—"}</Td>
                    <Td right className="font-medium">
                      {inr(running)}
                    </Td>
                  </tr>
                );
              })}
              <tr className="bg-muted/40">
                <Td>—</Td>
                <Td className="font-semibold">Closing Balance</Td>
                <Td>—</Td>
                <Td right className="font-semibold">
                  {inr(totalDebit)}
                </Td>
                <Td right className="font-semibold">
                  {inr(totalCredit)}
                </Td>
                <Td right className="font-bold">
                  {inr(closing)}
                </Td>
              </tr>
            </tbody>
          </TableWrap>
        )}
      </Card>
    </div>
  );
}
