# OutreachHub – MEAN Stack Project

OutreachHub is a multi-tenant SaaS platform developed using the MEAN stack (MongoDB, Express/NestJS, Angular, Node.js). It enables businesses to manage contacts, create message templates, and simulate targeted campaigns effectively through an Admin and Workspace portal.

## 🚀 Project Highlights

- **Multi-Tenant Architecture** with Admin and Workspace portals
- **Role-based access** (Editor, Viewer)
- **Campaign simulation** with analytics and real-time status updates
- **Responsive UI** using Angular + SCSS
- Backend built with **NestJS** and **MongoDB**

---

## 📁 Portals Overview

### 🛠 Admin Portal

For platform administrators to manage:
- Workspaces
- Workspace users

Modules:
- **Authentication**: Login/Logout
- **Workspaces**: CRUD operations
- **Workspace Users**: CRUD operations within a workspace

### 👥 OutreachHub Portal

For workspace users to manage campaigns:
- **Roles**:
  - **Editor**: Full CRUD access
  - **Viewer**: Read-only access

Modules:
- **Authentication**
- **Home**: Welcome message, analytics charts, top campaigns/tags
- **Contacts**: CRUD contacts with tagging
- **Message Templates**: Manage "Text" and "Text & Image" templates
- **Campaigns**: Draft, launch, copy campaigns, and view live status

---

## 🛠 Tech Stack

| Layer           | Technology       |
|----------------|------------------|
| Frontend       | Angular, SCSS    |
| Backend        | NestJS (Node.js) |
| Database       | MongoDB          |
| Language       | TypeScript       |
| Version Control| Git & GitHub     |

---

## 📊 Analytics Features

- Campaigns sent per day (filterable by date)
- Messages sent by type
- Contacts reached per day
- Tables for:
  - Recent 5 campaigns
  - Top 5 contact tags

---

## 🔐 Authentication & Authorization

- JWT-based authentication
- Workspace scoping using workspace IDs
- Role-based authorization (Editor vs Viewer)

---

## 🧱 Database Schema (MongoDB)

Multi-tenant structure:
- AdminUsers
- Workspaces
- WorkspaceUsers
- Contacts (with tags)
- MessageTemplates
- Campaigns
- CampaignMessages

---

## ⚙️ Project Setup

### Prerequisites
- Node.js (v18+)
- MongoDB
- Angular CLI
- NestJS CLI


