import { useEffect, type ButtonHTMLAttributes, type ReactNode } from "react";

export const cx = (...c: Array<string | false | null | undefined>) =>
  c.filter(Boolean).join(" ");

/* ---------------- Button ---------------- */

type Variant = "primary" | "secondary" | "accent" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
  accent: "bg-accent text-accent-foreground hover:bg-accent/90",
  outline: "border border-border bg-surface text-foreground hover:bg-muted",
  ghost: "text-foreground hover:bg-muted",
  danger: "bg-danger text-primary-foreground hover:bg-danger/90",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return (
    <button
      {...props}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className,
      )}
    />
  );
}

/* ---------------- Card ---------------- */

export function Card({
  children,
  className,
  title,
  action,
}: {
  children: ReactNode;
  className?: string;
  title?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className={cx("card", className)}>
      {(title || action) && (
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
          <h2 className="text-sm font-semibold text-foreground sm:text-base">{title}</h2>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

/* ---------------- Badge ---------------- */

export function Badge({ tone = "muted", children }: { tone?: string; children: ReactNode }) {
  const tones: Record<string, string> = {
    success: "bg-success-soft text-success",
    warning: "bg-warning-soft text-warning",
    danger: "bg-danger-soft text-danger",
    info: "bg-secondary-soft text-secondary",
    accent: "bg-accent-soft text-accent",
    muted: "bg-muted text-muted-foreground",
  };
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
        tones[tone] ?? tones.muted,
      )}
    >
      {children}
    </span>
  );
}

export const statusTone = (s: string) =>
  s === "Paid" || s === "Active" || s === "Completed"
    ? "success"
    : s === "Partial" || s === "Pending" || s === "Low Stock"
      ? "warning"
      : s === "Unpaid" || s === "Out of Stock" || s === "Inactive"
        ? "danger"
        : "muted";

/* ---------------- Form fields ---------------- */

export function Field({
  label,
  children,
  error,
  className,
}: {
  label: string;
  children: ReactNode;
  error?: string;
  className?: string;
}) {
  return (
    <label className={cx("block", className)}>
      <span className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        {label}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs font-medium text-danger">{error}</span>}
    </label>
  );
}

export const inputClass =
  "w-full rounded-lg border border-input bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-secondary focus:outline-none focus:ring-2 focus:ring-ring/30";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cx(inputClass, props.className)} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cx(inputClass, props.className)} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cx(inputClass, props.className)} />;
}

/* ---------------- Modal ---------------- */

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-0 sm:items-center sm:p-4">
      <div
        className={cx(
          "max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-surface shadow-pop sm:rounded-xl",
          wide ? "sm:max-w-4xl" : "sm:max-w-lg",
        )}
      >
        <header className="sticky top-0 flex items-center justify-between border-b border-border bg-surface px-5 py-3">
          <h3 className="text-base font-semibold">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-md px-2 py-1 text-muted-foreground hover:bg-muted"
          >
            ✕
          </button>
        </header>
        <div className="px-5 py-4">{children}</div>
        {footer && (
          <footer className="sticky bottom-0 flex flex-wrap justify-end gap-2 border-t border-border bg-surface px-5 py-3">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open,
  title = "Confirm delete",
  message,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title?: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      footer={
        <>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Delete
          </Button>
        </>
      }
    >
      <p className="text-sm text-muted-foreground">{message}</p>
    </Modal>
  );
}

/* ---------------- Table helpers ---------------- */

export function TableWrap({ children }: { children: ReactNode }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-sm">{children}</table>
    </div>
  );
}

export function Th({ children, right }: { children: ReactNode; right?: boolean }) {
  return (
    <th
      className={cx(
        "border-b border-border bg-muted/60 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground",
        right ? "text-right" : "text-left",
      )}
    >
      {children}
    </th>
  );
}

export function Td({
  children,
  right,
  className,
}: {
  children: ReactNode;
  right?: boolean;
  className?: string;
}) {
  return (
    <td
      className={cx(
        "border-b border-border px-4 py-3 align-middle",
        right ? "text-right" : "text-left",
        className,
      )}
    >
      {children}
    </td>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="px-4 py-12 text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-lg text-muted-foreground">
        ∅
      </div>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-xl font-bold text-primary sm:text-2xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  tone = "info",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: string;
}) {
  const bars: Record<string, string> = {
    info: "bg-secondary",
    accent: "bg-accent",
    success: "bg-success",
    warning: "bg-warning",
    danger: "bg-danger",
    primary: "bg-primary",
  };
  return (
    <div className="card relative overflow-hidden p-4">
      <span className={cx("absolute inset-y-0 left-0 w-1", bars[tone] ?? bars.info)} />
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-xl font-bold text-foreground sm:text-2xl">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
