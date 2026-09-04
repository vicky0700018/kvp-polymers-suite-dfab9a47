import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminPage } from "@/components/AdminPage";
import {
  Button,
  Card,
  Field,
  Input,
  PageHeader,
  Select,
  Textarea,
} from "@/components/kit";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({
    meta: [
      { title: "Business Settings — KVP Polymers LLP" },
      {
        name: "description",
        content: "Manage business profile, invoice defaults and admin account settings.",
      },
      { property: "og:title", content: "Business Settings — KVP Polymers LLP" },
      { property: "og:description", content: "Configure the KVP Polymers LLP admin panel." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <AdminPage>
      <SettingsPage />
    </AdminPage>
  ),
});

function Notice({ show, text }: { show: boolean; text: string }) {
  if (!show) return null;
  return (
    <p className="mt-3 rounded-lg bg-success/10 px-3 py-2 text-sm font-medium text-success">
      {text}
    </p>
  );
}

function SettingsPage() {
  const {
    business,
    setBusiness,
    invoiceSettings,
    setInvoiceSettings,
    adminProfile,
    setAdminProfile,
  } = useStore();

  const [biz, setBiz] = useState({ ...business });
  const [inv, setInv] = useState({ ...invoiceSettings });
  const [profile, setProfile] = useState({ ...adminProfile, confirm: adminProfile.password });
  const [saved, setSaved] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const flash = (key: string) => {
    setSaved(key);
    setTimeout(() => setSaved(null), 2500);
  };

  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Business profile, invoice defaults and admin account (demo state only)."
      />

      <div className="grid gap-5 xl:grid-cols-2">
        <Card title="Business Profile">
          <div className="grid gap-4 p-4 sm:grid-cols-2">
            <Field label="Business Name">
              <Input value={biz.name} onChange={(e) => setBiz({ ...biz, name: e.target.value })} />
            </Field>
            <Field label="Owner Name">
              <Input
                value={biz.owner}
                onChange={(e) => setBiz({ ...biz, owner: e.target.value })}
              />
            </Field>
            <Field label="Phone">
              <Input
                value={biz.phone}
                onChange={(e) => setBiz({ ...biz, phone: e.target.value })}
              />
            </Field>
            <Field label="Email">
              <Input
                value={biz.email}
                onChange={(e) => setBiz({ ...biz, email: e.target.value })}
              />
            </Field>
            <Field label="GSTIN">
              <Input
                value={biz.gstin}
                onChange={(e) => setBiz({ ...biz, gstin: e.target.value })}
              />
            </Field>
            <Field label="Business Type">
              <Select
                value={biz.type}
                onChange={(e) => setBiz({ ...biz, type: e.target.value })}
              >
                {[
                  "Manufacturing & Trading (LLP)",
                  "Manufacturing",
                  "Trading & Distribution",
                  "Wholesale",
                ].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Address" className="sm:col-span-2">
              <Textarea
                rows={3}
                value={biz.address}
                onChange={(e) => setBiz({ ...biz, address: e.target.value })}
              />
            </Field>
          </div>
          <div className="border-t border-border p-4">
            <Button
              onClick={() => {
                setBusiness(biz);
                flash("biz");
              }}
            >
              Save Business Profile
            </Button>
            <Notice show={saved === "biz"} text="Business profile updated." />
          </div>
        </Card>

        <div className="space-y-5">
          <Card title="Invoice Settings">
            <div className="grid gap-4 p-4 sm:grid-cols-2">
              <Field label="Invoice Prefix">
                <Input
                  value={inv.prefix}
                  onChange={(e) => setInv({ ...inv, prefix: e.target.value })}
                />
              </Field>
              <Field label="Default Tax Rate (%)">
                <Select
                  value={String(inv.defaultTax)}
                  onChange={(e) => setInv({ ...inv, defaultTax: Number(e.target.value) })}
                >
                  {[0, 5, 12, 18, 28].map((t) => (
                    <option key={t} value={t}>
                      {t}% GST
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Default Payment Terms (days)">
                <Input
                  type="number"
                  min={0}
                  value={inv.paymentTerms}
                  onChange={(e) => setInv({ ...inv, paymentTerms: Number(e.target.value) })}
                />
              </Field>
              <Field label="Invoice Footer" className="sm:col-span-2">
                <Textarea
                  rows={2}
                  value={inv.footer}
                  onChange={(e) => setInv({ ...inv, footer: e.target.value })}
                />
              </Field>
            </div>
            <div className="border-t border-border p-4">
              <Button
                onClick={() => {
                  setInvoiceSettings(inv);
                  flash("inv");
                }}
              >
                Save Invoice Settings
              </Button>
              <Notice show={saved === "inv"} text="Invoice settings updated." />
            </div>
          </Card>

          <Card title="Admin Profile">
            <div className="grid gap-4 p-4 sm:grid-cols-2">
              <Field label="Name">
                <Input
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
              </Field>
              <Field label="Email">
                <Input
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </Field>
              <Field label="Password">
                <Input
                  type="password"
                  value={profile.password}
                  onChange={(e) => setProfile({ ...profile, password: e.target.value })}
                />
              </Field>
              <Field label="Confirm Password" error={error ?? undefined}>
                <Input
                  type="password"
                  value={profile.confirm}
                  onChange={(e) => setProfile({ ...profile, confirm: e.target.value })}
                />
              </Field>
            </div>
            <div className="border-t border-border p-4">
              <Button
                onClick={() => {
                  if (!profile.email.includes("@")) {
                    setError(null);
                    setError("Enter a valid email address.");
                    return;
                  }
                  if (profile.password.length < 6) {
                    setError("Password must be at least 6 characters.");
                    return;
                  }
                  if (profile.password !== profile.confirm) {
                    setError("Passwords do not match.");
                    return;
                  }
                  setError(null);
                  setAdminProfile({
                    name: profile.name,
                    email: profile.email,
                    password: profile.password,
                  });
                  flash("profile");
                }}
              >
                Update Admin Profile
              </Button>
              <Notice show={saved === "profile"} text="Admin profile updated." />
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
