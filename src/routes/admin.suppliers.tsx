import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/components/AdminPage";
import { PartyManager } from "@/components/PartyManager";

export const Route = createFileRoute("/admin/suppliers")({
  head: () => ({
    meta: [
      { title: "Suppliers — KVP Polymers LLP" },
      { name: "description", content: "Manage polymer raw material suppliers and payables." },
      { property: "og:title", content: "Suppliers — KVP Polymers LLP" },
      { property: "og:description", content: "Supplier master with search, filters and CRUD." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <AdminPage>
      <PartyManager kind="supplier" />
    </AdminPage>
  ),
});
