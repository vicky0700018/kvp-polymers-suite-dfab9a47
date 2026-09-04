import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PublicLayout } from "@/components/PublicLayout";
import { Button, Card, Field, Input, Textarea } from "@/components/kit";
import { BUSINESS } from "@/lib/mock-data";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact KVP Polymers LLP — Polymer Supply Enquiries" },
      {
        name: "description",
        content:
          "Contact KVP Polymers LLP for polymer granule, masterbatch and compound enquiries. Phone 2151254354, MIDC Pune, Maharashtra.",
      },
      { property: "og:title", content: "Contact KVP Polymers LLP" },
      {
        property: "og:description",
        content: "Send an enquiry for polymer granules, masterbatch and industrial compounds.",
      },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!/^\d{7,12}$/.test(form.phone.trim())) next.phone = "Enter a valid phone number";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) next.email = "Enter a valid email";
    if (form.message.trim().length < 10) next.message = "Please add a few more details";
    setErrors(next);
    if (Object.keys(next).length === 0) {
      setSent(true);
      setForm({ name: "", phone: "", email: "", message: "" });
    }
  };

  return (
    <PublicLayout>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h1 className="text-3xl font-bold text-primary">Contact Us</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          Share your material requirement and our team will respond with grade options and pricing.
        </p>

        <div className="mt-9 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <Card title="Business details" className="p-0">
            <dl className="space-y-4 p-5">
              {[
                ["Business", BUSINESS.name],
                ["Contact Person", BUSINESS.owner],
                ["Phone", BUSINESS.phone],
                ["Email", BUSINESS.email],
                ["Address", BUSINESS.address],
                ["GSTIN", BUSINESS.gstin],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {k}
                  </dt>
                  <dd className="text-sm font-medium text-foreground">{v}</dd>
                </div>
              ))}
            </dl>
          </Card>

          <Card title="Send an enquiry">
            <form className="space-y-4 p-5" onSubmit={submit} noValidate>
              {sent && (
                <p className="rounded-lg bg-success-soft px-3 py-2 text-sm font-medium text-success">
                  Thank you! Your enquiry has been recorded (demo only).
                </p>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Your Name" error={errors.name}>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Rajesh Deshmukh"
                  />
                </Field>
                <Field label="Phone" error={errors.phone}>
                  <Input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="9822014567"
                  />
                </Field>
              </div>
              <Field label="Email" error={errors.email}>
                <Input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@company.in"
                />
              </Field>
              <Field label="Requirement" error={errors.message}>
                <Textarea
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Grade, quantity and delivery location…"
                />
              </Field>
              <Button type="submit">Send Enquiry</Button>
            </form>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
}
