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
import type { Purchase } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/purchases/")({
  head: () => ({
    meta: [
      { title: "Purchase Bills — KVP Polymers LLP" },
      { name: "description", content: "Track supplier purchase bills, payments and balances." },
      { property: "og:title", content: "Purchase Bills — KVP Polymers LLP" },
      { property: "og:description", content: "Purchase bill register with filters and actions." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <AdminPage>
      <PurchasesPage />
    </AdminPage>
  ),
});

function PurchasesPage() {
  const { purchases, deletePurchase } = useStore();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const [preview, setPreview] = useState<Purchase | null>(null);
  const [toDelete, setToDelete] = useState<Purchase | null>(null);

  const rows = useMemo(
    () =>
      purchases.filter((p) => {
        const okQ = (p.number + p.partyName).toLowerCase().includes(q.toLowerCase().trim());
        const okS = status === "All" || payStatus(p) === status;
        return okQ && okS;
      }),
    [purchases, q, status],
  );

  const total = rows.reduce((s, p) => s + p.total, 0);
  const paid = rows.reduce((s, p) => s + p.paid, 0);

  return (
    <div>
      <PageHeader
        title="Purchase Management"
        subtitle="Purchase bills received from raw material suppliers"
        action={
          <Link to="/admin/purchases/create">
            <Button>+ Create Purchase</Button>
          </Link>
        }
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Purchase Bills" value={String(rows.length)} tone="primary" />
        <StatCard label="Total Purchases" value={inr(total)} tone="info" />
        <StatCard label="Amount Paid" value={inr(paid)} tone="success" />
        <StatCard label="Payable" value={inr(total - paid)} tone="danger" />
      </div>

      <Card
        title="Purchase Bill List"
        action={
          <div className="flex flex-wrap gap-2">
            <Input
              placeholder="Search bill or supplier…"
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
          <EmptyState message="No purchase bills match your search." />
        ) : (
          <TableWrap>
            <thead>
              <tr>
                <Th>Bill Number</Th>
                <Th>Supplier</Th>
                <Th>Date</Th>
                <Th right>Amount</Th>
                <Th right>Paid</Th>
                <Th right>Balance</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className="hover:bg-muted/40">
                  <Td className="font-semibold text-primary">{p.number}</Td>
                  <Td>{p.partyName}</Td>
                  <Td>{dmy(p.date)}</Td>
                  <Td right>{inr(p.total)}</Td>
                  <Td right>{inr(p.paid)}</Td>
                  <Td right>{inr(balanceOf(p))}</Td>
                  <Td>
                    <Badge tone={statusTone(payStatus(p))}>{payStatus(p)}</Badge>
                  </Td>
                  <Td>
                    <div className="flex flex-wrap gap-1.5">
                      <Button size="sm" variant="outline" onClick={() => setPreview(p)}>
                        View
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => window.print()}>
                        Print
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

      <InvoicePreview doc={preview} kind="purchase" onClose={() => setPreview(null)} />

      <ConfirmDialog
        open={!!toDelete}
        message={`Delete purchase bill ${toDelete?.number}?`}
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete) deletePurchase(toDelete.id);
          setToDelete(null);
        }}
      />
    </div>
  );
}
