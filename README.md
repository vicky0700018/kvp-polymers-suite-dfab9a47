# KVP Polymers Suite

https://github.com/kumarianisha32399-maker/kvp-polymers-suite-7ed7b956

copy this repo

initial prompt
# Build a Vyapar-Inspired Business Management Software Demo for KVP Polymers LLP

Create a **modern, professional, responsive business management software demo for KVP Polymers LLP**, inspired by the overall usability and workflow of apps like **Vyapar**.

This is NOT a simple portfolio website. It should feel like a **real business management / billing / inventory software dashboard** that a polymer/manufacturing/trading business could use.

## Client Details

* **Client Name:** Vaibhav Changdev Jagtap
* **Business Name:** KVP Polymers LLP
* **Address:** Not provided
* **Phone:** 2151254354
* **Email:** Not provided

---

# IMPORTANT TECHNOLOGY REQUIREMENTS

Use ONLY:

* **React**
* **Vite**
* **Tailwind CSS**

Do NOT use any other technology, framework, backend, database, or external library.

### Strictly DO NOT use:

* No database
* No Supabase
* No Firebase
* No Node/Express backend
* No MongoDB
* No PostgreSQL
* No MySQL
* No external API
* No authentication library
* No UI component library
* No third-party component framework
* No unnecessary npm libraries

Everything must work using **React state, local mock data, and frontend logic only**.

Use reusable React components and Tailwind CSS for the complete UI.

---

# CORE REQUIREMENT

Build a **Vyapar-inspired ERP / business management demo** for KVP Polymers LLP.

The application should include:

1. Public landing/login experience
2. Admin Login
3. Admin Dashboard
4. Sales & Billing
5. Purchase Management
6. Inventory / Stock Management
7. Products
8. Customers
9. Suppliers
10. Payments
11. Ledger
12. Reports
13. Business Settings

All important modules should be manageable from the **Admin Panel**.

Use **mock data only** and make the UI interactive using React state.

---

# DESIGN DIRECTION

The business is related to **Polymers / Industrial Products / Manufacturing / Trading**.

Therefore, use a professional **industrial-business color palette**.

### Recommended Brand Palette

* **Primary:** Deep Navy Blue `#123B5D`
* **Secondary:** Industrial Blue `#1F6F9F`
* **Accent:** Teal `#159A9C`
* **Background:** `#F5F8FA`
* **White:** `#FFFFFF`
* **Dark Text:** `#1E293B`
* **Success:** `#16A34A`
* **Warning:** `#F59E0B`
* **Danger:** `#DC2626`

Keep the overall interface **professional, clean, modern and trustworthy**.

Do NOT make the website overly dark.

Avoid excessive gradients, neon colors, glassmorphism, excessive animations, or flashy effects.

The UI should look like a **professional Indian business/ERP application**, not a gaming website.

---

# PUBLIC LANDING PAGE

Create a clean landing page introducing KVP Polymers LLP and its software/business management system.

## Navbar

Include:

* KVP Polymers LLP logo/text
* Home
* About
* Products
* Services
* Contact
* Admin Login

Add a clear **Admin Login** button on the right.

---

# HERO SECTION

Create a professional hero section.

Headline:

**Smart Business Management for KVP Polymers LLP**

Supporting text:

**Manage billing, inventory, sales, purchases, customers and business reports from one simple and powerful platform.**

Add CTA buttons:

* Get Started
* Admin Login

### Hero Banner Image

The hero section MUST contain a large professional banner image related to:

* Polymer manufacturing
* Plastic granules
* Industrial polymer products
* Modern manufacturing facility
* Polymer raw materials
* Industrial production

Use a suitable professional industrial/polymer visual.

The image should look premium and relevant to the business.

Do not use an unrelated generic office image.

---

# ADMIN LOGIN

Create a dedicated Admin Login page.

Fields:

* Email / Username
* Password
* Remember Me
* Login button

Since this is a frontend-only demo, use a **hardcoded demo login**.

Example:

**Username:** [admin@kvppolymers.com](mailto:admin@kvppolymers.com)
**Password:** admin123

After successful login, redirect to:

`/admin/dashboard`

Show a small "Demo Login Credentials" helper on the login page.

Add proper validation and error messages.

---

# ADMIN PANEL

The Admin Panel is the main part of the application.

Create a professional ERP-style layout.

## Admin Layout

### Sidebar

Include:

* Dashboard
* Sales

  * Invoices
  * Create Invoice
  * Payments Received
* Purchases

  * Purchase Bills
  * Create Purchase
  * Payments Made
* Inventory

  * Products
  * Stock
  * Stock Adjustment
* Parties

  * Customers
  * Suppliers
* Accounting

  * Ledger
  * Transactions
* Reports

  * Sales Report
  * Purchase Report
  * Stock Report
  * Profit & Loss
  * Outstanding Report
* Settings

At the bottom:

* Admin Profile
* Logout

Make the sidebar responsive.

On mobile, convert it into a collapsible sidebar/menu.

---

# ADMIN DASHBOARD

Create a rich but clean dashboard.

Top header:

**Good Morning, Admin**

Show business name:

**KVP Polymers LLP**

### KPI Cards

Display:

* Total Sales
* Total Purchases
* Total Receivables
* Total Payables
* Total Products
* Low Stock Items

Use realistic mock values.

Example:

Sales: ₹12,84,500
Purchases: ₹8,42,300
Receivables: ₹3,45,600
Payables: ₹2,12,800
Products: 126
Low Stock: 8

---

# DASHBOARD SECTIONS

Add:

### Sales Overview

Create a simple sales performance visualization using **CSS/HTML/React only**.

Do NOT install chart libraries.

Use simple bars/progress indicators/cards.

### Recent Sales

Table columns:

* Invoice No.
* Customer
* Date
* Amount
* Payment Status
* Status
* Action

### Recent Purchases

Columns:

* Bill No.
* Supplier
* Date
* Amount
* Payment Status

### Low Stock Alert

Show products that are below their minimum stock level.

Add:

**View Inventory**

button.

### Outstanding Payments

Show:

* Customer
* Invoice
* Due Date
* Amount
* Status

---

# SALES & BILLING MODULE

Create a complete frontend billing interface inspired by Vyapar-style invoice management.

## Invoice List

Show:

* Invoice Number
* Customer
* Date
* Due Date
* Total
* Paid
* Balance
* Status
* Actions

Actions:

* View
* Edit
* Delete
* Print
* Download

Since there is no backend, these should operate on mock/local React state.

---

# CREATE INVOICE

Create a professional invoice creation page.

Fields:

### Customer

Dropdown/select customer.

### Invoice Information

* Invoice Number
* Invoice Date
* Due Date

### Product Table

Columns:

* Product
* SKU
* Quantity
* Unit
* Rate
* Discount
* Tax
* Amount
* Remove

Allow admin to:

* Add Product
* Remove Product
* Change Quantity
* Change Rate
* Apply Discount

Automatically calculate:

* Subtotal
* Discount
* Tax
* Grand Total

Buttons:

* Save Invoice
* Save & Print
* Cancel

---

# PURCHASE MODULE

Create:

### Purchase Bills

Table with:

* Bill Number
* Supplier
* Date
* Amount
* Paid
* Balance
* Status

### Create Purchase

Allow admin to:

* Select supplier
* Add products
* Quantity
* Purchase rate
* Discount
* Tax
* Total

Calculate totals dynamically.

---

# INVENTORY MODULE

Create a professional inventory management interface.

## Product List

Columns:

* Product Name
* SKU
* Category
* Stock
* Unit
* Purchase Price
* Selling Price
* Status
* Actions

Add:

**+ Add Product**

button.

---

# ADD PRODUCT

Form:

* Product Name
* SKU
* Category
* Description
* Unit
* Purchase Price
* Selling Price
* Opening Stock
* Minimum Stock
* Tax Rate
* Product Status

Save product into local React state.

---

# STOCK MANAGEMENT

Show:

* Current Stock
* Stock In
* Stock Out
* Low Stock
* Out of Stock

Allow:

* Stock Adjustment
* Add Stock
* Remove Stock

Use mock state changes so the demo feels functional.

---

# POLYMER-SPECIFIC MOCK PRODUCTS

Use realistic polymer-related sample products.

Examples:

* PP Granules
* HDPE Granules
* LDPE Granules
* PVC Resin
* ABS Granules
* Polymer Compound
* Plastic Masterbatch
* Recycled PP Granules
* Industrial Polymer Compound
* Engineering Plastic Granules

Add realistic units such as:

* Kg
* MT
* Bag

Use realistic Indian Rupee pricing.

---

# CUSTOMER MODULE

Create customer management.

Fields:

* Customer Name
* Company Name
* Phone
* Email
* Address
* GSTIN
* Opening Balance
* Credit Limit
* Status

Customer list should support:

* Search
* Filter
* View
* Edit
* Delete
* Add Customer

---

# SUPPLIER MODULE

Create supplier management with:

* Supplier Name
* Company
* Phone
* Email
* Address
* GSTIN
* Opening Balance
* Payable Amount
* Status

Include:

* Add Supplier
* Edit
* Delete
* View

---

# PAYMENTS MODULE

Create two sections:

### Payments Received

Show:

* Receipt No.
* Customer
* Invoice
* Date
* Amount
* Payment Method
* Status

### Payments Made

Show:

* Payment No.
* Supplier
* Bill
* Date
* Amount
* Payment Method
* Status

Payment methods:

* Cash
* Bank Transfer
* UPI
* Cheque

---

# LEDGER MODULE

Create a professional ledger page.

Allow admin to select:

* Customer
* Supplier
* Date Range

Show:

* Date
* Description
* Reference
* Debit
* Credit
* Balance

Add:

* Opening Balance
* Closing Balance
* Total Debit
* Total Credit

---

# REPORTS MODULE

Create report pages using mock data.

Include:

### Sales Report

Filters:

* Today
* This Week
* This Month
* Custom Range

Show:

* Total Sales
* Paid Sales
* Pending Sales
* Invoice Count

### Purchase Report

Show:

* Total Purchase
* Paid Purchase
* Pending Purchase

### Stock Report

Show:

* Total Products
* Total Stock
* Low Stock
* Out of Stock

### Profit & Loss

Show:

* Revenue
* Cost
* Gross Profit
* Expenses
* Net Profit

### Outstanding Report

Show:

* Customer
* Invoice
* Due Date
* Amount
* Days Overdue

---

# SETTINGS

Create an admin settings page.

Sections:

### Business Profile

* Business Name
* Owner Name
* Phone
* Email
* Address
* GSTIN
* Business Type

### Invoice Settings

* Invoice Prefix
* Tax Settings
* Default Payment Terms
* Invoice Footer

### Admin Profile

* Name
* Email
* Password

Use mock state only.

---

# SEARCH & FILTERING

Where appropriate, add:

* Search
* Dropdown filters
* Status filters
* Date filters

All filtering should work on the mock data using React state.

---

# CRUD FUNCTIONALITY

Even though there is no database, the application should feel functional.

Implement frontend CRUD using React state:

* Add
* Edit
* Delete
* Search
* Filter
* Update
* View

When an item is added/edited/deleted, immediately update the UI.

Use confirmation dialogs for delete actions.

---

# INVOICE PREVIEW

Create a professional invoice preview modal/page.

Include:

**KVP Polymers LLP**

Invoice details:

* Invoice Number
* Date
* Customer details
* Product details
* Quantity
* Rate
* Tax
* Discount
* Total
* Payment status

Footer:

**Thank you for doing business with KVP Polymers LLP.**

Add buttons:

* Print Invoice
* Close

Use browser print functionality if possible, without installing a library.

---

# RESPONSIVE DESIGN

The complete application MUST work properly on:

* Desktop
* Laptop
* Tablet
* Mobile

Admin tables should become horizontally scrollable or transform into mobile-friendly cards.

Sidebar should become a mobile drawer.

Buttons and forms should remain easy to use on smaller screens.

---

# FOOTER

Create a professional footer on the public pages.

Include:

**KVP Polymers LLP**

Business management and industrial polymer solutions.

Include:

* Home
* About
* Products
* Contact
* Admin Login

### IMPORTANT

Add an **"Admin Panel"** link in the footer.

Clicking it must redirect to:

`/admin/login`

---

# MOCK DATA

Create realistic mock data directly inside React files.

Do NOT use any database.

Create mock datasets for:

* Products
* Customers
* Suppliers
* Sales
* Purchases
* Payments
* Ledger entries
* Reports

Use Indian names, Indian phone numbers, ₹ currency and realistic business data.

The application should load with meaningful demo data already populated.

---

# NAVIGATION

Use React-based frontend navigation.

Required routes/pages:

* `/`
* `/admin/login`
* `/admin/dashboard`
* `/admin/sales`
* `/admin/sales/create`
* `/admin/purchases`
* `/admin/purchases/create`
* `/admin/inventory`
* `/admin/products`
* `/admin/customers`
* `/admin/suppliers`
* `/admin/payments`
* `/admin/ledger`
* `/admin/reports`
* `/admin/settings`

All navigation links and buttons must work.

---

# AUTHENTICATION DEMO

Implement simple frontend-only authentication using React state/localStorage if necessary.

Demo credentials:

**Email:** [admin@kvppolymers.com](mailto:admin@kvppolymers.com)
**Password:** admin123

After login:

`/admin/login` → `/admin/dashboard`

If the admin is not logged in and tries to access an admin page, redirect to `/admin/login`.

Logout should clear the demo login state and redirect to the login page.

Do NOT use any authentication library or backend.

---

# UI/UX REQUIREMENTS

The final application should look polished and production-quality.

Use:

* Clean cards
* Rounded corners
* Subtle shadows
* Clear typography
* Professional tables
* Proper spacing
* Clear buttons
* Status badges
* Modal dialogs
* Form validation
* Empty states
* Loading-style placeholders where useful

Keep animations subtle.

Do not over-design the interface.

The application should feel similar in usability to a **modern Indian accounting/business management application such as Vyapar**, while maintaining its own visual identity for KVP Polymers LLP.

---

# IMPORTANT FINAL REQUIREMENTS

1. Use **React + Vite + Tailwind CSS ONLY**.
2. Do not install or use any other library.
3. No backend.
4. No database.
5. No Supabase.
6. No Firebase.
7. No external APIs.
8. Use mock data only.
9. All major business modules must be controlled from the Admin Panel.
10. Admin Login must work.
11. Admin redirect link must be available in the footer.
12. All important buttons must have working frontend interactions.
13. CRUD operations should work using React state.
14. Invoice calculations should be dynamic.
15. Inventory quantities should update in the frontend.
16. Search and filters should work.
17. Make the entire application responsive.
18. Use ₹ Indian currency formatting.
19. Use polymer-industry-related mock products and business data.
20. Keep the design professional and avoid excessive dark colors.
21. Do not leave major pages as blank placeholders.
22. Every sidebar menu item should open a properly designed working page.
23. Make the demo feel like a complete business management application rather than a static UI mockup.

Build the application with clean, reusable React components and maintainable code structure.



I've cloned the repo and copied all of its shared code into the project (hero asset, src/lib/*, kit.tsx, AdminLayout, AdminPage, PublicLayout, InvoicePreview, styles.css, plus the existing public pages, login, dashboard, sales, purchases and products routes), relaxed the TypeScript config to match the repo, and added the new PartyManager component along with the /admin/customers, /admin/suppliers, /admin/inventory, /admin/payments and /admin/ledger pages.

Remaining work:
src/routes/admin.reports.tsx and src/routes/admin.settings.tsx, then a build/typecheck pass. Until those two files exist, the sidebar's Reports/Settings links keep the typecheck failing, so the app won't build yet — creating them is all that's left.

clone the repo and remaining work continue

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/347ba9e2-7b90-4def-a025-3b6b7730af4e).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
