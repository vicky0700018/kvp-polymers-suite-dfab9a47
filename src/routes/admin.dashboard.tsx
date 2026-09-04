import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminPage } from "@/components/AdminPage";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  StatCard,
  TableWrap,
  Td,
  Th,
  statusTone,
  PageHeader,
} from "@/components/kit";
import { balanceOf, payStatus, useStore } from "@/lib/store";
import { daysBetween, dmy, greeting, inr, today } from "@/lib/format";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — KVP Polymers LLP" },
      {
        name: "description",
        content: "Sales, purchase, receivable and stock overview for KVP Polymers LLP.",
      },
      { property: "og:title", content: "Admin Dashboard — KVP Polymers LLP" },
      { property: "og:description", content: "Business KPIs, recent sales and stock alerts." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <AdminPage>
      <Dashboard />
    </AdminPage>
  ),
});

function Dashboard() {
  const { invoices, purchases, products, business, adminProfile } = useStore();

  const totalSales = invoices.reduce((s, i) => s + i.total, 0);
  const totalPurchases = purchases.reduce((s, p) => s + p.total, 0);
  const receivables = invoices.reduce((s, i) => s + balanceOf(i), 0);
  const payables = purchases.reduce((s, p) => s + balanceOf(p), 0);
  const lowStock = products.filter((p) => p.stock <= p.minStock);

  const months = monthlySales(invoices.map((i) => ({ date: i.date, total: i.total })));
  const peak = Math.max(1, ...months.map((m) => m.total));

  const outstanding = invoices
    .filter((i) => balanceOf(i) > 0)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  return (
    <>
      <PageHeader
        title={`${greeting()}, Admin`}
        subtitle={`${business.name} · signed in as ${adminProfile.email}`}
        action={
          <div className="flex gap-2">
            <Link to="/admin/sales/create">
              <Button size="sm">+ New Invoice</Button>
            </Link>
            <Link to="/admin/purchases/create">
              <Button size="sm" variant="outline">
                + New Purchase
              </Button>
            </Link>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total Sales" value={inr(totalSales)} hint={`${invoices.length} invoices`} tone="primary" />
        <StatCard label="Total Purchases" value={inr(totalPurchases)} hint={`${purchases.length} bills`} tone="info" />
        <StatCard label="Total Receivables" value={inr(receivables)} hint="Pending from customers" tone="warning" />
        <StatCard label="Total Payables" value={inr(payables)} hint="Pending to suppliers" tone="danger" />
        <StatCard label="Total Products" value={String(products.length)} hint="Active catalogue" tone="accent" />
        <StatCard label="Low Stock Items" value={String(lowStock.length)} hint="At or below minimum" tone="warning" />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Card title="Sales Overview (last 6 months)">
          <div className="p-5">
            <div className="flex h-48 items-end gap-3">
              {months.map((m) => (
                <div key={m.label} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-[10px] font-semibold text-muted-foreground">
                    {m.total ? inr(m.total) : ""}
                  </span>
                  <div className="flex w-full flex-1 items-end">
                    <div
                      className="w-full rounded-t-md bg-secondary transition-all"
                      style={{ height: `${Math.max(4, (m.total / peak) * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">{m.label}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card
          title="Low Stock Alert"
          action={
            <Link to="/admin/inventory">
              <Button size="sm" variant="outline">
                View Inventory
              </Button>
            </Link>
          }
        >
          {lowStock.length === 0 ? (
            <EmptyState message="All products are above minimum stock." />
          ) : (
            <ul className="divide-y divide-border">
              {lowStock.slice(0, 6).map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Min {p.minStock} {p.unit}
                    </p>
                  </div>
                  <Badge tone={p.stock === 0 ? "danger" : "warning"}>
                    {p.stock} {p.unit}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <Card
          title="Recent Sales"
          action={
            <Link to="/admin/sales">
              <Button size="sm" variant="outline">
                All invoices
              </Button>
            </Link>
          }
        >
          <TableWrap>
            <thead>
              <tr>
                <Th>Invoice No.</Th>
                <Th>Customer</Th>
                <Th>Date</Th>
                <Th right>Amount</Th>
                <Th>Payment</Th>
                <Th>Action</Th>
              </tr>
            </thead>
            <tbody>
              {invoices.slice(0, 5).map((i) => (
                <tr key={i.id}>
                  <Td className="font-medium">{i.number}</Td>
                  <Td>{i.partyName}</Td>
                  <Td>{dmy(i.date)}</Td>
                  <Td right>{inr(i.total)}</Td>
                  <Td>
                    <Badge tone={statusTone(payStatus(i))}>{payStatus(i)}</Badge>
                  </Td>
                  <Td>
                    <Link to="/admin/sales" className="text-xs font-semibold text-secondary underline">
                      View
                    </Link>
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        </Card>

        <Card
          title="Recent Purchases"
          action={
            <Link to="/admin/purchases">
              <Button size="sm" variant="outline">
                All bills
              </Button>
            </Link>
          }
        >
          <TableWrap>
            <thead>
              <tr>
                <Th>Bill No.</Th>
                <Th>Supplier</Th>
                <Th>Date</Th>
                <Th right>Amount</Th>
                <Th>Payment</Th>
              </tr>
            </thead>
            <tbody>
              {purchases.slice(0, 5).map((p) => (
                <tr key={p.id}>
                  <Td className="font-medium">{p.number}</Td>
                  <Td>{p.partyName}</Td>
                  <Td>{dmy(p.date)}</Td>
                  <Td right>{inr(p.total)}</Td>
                  <Td>
                    <Badge tone={statusTone(payStatus(p))}>{payStatus(p)}</Badge>
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        </Card>
      </div>

      <Card className="mt-6" title="Outstanding Payments">
        {outstanding.length === 0 ? (
          <EmptyState message="No outstanding customer payments." />
        ) : (
          <TableWrap>
            <thead>
              <tr>
                <Th>Customer</Th>
                <Th>Invoice</Th>
                <Th>Due Date</Th>
                <Th right>Amount</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {outstanding.map((i) => {
                const overdue = daysBetween(i.dueDate, today());
                return (
                  <tr key={i.id}>
                    <Td>{i.partyName}</Td>
                    <Td className="font-medium">{i.number}</Td>
                    <Td>{dmy(i.dueDate)}</Td>
                    <Td right>{inr(balanceOf(i))}</Td>
                    <Td>
                      <Badge tone={overdue > 0 ? "danger" : "warning"}>
                        {overdue > 0 ? `${overdue} days overdue` : "Due"}
                      </Badge>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </TableWrap>
        )}
      </Card>
    </>
  );
}

function monthlySales(rows: { date: string; total: number }[]) {
  const out: { label: string; total: number }[] = [];
  const now = new Date();
  for (let k = 5; k >= 0; k--) {
    const d = new Date(now.getFullYear(), now.getMonth() - k, 1);
    const key = d.toISOString().slice(0, 7);
    out.push({
      label: d.toLocaleDateString("en-IN", { month: "short" }),
      total: rows.filter((r) => r.date.slice(0, 7) === key).reduce((s, r) => s + r.total, 0),
    });
  }
  return out;
}
