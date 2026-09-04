import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/components/AdminPage";
import { PartyManager } from "@/components/PartyManager";

export const Route = createFileRoute("/admin/customers")({
  head: () => ({
    meta: [
      { title: "Customers — KVP Polymers LLP" },
      { name: "description", content: "Manage customers, GSTIN details and credit limits." },
      { property: "og:title", content: "Customers — KVP Polymers LLP" },
      { property: "og:description", content: "Customer master with search, filters and CRUD." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <AdminPage>
      <PartyManager kind="customer" />
    </AdminPage>
  ),
});
