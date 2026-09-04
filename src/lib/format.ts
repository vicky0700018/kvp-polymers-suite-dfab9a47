export const inr = (n: number) =>
  "₹" +
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(Math.round(n || 0));

export const inr2 = (n: number) =>
  "₹" +
  new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n || 0);

export const dmy = (iso: string) => {
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const today = () => new Date().toISOString().slice(0, 10);

export const daysBetween = (fromIso: string, toIso: string) =>
  Math.round(
    (new Date(toIso + "T00:00:00").getTime() - new Date(fromIso + "T00:00:00").getTime()) /
      86400000,
  );

export const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
};
