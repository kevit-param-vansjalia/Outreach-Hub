# 📨 OutreachHub – MEAN Stack Project

**OutreachHub** is a multi-tenant SaaS platform built using the **MEAN stack (MongoDB, Express/NestJS, Angular, Node.js)**. It enables businesses to manage contacts, create message templates, and simulate targeted outreach campaigns efficiently through dedicated **Admin** and **Workspace** portals.

---

## 🚀 Key Features

- **Multi-Tenant Architecture**: Isolated workspaces with scoped data
- **Role-Based Access Control**: Editor (CRUD) & Viewer (read-only)
- **Real-Time Campaign Status**: Simulate campaigns with live updates
- **Data Visualization**: Campaign insights with charts and tables
- **Responsive UI**: Built with Angular & SCSS for all screen sizes
- **Scalable Backend**: Powered by NestJS and MongoDB

---

## 🗂️ Portals Overview

### 🛠 Admin Portal

For platform-level administration:
- Manage **Workspaces** (Create, Read, Update, Delete)
- Manage **Workspace Users** within each workspace
- JWT-based **Authentication**

### 👥 Workspace Portal (OutreachHub)

For workspace-specific users to manage outreach operations:

**Roles**:
- **Editor**: Full access (CRUD)
- **Viewer**: Read-only access

**Modules**:
- **Home Dashboard**: Campaign stats, charts, and top tags
- **Contacts**: Add, tag, and manage contact data
- **Message Templates**: Create "Text" or "Text & Image" templates
- **Campaigns**: Draft, launch, copy campaigns with live status updates

---

## 🧰 Tech Stack

| Layer           | Technology           |
|----------------|----------------------|
| Frontend       | Angular, SCSS        |
| Backend        | NestJS (Node.js)     |
| Database       | MongoDB              |
| Language       | TypeScript           |
| Version Control| Git & GitHub         |

---

## 📈 Analytics Dashboard

- 📅 **Campaigns per Day** (Date-filterable)
- 🧾 **Messages by Type**
- 📇 **Contacts Reached per Day**
- 🧮 Tables:
  - Recent 5 Campaigns
  - Top 5 Tags used in Contacts

---

## 🔐 Authentication & Authorization

- **JWT-based Authentication**
- **Workspace Scoping** with unique Workspace IDs
- **Role-Based Authorization**: Editor & Viewer access separation

---

## 🧱 MongoDB Schema Structure

Collections include:

- `AdminUsers`
- `Workspaces`
- `WorkspaceUsers`
- `Contacts` (with support for tagging)
- `MessageTemplates`
- `Campaigns`
- `CampaignMessages`

Each collection is scoped to its workspace for data isolation.

---

## ⚙️ Project Setup

### ✅ Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/)
- [Angular CLI](https://angular.io/cli)
- [NestJS CLI](https://docs.nestjs.com/cli/overview)

---

### 🚀 Installation Steps

1. **Clone the Repository**  
   ```bash
   git clone https://github.com/your-username/OutreachHub.git
   cd OutreachHub
