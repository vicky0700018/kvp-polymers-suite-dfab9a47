import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import * as mock from "./mock-data";
import type {
  Invoice,
  Party,
  Payment,
  Product,
  Purchase,
  StockMove,
} from "./mock-data";

const uid = () => Math.random().toString(36).slice(2, 10);

export interface BusinessProfile {
  name: string;
  owner: string;
  phone: string;
  email: string;
  address: string;
  gstin: string;
  type: string;
}

export interface InvoiceSettings {
  prefix: string;
  defaultTax: number;
  paymentTerms: number;
  footer: string;
}

interface StoreValue {
  products: Product[];
  customers: Party[];
  suppliers: Party[];
  invoices: Invoice[];
  purchases: Purchase[];
  payments: Payment[];
  stockMoves: StockMove[];
  business: BusinessProfile;
  invoiceSettings: InvoiceSettings;
  adminProfile: { name: string; email: string; password: string };

  saveProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  adjustStock: (productId: string, type: StockMove["type"], qty: number, reason: string) => void;

  saveCustomer: (p: Party) => void;
  deleteCustomer: (id: string) => void;
  saveSupplier: (p: Party) => void;
  deleteSupplier: (id: string) => void;

  addInvoice: (i: Omit<Invoice, "id">) => Invoice;
  updateInvoice: (i: Invoice) => void;
  deleteInvoice: (id: string) => void;
  nextInvoiceNumber: () => string;

  addPurchase: (p: Omit<Purchase, "id">) => Purchase;
  deletePurchase: (id: string) => void;
  nextPurchaseNumber: () => string;

  addPayment: (p: Omit<Payment, "id">) => void;
  deletePayment: (id: string) => void;

  setBusiness: (b: BusinessProfile) => void;
  setInvoiceSettings: (s: InvoiceSettings) => void;
  setAdminProfile: (p: { name: string; email: string; password: string }) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(mock.products);
  const [customers, setCustomers] = useState<Party[]>(mock.customers);
  const [suppliers, setSuppliers] = useState<Party[]>(mock.suppliers);
  const [invoices, setInvoices] = useState<Invoice[]>(mock.invoices);
  const [purchases, setPurchases] = useState<Purchase[]>(mock.purchases);
  const [payments, setPayments] = useState<Payment[]>(mock.payments);
  const [stockMoves, setStockMoves] = useState<StockMove[]>(mock.stockMoves);
  const [business, setBusiness] = useState<BusinessProfile>({ ...mock.BUSINESS });
  const [invoiceSettings, setInvoiceSettings] = useState<InvoiceSettings>({
    prefix: "INV-2026-",
    defaultTax: 18,
    paymentTerms: 30,
    footer: "Thank you for doing business with KVP Polymers LLP.",
  });
  const [adminProfile, setAdminProfile] = useState({
    name: "Vaibhav Changdev Jagtap",
    email: mock.DEMO_USER.email,
    password: mock.DEMO_USER.password,
  });

  const value = useMemo<StoreValue>(() => {
    const applyStock = (productId: string, delta: number) =>
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, stock: Math.max(0, p.stock + delta) } : p)),
      );

    return {
      products,
      customers,
      suppliers,
      invoices,
      purchases,
      payments,
      stockMoves,
      business,
      invoiceSettings,
      adminProfile,

      saveProduct: (p) =>
        setProducts((prev) =>
          prev.some((x) => x.id === p.id)
            ? prev.map((x) => (x.id === p.id ? p : x))
            : [{ ...p, id: p.id || "P" + uid() }, ...prev],
        ),
      deleteProduct: (id) => setProducts((prev) => prev.filter((p) => p.id !== id)),
      adjustStock: (productId, type, qty, reason) => {
        const product = products.find((p) => p.id === productId);
        if (!product) return;
        const delta = type === "Stock In" ? qty : type === "Stock Out" ? -qty : qty;
        applyStock(productId, delta);
        setStockMoves((prev) => [
          {
            id: uid(),
            date: new Date().toISOString().slice(0, 10),
            productId,
            productName: product.name,
            type,
            qty: delta,
            reason,
          },
          ...prev,
        ]);
      },

      saveCustomer: (p) =>
        setCustomers((prev) =>
          prev.some((x) => x.id === p.id)
            ? prev.map((x) => (x.id === p.id ? p : x))
            : [{ ...p, id: p.id || "C" + uid() }, ...prev],
        ),
      deleteCustomer: (id) => setCustomers((prev) => prev.filter((p) => p.id !== id)),
      saveSupplier: (p) =>
        setSuppliers((prev) =>
          prev.some((x) => x.id === p.id)
            ? prev.map((x) => (x.id === p.id ? p : x))
            : [{ ...p, id: p.id || "S" + uid() }, ...prev],
        ),
      deleteSupplier: (id) => setSuppliers((prev) => prev.filter((p) => p.id !== id)),

      addInvoice: (i) => {
        const created: Invoice = { ...i, id: "INV" + uid() };
        setInvoices((prev) => [created, ...prev]);
        setProducts((prev) =>
          prev.map((p) => {
            const line = created.items.find((l) => l.productId === p.id);
            return line ? { ...p, stock: Math.max(0, p.stock - line.qty) } : p;
          }),
        );
        setStockMoves((prev) => [
          ...created.items.map((l) => ({
            id: uid(),
            date: created.date,
            productId: l.productId,
            productName: l.name,
            type: "Stock Out" as const,
            qty: -l.qty,
            reason: `Sale ${created.number}`,
          })),
          ...prev,
        ]);
        if (created.paid > 0) {
          setPayments((prev) => [
            {
              id: uid(),
              number: "RCP-" + String(prev.length + 1).padStart(4, "0"),
              type: "in",
              partyName: created.partyName,
              reference: created.number,
              date: created.date,
              amount: created.paid,
              method: "Bank Transfer",
              status: "Completed",
            },
            ...prev,
          ]);
        }
        return created;
      },
      updateInvoice: (i) => setInvoices((prev) => prev.map((x) => (x.id === i.id ? i : x))),
      deleteInvoice: (id) => setInvoices((prev) => prev.filter((x) => x.id !== id)),
      nextInvoiceNumber: () => invoiceSettings.prefix + String(invoices.length + 1).padStart(4, "0"),

      addPurchase: (p) => {
        const created: Purchase = { ...p, id: "PUR" + uid() };
        setPurchases((prev) => [created, ...prev]);
        setProducts((prev) =>
          prev.map((x) => {
            const line = created.items.find((l) => l.productId === x.id);
            return line ? { ...x, stock: x.stock + line.qty } : x;
          }),
        );
        setStockMoves((prev) => [
          ...created.items.map((l) => ({
            id: uid(),
            date: created.date,
            productId: l.productId,
            productName: l.name,
            type: "Stock In" as const,
            qty: l.qty,
            reason: `Purchase ${created.number}`,
          })),
          ...prev,
        ]);
        if (created.paid > 0) {
          setPayments((prev) => [
            {
              id: uid(),
              number: "PAY-" + String(prev.length + 1).padStart(4, "0"),
              type: "out",
              partyName: created.partyName,
              reference: created.number,
              date: created.date,
              amount: created.paid,
              method: "Bank Transfer",
              status: "Completed",
            },
            ...prev,
          ]);
        }
        return created;
      },
      deletePurchase: (id) => setPurchases((prev) => prev.filter((x) => x.id !== id)),
      nextPurchaseNumber: () => "PUR-2026-" + String(purchases.length + 1).padStart(4, "0"),

      addPayment: (p) => setPayments((prev) => [{ ...p, id: uid() }, ...prev]),
      deletePayment: (id) => setPayments((prev) => prev.filter((x) => x.id !== id)),

      setBusiness,
      setInvoiceSettings,
      setAdminProfile,
    };
  }, [
    products,
    customers,
    suppliers,
    invoices,
    purchases,
    payments,
    stockMoves,
    business,
    invoiceSettings,
    adminProfile,
  ]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

export const balanceOf = (doc: { total: number; paid: number }) => doc.total - doc.paid;

export const payStatus = (doc: { total: number; paid: number }): mock.PayStatus =>
  doc.paid >= doc.total ? "Paid" : doc.paid > 0 ? "Partial" : "Unpaid";
