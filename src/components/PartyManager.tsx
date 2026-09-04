import { useMemo, useState } from "react";
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
} from "./kit";
import { inr } from "@/lib/format";
import type { Party } from "@/lib/mock-data";
import { useStore, balanceOf } from "@/lib/store";

const blank: Party = {
  id: "",
  name: "",
  company: "",
  phone: "",
  email: "",
  address: "",
  gstin: "",
  openingBalance: 0,
  creditLimit: 0,
  status: "Active",
};

export function PartyManager({ kind }: { kind: "customer" | "supplier" }) {
  const store = useStore();
  const isCustomer = kind === "customer";
  const list = isCustomer ? store.customers : store.suppliers;
  const save = isCustomer ? store.saveCustomer : store.saveSupplier;
  const remove = isCustomer ? store.deleteCustomer : store.deleteSupplier;
  const docs = isCustomer ? store.invoices : store.purchases;

  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const [form, setForm] = useState<Party | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toDelete, setToDelete] = useState<Party | null>(null);
  const [view, setView] = useState<Party | null>(null);

  const outstandingOf = (p: Party) =>
    docs.filter((d) => d.partyId === p.id).reduce((s, d) => s + balanceOf(d), 0);

  const rows = useMemo(
    () =>
      list.filter(
        (p) =>
          (p.name + p.company + p.phone + p.gstin)
            .toLowerCase()
            .includes(q.toLowerCase().trim()) && (status === "All" || p.status === status),
      ),
    [list, q, status],
  );

  const set = (patch: Partial<Party>) => setForm((f) => (f ? { ...f, ...patch } : f));

  const submit = () => {
    if (!form) return;
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.company.trim()) e.company = "Company name is required";
    if (!/^\d{10}$/.test(form.phone.trim())) e.phone = "Enter a valid 10 digit phone number";
    if (form.email.trim() && !/^\S+@\S+\.\S+$/.test(form.email.trim()))
      e.email = "Enter a valid email address";
    setErrors(e);
    if (Object.keys(e).length) return;
    save(form);
    setForm(null);
  };

  const title = isCustomer ? "Customers" : "Suppliers";
  const totalOutstanding = list.reduce((s, p) => s + outstandingOf(p), 0);

  return (
    <div>
      <PageHeader
        title={title}
        subtitle={
          isCustomer
            ? "Manage buyers of KVP Polymers LLP and their credit terms"
            : "Manage raw material suppliers and payables"
        }
        action={
          <Button
            onClick={() => {
              setErrors({});
              setForm({ ...blank });
            }}
          >
            + Add {isCustomer ? "Customer" : "Supplier"}
          </Button>
        }
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label={`Total ${title}`} value={String(list.length)} tone="primary" />
        <StatCard
          label="Active"
          value={String(list.filter((p) => p.status === "Active").length)}
          tone="success"
        />
        <StatCard
          label={isCustomer ? "Total Receivable" : "Total Payable"}
          value={inr(totalOutstanding)}
          tone={isCustomer ? "accent" : "warning"}
        />
        <StatCard
          label="Opening Balance"
          value={inr(list.reduce((s, p) => s + p.openingBalance, 0))}
          tone="info"
        />
      </div>

      <Card
        title={`${title} List`}
        action={
          <div className="flex flex-wrap gap-2">
            <Input
              placeholder="Search name, company, phone…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="sm:w-64"
            />
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="sm:w-40"
            >
              <option>All</option>
              <option>Active</option>
              <option>Inactive</option>
            </Select>
          </div>
        }
      >
        {rows.length === 0 ? (
          <EmptyState message={`No ${title.toLowerCase()} found. Try a different search.`} />
        ) : (
          <TableWrap>
            <thead>
              <tr>
                <Th>Name</Th>
                <Th>Company</Th>
                <Th>Phone</Th>
                <Th>GSTIN</Th>
                <Th right>{isCustomer ? "Credit Limit" : "Opening Bal."}</Th>
                <Th right>{isCustomer ? "Receivable" : "Payable"}</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className="hover:bg-muted/40">
                  <Td className="font-medium">{p.name}</Td>
                  <Td>{p.company}</Td>
                  <Td>{p.phone}</Td>
                  <Td>{p.gstin || "—"}</Td>
                  <Td right>{inr(isCustomer ? p.creditLimit : p.openingBalance)}</Td>
                  <Td right className="font-semibold">
                    {inr(outstandingOf(p))}
                  </Td>
                  <Td>
                    <Badge tone={statusTone(p.status)}>{p.status}</Badge>
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
        title={`${form?.id ? "Edit" : "Add"} ${isCustomer ? "Customer" : "Supplier"}`}
        footer={
          <>
            <Button variant="outline" onClick={() => setForm(null)}>
              Cancel
            </Button>
            <Button onClick={submit}>Save</Button>
          </>
        }
      >
        {form && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" error={errors.name}>
              <Input value={form.name} onChange={(e) => set({ name: e.target.value })} />
            </Field>
            <Field label="Company Name" error={errors.company}>
              <Input value={form.company} onChange={(e) => set({ company: e.target.value })} />
            </Field>
            <Field label="Phone" error={errors.phone}>
              <Input value={form.phone} onChange={(e) => set({ phone: e.target.value })} />
            </Field>
            <Field label="Email" error={errors.email}>
              <Input value={form.email} onChange={(e) => set({ email: e.target.value })} />
            </Field>
            <Field label="Address" className="sm:col-span-2">
              <Textarea
                rows={2}
                value={form.address}
                onChange={(e) => set({ address: e.target.value })}
              />
            </Field>
            <Field label="GSTIN">
              <Input value={form.gstin} onChange={(e) => set({ gstin: e.target.value })} />
            </Field>
            <Field label="Opening Balance (₹)">
              <Input
                type="number"
                value={form.openingBalance}
                onChange={(e) => set({ openingBalance: Number(e.target.value) })}
              />
            </Field>
            {isCustomer && (
              <Field label="Credit Limit (₹)">
                <Input
                  type="number"
                  value={form.creditLimit}
                  onChange={(e) => set({ creditLimit: Number(e.target.value) })}
                />
              </Field>
            )}
            <Field label="Status">
              <Select
                value={form.status}
                onChange={(e) => set({ status: e.target.value as Party["status"] })}
              >
                <option>Active</option>
                <option>Inactive</option>
              </Select>
            </Field>
          </div>
        )}
      </Modal>

      <Modal
        open={!!view}
        onClose={() => setView(null)}
        title={view?.company ?? ""}
        footer={
          <Button variant="outline" onClick={() => setView(null)}>
            Close
          </Button>
        }
      >
        {view && (
          <dl className="grid gap-3 sm:grid-cols-2 text-sm">
            {[
              ["Contact Person", view.name],
              ["Phone", view.phone],
              ["Email", view.email || "—"],
              ["GSTIN", view.gstin || "—"],
              ["Address", view.address || "—"],
              ["Opening Balance", inr(view.openingBalance)],
              [isCustomer ? "Credit Limit" : "Payable", inr(isCustomer ? view.creditLimit : outstandingOf(view))],
              ["Status", view.status],
            ].map(([k, v]) => (
              <div key={k as string}>
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {k}
                </dt>
                <dd className="mt-0.5 text-foreground">{v}</dd>
              </div>
            ))}
          </dl>
        )}
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        message={`Delete ${toDelete?.company}? This cannot be undone in this demo.`}
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete) remove(toDelete.id);
          setToDelete(null);
        }}
      />
    </div>
  );
}
