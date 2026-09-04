import { docTotals, type Invoice, type Purchase } from "@/lib/mock-data";
import { inr2, dmy } from "@/lib/format";
import { useStore, payStatus, balanceOf } from "@/lib/store";
import { Badge, Button, Modal, statusTone, Td, Th, TableWrap } from "./kit";

type Doc = Invoice | Purchase;

export function InvoicePreview({
  doc,
  kind = "invoice",
  onClose,
}: {
  doc: Doc | null;
  kind?: "invoice" | "purchase";
  onClose: () => void;
}) {
  const { business, invoiceSettings, customers, suppliers } = useStore();
  if (!doc) return null;

  const party = (kind === "invoice" ? customers : suppliers).find((p) => p.id === doc.partyId);
  const t = docTotals(doc.items);
  const status = payStatus(doc);

  return (
    <Modal
      open
      wide
      onClose={onClose}
      title={kind === "invoice" ? "Invoice Preview" : "Purchase Bill Preview"}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={() => window.print()}>Print Invoice</Button>
        </>
      }
    >
      <div className="print-area">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-4">
          <div>
            <h2 className="text-lg font-bold text-primary">{business.name}</h2>
            <p className="text-xs text-muted-foreground">{business.address}</p>
            <p className="text-xs text-muted-foreground">
              Phone: {business.phone} · GSTIN: {business.gstin}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-foreground">{doc.number}</p>
            <p className="text-xs text-muted-foreground">Date: {dmy(doc.date)}</p>
            {"dueDate" in doc && (
              <p className="text-xs text-muted-foreground">Due: {dmy(doc.dueDate)}</p>
            )}
            <div className="mt-2">
              <Badge tone={statusTone(status)}>{status}</Badge>
            </div>
          </div>
        </div>

        <div className="py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {kind === "invoice" ? "Bill To" : "Purchased From"}
          </p>
          <p className="text-sm font-semibold text-foreground">{doc.partyName}</p>
          {party && (
            <>
              <p className="text-xs text-muted-foreground">
                {party.name} · {party.phone}
              </p>
              <p className="text-xs text-muted-foreground">{party.address}</p>
              <p className="text-xs text-muted-foreground">GSTIN: {party.gstin}</p>
            </>
          )}
        </div>

        <TableWrap>
          <thead>
            <tr>
              <Th>Product</Th>
              <Th>SKU</Th>
              <Th right>Qty</Th>
              <Th right>Rate</Th>
              <Th right>Disc %</Th>
              <Th right>Tax %</Th>
              <Th right>Amount</Th>
            </tr>
          </thead>
          <tbody>
            {doc.items.map((l) => {
              const gross = l.qty * l.rate;
              const afterDisc = gross - (gross * l.discount) / 100;
              return (
                <tr key={l.id}>
                  <Td>{l.name}</Td>
                  <Td>{l.sku}</Td>
                  <Td right>
                    {l.qty} {l.unit}
                  </Td>
                  <Td right>{inr2(l.rate)}</Td>
                  <Td right>{l.discount}</Td>
                  <Td right>{l.tax}</Td>
                  <Td right>{inr2(afterDisc + (afterDisc * l.tax) / 100)}</Td>
                </tr>
              );
            })}
          </tbody>
        </TableWrap>

        <div className="mt-4 ml-auto w-full max-w-xs space-y-1.5 text-sm">
          <Row label="Subtotal" value={inr2(t.subtotal)} />
          <Row label="Discount" value={"- " + inr2(t.discount)} />
          <Row label="Tax (GST)" value={inr2(t.tax)} />
          <div className="flex justify-between border-t border-border pt-2 text-base font-bold text-primary">
            <span>Grand Total</span>
            <span>{inr2(doc.total)}</span>
          </div>
          <Row label="Paid" value={inr2(doc.paid)} />
          <Row label="Balance" value={inr2(balanceOf(doc))} />
        </div>

        <p className="mt-6 border-t border-border pt-4 text-center text-sm font-medium text-muted-foreground">
          {invoiceSettings.footer}
        </p>
      </div>
    </Modal>
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
