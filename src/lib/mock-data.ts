export type Status = "Active" | "Inactive";
export type PayStatus = "Paid" | "Partial" | "Unpaid";
export type PayMethod = "Cash" | "Bank Transfer" | "UPI" | "Cheque";

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  description: string;
  unit: string;
  purchasePrice: number;
  sellingPrice: number;
  stock: number;
  minStock: number;
  taxRate: number;
  status: Status;
}

export interface Party {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  address: string;
  gstin: string;
  openingBalance: number;
  creditLimit: number;
  status: Status;
}

export interface LineItem {
  id: string;
  productId: string;
  name: string;
  sku: string;
  qty: number;
  unit: string;
  rate: number;
  discount: number;
  tax: number;
}

export interface Invoice {
  id: string;
  number: string;
  partyId: string;
  partyName: string;
  date: string;
  dueDate: string;
  items: LineItem[];
  total: number;
  paid: number;
  notes: string;
}

export interface Purchase {
  id: string;
  number: string;
  partyId: string;
  partyName: string;
  date: string;
  items: LineItem[];
  total: number;
  paid: number;
  notes: string;
}

export interface Payment {
  id: string;
  number: string;
  type: "in" | "out";
  partyName: string;
  reference: string;
  date: string;
  amount: number;
  method: PayMethod;
  status: "Completed" | "Pending";
}

export interface StockMove {
  id: string;
  date: string;
  productId: string;
  productName: string;
  type: "Stock In" | "Stock Out" | "Adjustment";
  qty: number;
  reason: string;
}

export const BUSINESS = {
  name: "KVP Polymers LLP",
  owner: "Vaibhav Changdev Jagtap",
  phone: "2151254354",
  email: "info@kvppolymers.com",
  address: "MIDC Industrial Area, Pune, Maharashtra",
  gstin: "27AAJFK1234M1ZQ",
  type: "Manufacturing & Trading (LLP)",
};

export const DEMO_USER = { email: "admin@kvppolymers.com", password: "admin123" };

export const CATEGORIES = [
  "Raw Polymer",
  "Recycled Polymer",
  "Masterbatch",
  "Compound",
  "Engineering Plastic",
];

export const UNITS = ["Kg", "MT", "Bag"];

export const products: Product[] = [
  ["PP Granules (Natural)", "PP-NAT-001", "Raw Polymer", "Kg", 92, 108, 12400, 3000, 18],
  ["HDPE Granules Blow Grade", "HDPE-BG-002", "Raw Polymer", "Kg", 96, 114, 8600, 2500, 18],
  ["LDPE Granules Film Grade", "LDPE-FG-003", "Raw Polymer", "Kg", 104, 122, 1800, 2000, 18],
  ["PVC Resin K-67", "PVC-K67-004", "Raw Polymer", "Kg", 78, 94, 15400, 4000, 18],
  ["ABS Granules Natural", "ABS-NAT-005", "Engineering Plastic", "Kg", 168, 196, 940, 1200, 18],
  ["Polymer Compound PP-TF20", "CMP-TF20-006", "Compound", "Kg", 124, 148, 5200, 1500, 18],
  ["White Masterbatch 60%", "MB-WHT-007", "Masterbatch", "Bag", 1450, 1720, 210, 60, 18],
  ["Black Masterbatch 40%", "MB-BLK-008", "Masterbatch", "Bag", 1180, 1420, 38, 60, 18],
  ["Recycled PP Granules", "RPP-GRY-009", "Recycled Polymer", "Kg", 62, 78, 19800, 5000, 12],
  ["Recycled HDPE Granules", "RHDPE-010", "Recycled Polymer", "Kg", 58, 72, 2100, 3000, 12],
  ["Industrial Polymer Compound", "CMP-IND-011", "Compound", "MT", 132000, 158000, 14, 5, 18],
  ["Nylon 6 Granules", "NY6-012", "Engineering Plastic", "Kg", 214, 252, 640, 800, 18],
  ["Polycarbonate Granules", "PC-013", "Engineering Plastic", "Kg", 268, 312, 0, 400, 18],
  ["PP Copolymer Injection Grade", "PP-CP-014", "Raw Polymer", "Kg", 98, 116, 7300, 2500, 18],
  ["Calcium Filler Masterbatch", "MB-CAL-015", "Masterbatch", "Bag", 720, 880, 24, 50, 18],
].map((r, i) => ({
  id: "P" + String(i + 1).padStart(3, "0"),
  name: r[0] as string,
  sku: r[1] as string,
  category: r[2] as string,
  description: `Industrial grade ${r[0]} supplied by KVP Polymers LLP.`,
  unit: r[3] as string,
  purchasePrice: r[4] as number,
  sellingPrice: r[5] as number,
  stock: r[6] as number,
  minStock: r[7] as number,
  taxRate: r[8] as number,
  status: "Active" as Status,
}));

export const customers: Party[] = [
  ["Rajesh Deshmukh", "Shree Plastic Industries", "9822014567", "rajesh@shreeplastic.in", "Plot 42, MIDC Bhosari, Pune 411026", "27AACCS4567L1Z2", 84500, 500000],
  ["Anita Sharma", "Sharma Packaging Pvt Ltd", "9811223344", "anita@sharmapack.com", "B-19, Wagle Estate, Thane 400604", "27AADCS7788K1Z8", 42300, 300000],
  ["Suresh Patil", "Patil Moulders", "9890112233", "suresh@patilmoulders.in", "Gat 118, Chakan, Pune 410501", "27AAEFP1122R1ZK", 0, 250000],
  ["Farid Shaikh", "Metro Poly Products", "9930445566", "farid@metropoly.in", "Andheri East, Mumbai 400093", "27AAGCM3344N1Z5", 128400, 750000],
  ["Kavita Joshi", "Joshi Containers LLP", "9765001122", "kavita@joshicontainers.com", "Ranjangaon MIDC, Pune 412220", "27AAKFJ9911P1Z1", 26900, 200000],
  ["Imran Qureshi", "Nashik Plastic Works", "9422339900", "imran@nashikplastic.in", "Satpur MIDC, Nashik 422007", "27AAJFN5566Q1ZM", 0, 150000],
  ["Deepak Nair", "Southern Polymers", "9845667788", "deepak@southpoly.co.in", "Peenya Industrial Area, Bengaluru 560058", "29AAFCS8899T1Z9", 63500, 400000],
].map((r, i) => ({
  id: "C" + String(i + 1).padStart(3, "0"),
  name: r[0] as string,
  company: r[1] as string,
  phone: r[2] as string,
  email: r[3] as string,
  address: r[4] as string,
  gstin: r[5] as string,
  openingBalance: r[6] as number,
  creditLimit: r[7] as number,
  status: "Active" as Status,
}));

export const suppliers: Party[] = [
  ["Mahesh Agarwal", "Reliance Polymer Traders", "9820011223", "mahesh@rpolytraders.in", "Nariman Point, Mumbai 400021", "27AABCR1234F1Z6", 184000, 0],
  ["Nitin Kulkarni", "Gujarat Petrochem Supply", "9879012345", "nitin@gujpetro.in", "GIDC Vapi, Gujarat 396195", "24AACCG5678H1Z3", 96500, 0],
  ["Sanjay Verma", "Haldia Resin Distributors", "9831022110", "sanjay@haldiaresin.in", "Haldia, West Bengal 721602", "19AAECH3344J1ZP", 0, 0],
  ["Pooja Mehta", "Colour Tech Masterbatch", "9925667788", "pooja@colourtech.in", "Changodar, Ahmedabad 382213", "24AAFCC7788L1Z0", 41200, 0],
  ["Ramesh Yadav", "Green Cycle Recyclers", "9765443322", "ramesh@greencycle.in", "Kurkumbh MIDC, Pune 413802", "27AAGFG9900M1ZT", 22800, 0],
].map((r, i) => ({
  id: "S" + String(i + 1).padStart(3, "0"),
  name: r[0] as string,
  company: r[1] as string,
  phone: r[2] as string,
  email: r[3] as string,
  address: r[4] as string,
  gstin: r[5] as string,
  openingBalance: r[6] as number,
  creditLimit: 0,
  status: "Active" as Status,
}));

const li = (p: Product, qty: number, rate: number, discount = 0): LineItem => ({
  id: Math.random().toString(36).slice(2, 9),
  productId: p.id,
  name: p.name,
  sku: p.sku,
  qty,
  unit: p.unit,
  rate,
  discount,
  tax: p.taxRate,
});

export const lineTotal = (l: LineItem) => {
  const gross = l.qty * l.rate;
  const afterDisc = gross - (gross * l.discount) / 100;
  return afterDisc + (afterDisc * l.tax) / 100;
};

export const docTotals = (items: LineItem[]) => {
  let subtotal = 0;
  let discount = 0;
  let tax = 0;
  for (const l of items) {
    const gross = l.qty * l.rate;
    const d = (gross * l.discount) / 100;
    const t = ((gross - d) * l.tax) / 100;
    subtotal += gross;
    discount += d;
    tax += t;
  }
  return { subtotal, discount, tax, total: subtotal - discount + tax };
};

const d = (offset: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + offset);
  return dt.toISOString().slice(0, 10);
};

const mk = (
  prefix: string,
  i: number,
  partyList: Party[],
  pi: number,
  items: LineItem[],
  paidRatio: number,
  dateOffset: number,
) => {
  const totals = docTotals(items);
  return {
    id: prefix + i,
    number: `${prefix}-2026-${String(i).padStart(4, "0")}`,
    partyId: partyList[pi].id,
    partyName: partyList[pi].company,
    date: d(dateOffset),
    dueDate: d(dateOffset + 30),
    items,
    total: Math.round(totals.total),
    paid: Math.round(totals.total * paidRatio),
    notes: "",
  };
};

export const invoices: Invoice[] = [
  mk("INV", 1, customers, 0, [li(products[0], 3000, 108), li(products[6], 20, 1720)], 1, -3),
  mk("INV", 2, customers, 3, [li(products[3], 5000, 94, 2)], 0.4, -6),
  mk("INV", 3, customers, 1, [li(products[8], 8000, 78), li(products[7], 10, 1420)], 0, -9),
  mk("INV", 4, customers, 2, [li(products[1], 2500, 114)], 1, -12),
  mk("INV", 5, customers, 4, [li(products[5], 1500, 148, 3)], 0.5, -16),
  mk("INV", 6, customers, 6, [li(products[10], 2, 158000)], 0, -22),
  mk("INV", 7, customers, 5, [li(products[13], 4000, 116), li(products[14], 15, 880)], 1, -27),
  mk("INV", 8, customers, 0, [li(products[11], 500, 252)], 0.25, -34),
];

export const purchases: Purchase[] = [
  mk("PUR", 1, suppliers, 0, [li(products[0], 10000, 92)], 1, -4),
  mk("PUR", 2, suppliers, 1, [li(products[3], 12000, 78)], 0.5, -8),
  mk("PUR", 3, suppliers, 3, [li(products[6], 100, 1450), li(products[7], 50, 1180)], 0, -13),
  mk("PUR", 4, suppliers, 4, [li(products[8], 15000, 62)], 1, -19),
  mk("PUR", 5, suppliers, 2, [li(products[4], 1000, 168)], 0.6, -25),
  mk("PUR", 6, suppliers, 1, [li(products[1], 6000, 96)], 0, -31),
] as unknown as Purchase[];

export const payments: Payment[] = [
  { id: "R1", number: "RCP-0001", type: "in", partyName: customers[0].company, reference: invoices[0].number, date: d(-3), amount: invoices[0].paid, method: "Bank Transfer", status: "Completed" },
  { id: "R2", number: "RCP-0002", type: "in", partyName: customers[3].company, reference: invoices[1].number, date: d(-5), amount: invoices[1].paid, method: "UPI", status: "Completed" },
  { id: "R3", number: "RCP-0003", type: "in", partyName: customers[2].company, reference: invoices[3].number, date: d(-11), amount: invoices[3].paid, method: "Cheque", status: "Completed" },
  { id: "R4", number: "RCP-0004", type: "in", partyName: customers[4].company, reference: invoices[4].number, date: d(-14), amount: invoices[4].paid, method: "Cash", status: "Pending" },
  { id: "R5", number: "RCP-0005", type: "in", partyName: customers[5].company, reference: invoices[6].number, date: d(-26), amount: invoices[6].paid, method: "Bank Transfer", status: "Completed" },
  { id: "M1", number: "PAY-0001", type: "out", partyName: suppliers[0].company, reference: purchases[0].number, date: d(-4), amount: purchases[0].paid, method: "Bank Transfer", status: "Completed" },
  { id: "M2", number: "PAY-0002", type: "out", partyName: suppliers[1].company, reference: purchases[1].number, date: d(-7), amount: purchases[1].paid, method: "Cheque", status: "Completed" },
  { id: "M3", number: "PAY-0003", type: "out", partyName: suppliers[4].company, reference: purchases[3].number, date: d(-18), amount: purchases[3].paid, method: "UPI", status: "Completed" },
  { id: "M4", number: "PAY-0004", type: "out", partyName: suppliers[2].company, reference: purchases[4].number, date: d(-24), amount: purchases[4].paid, method: "Cash", status: "Pending" },
];

export const stockMoves: StockMove[] = [
  { id: "SM1", date: d(-2), productId: products[0].id, productName: products[0].name, type: "Stock In", qty: 10000, reason: "Purchase PUR-2026-0001" },
  { id: "SM2", date: d(-3), productId: products[0].id, productName: products[0].name, type: "Stock Out", qty: 3000, reason: "Sale INV-2026-0001" },
  { id: "SM3", date: d(-6), productId: products[3].id, productName: products[3].name, type: "Stock Out", qty: 5000, reason: "Sale INV-2026-0002" },
  { id: "SM4", date: d(-8), productId: products[3].id, productName: products[3].name, type: "Stock In", qty: 12000, reason: "Purchase PUR-2026-0002" },
  { id: "SM5", date: d(-10), productId: products[7].id, productName: products[7].name, type: "Adjustment", qty: -4, reason: "Damaged bags written off" },
];
