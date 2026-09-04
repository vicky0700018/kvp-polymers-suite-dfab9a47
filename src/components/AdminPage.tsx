import { useNavigate } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { AdminLayout } from "./AdminLayout";

export function AdminPage({ children }: { children: ReactNode }) {
  const { ready, isAuthed } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && !isAuthed) navigate({ to: "/admin/login", replace: true });
  }, [ready, isAuthed, navigate]);

  if (!ready || !isAuthed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="w-full max-w-md space-y-3 px-6">
          <div className="h-8 animate-pulse rounded-md bg-muted" />
          <div className="h-24 animate-pulse rounded-md bg-muted" />
          <div className="h-24 animate-pulse rounded-md bg-muted" />
          <p className="text-center text-sm text-muted-foreground">Checking admin session…</p>
        </div>
      </div>
    );
  }

  return <AdminLayout>{children}</AdminLayout>;
}
