import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AdminPage } from "@/components/AdminPage";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Field,
  Input,
  PageHeader,
  StatCard,
  TableWrap,
  Td,
  Th,
} from "@/components/kit";
import { daysBetween, dmy, inr, today } from "@/lib/format";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/admin/reports")({
  head: () => ({
    meta: [
      { title: "Reports — KVP Polymers LLP" },
      {
        name: "description",
        content:
          "Sales, purchase, stock, profit & loss and outstanding reports for KVP Polymers LLP.",
      },
      { property: "og:title", content: "Reports — KVP Polymers LLP" },
      { property: "og:description", content: "Business reporting for KVP Polymers LLP." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <AdminPage>
      <ReportsPage />
    </AdminPage>
  ),
});

type TabKey = "sales" | "purchase" | "stock" | "pl" | "outstanding";
type RangeKey = "today" | "week" | "month" | "custom";

const TABS: Array<{ key: TabKey; label: string }> = [
  { key: "sales", label: "Sales Report" },
  { key: "purchase", label: "Purchase Report" },
  { key: "stock", label: "Stock Report" },
  { key: "pl", label: "Profit & Loss" },
  { key: "outstanding", label: "Outstanding Report" },
];

const shiftDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};

function ReportsPage() {
  const { invoices, purchases, products } = useStore();
  const [tab, setTab] = useState<TabKey>("sales");
  const [range, setRange] = useState<RangeKey>("month");
  const [from, setFrom] = useState(shiftDays(30));
  const [to, setTo] = useState(today());

  const window_ = useMemo(() => {
    if (range === "today") return { from: today(), to: today() };
    if (range === "week") return { from: shiftDays(7), to: today() };
    if (range === "month") return { from: shiftDays(30), to: today() };
    return { from, to };
  }, [range, from, to]);

  const inRange = (iso: string) => iso >= window_.from && iso <= window_.to;

  const sales = useMemo(() => invoices.filter((i) => inRange(i.date)), [invoices, window_]);
  const buys = useMemo(() => purchases.filter((p) => inRange(p.date)), [purchases, window_]);

  const sum = (arr: Array<{ total: number; paid: number }>) => ({
    total: arr.reduce((a, x) => a + x.total, 0),
    paid: arr.reduce((a, x) => a + x.paid, 0),
  });
  const s = sum(sales);
  const b = sum(buys);

  const cost = useMemo(
    () =>
      sales.reduce(
        (acc, inv) =>
          acc +
          inv.items.reduce((a, l) => {
            const p = products.find((x) => x.id === l.productId);
            return a + (p ? p.purchasePrice * l.qty : l.rate * l.qty * 0.8);
          }, 0),
        0,
      ),
    [sales, products],
  );

  const expenses = Math.round(s.total * 0.06);
  const gross = s.total - cost;
  const net = gross - expenses;

  const stock = useMemo(() => {
    const totalStock = products.reduce((a, p) => a + p.stock, 0);
    const low = products.filter((p) => p.stock > 0 && p.stock <= p.minStock);
    const out = products.filter((p) => p.stock <= 0);
    const value = products.reduce((a, p) => a + p.stock * p.purchasePrice, 0);
    return { totalStock, low, out, value };
  }, [products]);

  const outstanding = useMemo(
    () =>
      invoices
        .filter((i) => i.total - i.paid > 0.5)
        .map((i) => ({
          ...i,
          balance: i.total - i.paid,
          overdue: Math.max(0, daysBetween(i.dueDate, today())),
        }))
        .sort((x, y) => y.overdue - x.overdue),
    [invoices],
  );

  return (
    <>
      <PageHeader
        title="Reports"
        subtitle="Mock analytics across sales, purchases, stock and receivables."
        action={
          <Button variant="outline" onClick={() => window.print()}>
            Print Report
          </Button>
        }
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <Button
            key={t.key}
            size="sm"
            variant={tab === t.key ? "primary" : "outline"}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </Button>
        ))}
      </div>

      {(tab === "sales" || tab === "purchase" || tab === "pl") && (
        <Card className="mb-5" title="Filters">
          <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Period">
              <div className="flex flex-wrap gap-2">
                {(["today", "week", "month", "custom"] as RangeKey[]).map((r) => (
                  <Button
                    key={r}
                    size="sm"
                    variant={range === r ? "secondary" : "outline"}
                    onClick={() => setRange(r)}
                  >
                    {r === "today"
                      ? "Today"
                      : r === "week"
                        ? "This Week"
                        : r === "month"
                          ? "This Month"
                          : "Custom"}
                  </Button>
                ))}
              </div>
            </Field>
            <Field label="From">
              <Input
                type="date"
                value={window_.from}
                disabled={range !== "custom"}
                onChange={(e) => setFrom(e.target.value)}
              />
            </Field>
            <Field label="To">
              <Input
                type="date"
                value={window_.to}
                disabled={range !== "custom"}
                onChange={(e) => setTo(e.target.value)}
              />
            </Field>
            <Field label="Showing">
              <p className="pt-2 text-sm text-muted-foreground">
                {dmy(window_.from)} — {dmy(window_.to)}
              </p>
            </Field>
          </div>
        </Card>
      )}

      {tab === "sales" && (
        <>
          <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total Sales" value={inr(s.total)} tone="primary" />
            <StatCard label="Paid Sales" value={inr(s.paid)} tone="success" />
            <StatCard label="Pending Sales" value={inr(s.total - s.paid)} tone="warning" />
            <StatCard label="Invoice Count" value={String(sales.length)} tone="accent" />
          </div>
          <Card title="Invoices in period">
            {sales.length === 0 ? (
              <EmptyState message="No invoices in the selected period." />
            ) : (
              <TableWrap>
                <thead>
                  <tr>
                    <Th>Invoice</Th>
                    <Th>Customer</Th>
                    <Th>Date</Th>
                    <Th right>Total</Th>
                    <Th right>Paid</Th>
                    <Th right>Balance</Th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map((i) => (
                    <tr key={i.id}>
                      <Td className="font-medium">{i.number}</Td>
                      <Td>{i.partyName}</Td>
                      <Td>{dmy(i.date)}</Td>
                      <Td right>{inr(i.total)}</Td>
                      <Td right>{inr(i.paid)}</Td>
                      <Td right>{inr(i.total - i.paid)}</Td>
                    </tr>
                  ))}
                </tbody>
              </TableWrap>
            )}
          </Card>
        </>
      )}

      {tab === "purchase" && (
        <>
          <div className="mb-5 grid gap-4 sm:grid-cols-3">
            <StatCard label="Total Purchase" value={inr(b.total)} tone="primary" />
            <StatCard label="Paid Purchase" value={inr(b.paid)} tone="success" />
            <StatCard label="Pending Purchase" value={inr(b.total - b.paid)} tone="warning" />
          </div>
          <Card title="Purchase bills in period">
            {buys.length === 0 ? (
              <EmptyState message="No purchase bills in the selected period." />
            ) : (
              <TableWrap>
                <thead>
                  <tr>
                    <Th>Bill No.</Th>
                    <Th>Supplier</Th>
                    <Th>Date</Th>
                    <Th right>Total</Th>
                    <Th right>Paid</Th>
                    <Th right>Balance</Th>
                  </tr>
                </thead>
                <tbody>
                  {buys.map((p) => (
                    <tr key={p.id}>
                      <Td className="font-medium">{p.number}</Td>
                      <Td>{p.partyName}</Td>
                      <Td>{dmy(p.date)}</Td>
                      <Td right>{inr(p.total)}</Td>
                      <Td right>{inr(p.paid)}</Td>
                      <Td right>{inr(p.total - p.paid)}</Td>
                    </tr>
                  ))}
                </tbody>
              </TableWrap>
            )}
          </Card>
        </>
      )}

      {tab === "stock" && (
        <>
          <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total Products" value={String(products.length)} tone="primary" />
            <StatCard
              label="Total Stock"
              value={stock.totalStock.toLocaleString("en-IN")}
              hint="Across all units"
              tone="accent"
            />
            <StatCard label="Low Stock" value={String(stock.low.length)} tone="warning" />
            <StatCard label="Out of Stock" value={String(stock.out.length)} tone="danger" />
          </div>
          <Card title={`Stock valuation — ${inr(stock.value)}`}>
            <TableWrap>
              <thead>
                <tr>
                  <Th>Product</Th>
                  <Th>SKU</Th>
                  <Th>Category</Th>
                  <Th right>Stock</Th>
                  <Th right>Min</Th>
                  <Th right>Value</Th>
                  <Th>Status</Th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <Td className="font-medium">{p.name}</Td>
                    <Td>{p.sku}</Td>
                    <Td>{p.category}</Td>
                    <Td right>
                      {p.stock} {p.unit}
                    </Td>
                    <Td right>{p.minStock}</Td>
                    <Td right>{inr(p.stock * p.purchasePrice)}</Td>
                    <Td>
                      {p.stock <= 0 ? (
                        <Badge tone="danger">Out of Stock</Badge>
                      ) : p.stock <= p.minStock ? (
                        <Badge tone="warning">Low Stock</Badge>
                      ) : (
                        <Badge tone="success">In Stock</Badge>
                      )}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </TableWrap>
          </Card>
        </>
      )}

      {tab === "pl" && (
        <>
          <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <StatCard label="Revenue" value={inr(s.total)} tone="primary" />
            <StatCard label="Cost of Goods" value={inr(cost)} tone="info" />
            <StatCard label="Gross Profit" value={inr(gross)} tone="accent" />
            <StatCard label="Expenses" value={inr(expenses)} tone="warning" />
            <StatCard
              label="Net Profit"
              value={inr(net)}
              tone={net >= 0 ? "success" : "danger"}
            />
          </div>
          <Card title="Profit & Loss statement">
            <TableWrap>
              <thead>
                <tr>
                  <Th>Particulars</Th>
                  <Th right>Amount</Th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <Td>Revenue from operations</Td>
                  <Td right>{inr(s.total)}</Td>
                </tr>
                <tr>
                  <Td>Less: Cost of goods sold</Td>
                  <Td right>-{inr(cost)}</Td>
                </tr>
                <tr>
                  <Td className="font-semibold">Gross Profit</Td>
                  <Td right className="font-semibold">
                    {inr(gross)}
                  </Td>
                </tr>
                <tr>
                  <Td>Less: Operating expenses</Td>
                  <Td right>-{inr(expenses)}</Td>
                </tr>
                <tr>
                  <Td className="font-bold text-primary">Net Profit</Td>
                  <Td right className="font-bold text-primary">
                    {inr(net)}
                  </Td>
                </tr>
              </tbody>
            </TableWrap>
          </Card>
        </>
      )}

      {tab === "outstanding" && (
        <>
          <div className="mb-5 grid gap-4 sm:grid-cols-3">
            <StatCard
              label="Total Outstanding"
              value={inr(outstanding.reduce((a, x) => a + x.balance, 0))}
              tone="warning"
            />
            <StatCard label="Open Invoices" value={String(outstanding.length)} tone="info" />
            <StatCard
              label="Overdue Invoices"
              value={String(outstanding.filter((x) => x.overdue > 0).length)}
              tone="danger"
            />
          </div>
          <Card title="Outstanding receivables">
            {outstanding.length === 0 ? (
              <EmptyState message="No outstanding invoices. All payments received." />
            ) : (
              <TableWrap>
                <thead>
                  <tr>
                    <Th>Customer</Th>
                    <Th>Invoice</Th>
                    <Th>Due Date</Th>
                    <Th right>Amount</Th>
                    <Th right>Days Overdue</Th>
                    <Th>Status</Th>
                  </tr>
                </thead>
                <tbody>
                  {outstanding.map((i) => (
                    <tr key={i.id}>
                      <Td className="font-medium">{i.partyName}</Td>
                      <Td>{i.number}</Td>
                      <Td>{dmy(i.dueDate)}</Td>
                      <Td right>{inr(i.balance)}</Td>
                      <Td right>{i.overdue > 0 ? i.overdue : "—"}</Td>
                      <Td>
                        {i.overdue > 0 ? (
                          <Badge tone="danger">Overdue</Badge>
                        ) : (
                          <Badge tone="warning">Due</Badge>
                        )}
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </TableWrap>
            )}
          </Card>
        </>
      )}
    </>
  );
}
