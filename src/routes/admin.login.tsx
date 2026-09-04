import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button, Card, Field, Input } from "@/components/kit";
import { useAuth } from "@/lib/auth";
import { BUSINESS, DEMO_USER } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin Login — KVP Polymers LLP Business Suite" },
      {
        name: "description",
        content: "Secure admin login for the KVP Polymers LLP billing and inventory panel.",
      },
      { property: "og:title", content: "Admin Login — KVP Polymers LLP" },
      { property: "og:description", content: "Sign in to the KVP Polymers business suite demo." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const { login, isAuthed, ready } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});

  useEffect(() => {
    if (ready && isAuthed) navigate({ to: "/admin/dashboard", replace: true });
  }, [ready, isAuthed, navigate]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) next.email = "Enter a valid email address";
    if (password.length < 6) next.password = "Password must be at least 6 characters";
    if (Object.keys(next).length) return setErrors(next);

    const err = login(email, password, remember);
    if (err) return setErrors({ form: err });
    setErrors({});
    navigate({ to: "/admin/dashboard", replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              KVP
            </span>
            <span className="text-base font-bold text-primary">{BUSINESS.name}</span>
          </Link>
          <Link to="/">
            <Button variant="outline" size="sm">
              Back to Website
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <Card className="p-6 sm:p-7">
            <h1 className="text-2xl font-bold text-primary">Admin Login</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign in to manage billing, inventory and reports.
            </p>

            <form className="mt-6 space-y-4" onSubmit={submit} noValidate>
              {errors.form && (
                <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm font-medium text-danger">
                  {errors.form}
                </p>
              )}
              <Field label="Email / Username" error={errors.email}>
                <Input
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@kvppolymers.com"
                />
              </Field>
              <Field label="Password" error={errors.password}>
                <Input
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </Field>
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-input accent-[color:var(--color-secondary)]"
                />
                Remember me
              </label>
              <Button type="submit" size="lg" className="w-full">
                Login
              </Button>
            </form>

            <div className="mt-6 rounded-lg border border-dashed border-border bg-muted/60 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Demo Login Credentials
              </p>
              <p className="mt-1 text-sm font-medium text-foreground">Email: {DEMO_USER.email}</p>
              <p className="text-sm font-medium text-foreground">
                Password: {DEMO_USER.password}
              </p>
              <button
                type="button"
                onClick={() => {
                  setEmail(DEMO_USER.email);
                  setPassword(DEMO_USER.password);
                }}
                className="mt-2 text-xs font-semibold text-secondary underline"
              >
                Fill demo credentials
              </button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
