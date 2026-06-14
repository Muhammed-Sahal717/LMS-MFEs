# Next-Gen Enterprise LMS: System Architecture & Technical Specifications

This repository contains the Micro-Frontend (MFE) architecture and UI packages for the Learning Management System platform. It is designed to be a highly scalable, distributed environment engineered for B2B SaaS operations.

---

## 1. Executive Summary

The LMS platform is built on a highly scalable, distributed architecture.

- **Frontend**: A true **Next.js Multi-Zone Micro-Frontend (MFE)** architecture managed via Turborepo.
- **Backend**: A Python **FastAPI Modular Monolith**, utilizing SQLAlchemy for deep PostgreSQL integration.
- **Database**: PostgreSQL with strict Row-Level Security (RLS) analogs implemented via `TenantMixin` structures.
- **Authentication & Authorization**: Stateless JWT authentication with strict Role-Based Access Control (RBAC).

---

## 2. Core Features (Out-of-the-Box)

- **Course Catalog & Discovery**: Public-facing storefront for users to browse, filter, and enroll in courses.
- **Dynamic Curriculum Builder**: Administrative interface for Instructors to dynamically build out courses with Text, Document, and Video lessons.
- **Assignment & Grading Engine**: Instructors can create homework assignments, and students can submit their work for grades and feedback.
- **Multi-Tenant Administration**: Super Admins can instantly spin up isolated "Academies" with their own branding, users, and selectively licensed modules.
- **Role-Based Dashboards**: A unified interface that instantly adapts depending on whether the user is a Student, Instructor, or Tenant Admin.

---

## 3. Micro-Frontend (MFE) Architecture

The platform's frontend is not a traditional monolith. It is composed of 7 mathematically distinct Next.js applications that are stitched together to feel like a single Single Page Application (SPA).

### 3.1 The MFE Zones

Each of the following zones resides in `apps/` and contains its own `package.json`, `next.config.ts`, and `app/` router. They can be deployed to completely isolated server environments.

1. **`shell` (Port 3000)**: The Host API Gateway. It owns the root domain (`/`).
2. **`auth` (Port 3001)**: Handles authentication flows (`/auth`).
3. **`catalog` (Port 3002)**: The public storefront for course discovery (`/courses`).
4. **`learning` (Port 3003)**: The secure video player and classroom (`/learn`).
5. **`assignment` (Port 3004)**: Manages quizzes and student submissions (`/assignments`).
6. **`dashboard` (Port 3005)**: The student portal for grades and progress (`/dashboard`).
7. **`admin` (Port 3006)**: The management suite for user CRUD and curriculum building (`/admin`).

### 3.2 How the Zones Connect

The magic of the MFE orchestration happens in the `shell` application's `next.config.ts`. The Shell uses Next.js `rewrites` to act as an invisible reverse proxy.

```text
                 ┌─────────────────────────────────────┐
 browser ──────▶ │  shell (host)  http://localhost:3000 │  owns the root origin
                 │  next.config.ts  async rewrites()    │
                 └───────┬───────────┬───────────┬──────┘
                 /auth/* │  /courses/*│ /dashboard/* ...  (path prefix → zone)
                         ▼           ▼           ▼
                   auth-mfe     catalog-mfe   dashboard-mfe   ... each its own
                    :3001         :3002          :3005          Next.js app
```

When a user navigates to `https://platform.com/admin/users`, the Shell invisibly proxies the HTTP request to the `admin` zone. Because the Admin zone has a `basePath` of `/admin`, the routing perfectly aligns. The browser never refreshes, and the user never realizes they have crossed server boundaries.

### 3.3 Shared NPM Packages

To maintain design consistency and reduce duplicated code across the 7 standalone apps, the workspace utilizes local NPM packages in the `packages/` directory:

- **`@lms/ui`**: Contains the canonical React components (`AppShell`, `Sidebar`, `Button`, `Modal`). If a component is updated here, it instantly propagates across all MFEs.
- **`@lms/api-client`**: The single source of truth for the Axios configuration, TypeScript DTOs, and JWT token rotation logic.

---

## 4. Multi-Tenancy Routing & Data Isolation

The platform is designed to serve multiple academies (Tenants) from the same codebase and database, while ensuring zero data leakage.

### 4.1 Frontend Tenant Resolution

Multi-tenancy begins at the browser URL. The `@lms/api-client` dynamically extracts the Tenant Slug from the hostname.

- **Subdomain Routing**: If a user visits `https://acme.lms.com`, the client extracts `acme` as the tenant slug.
- **Vercel Routing**: If a user visits `acme-academy-lms.vercel.app`, it gracefully falls back to extract `acme-academy`.
- **Injection**: Every API request made from any MFE automatically attaches the header `X-Tenant-ID: acme` to the HTTP request.

### 4.2 Backend Data Isolation (RLS Pattern)

When the FastAPI backend receives a request, the multi-tenancy middleware intercepts the `X-Tenant-ID` header.

1. The backend queries the `tenants` database table to resolve the slug to a UUID.
2. The UUID is injected into a global request context variables using Python's `contextvars`.
3. Every SQLAlchemy database model (e.g., `User`, `Course`, `Lesson`) inherits from a `TenantMixin`.
4. The database session automatically applies a `where tenant_id = <UUID>` clause to **every single database query**, ensuring cross-tenant data contamination is mathematically impossible.

---

## 5. Backend Architecture (FastAPI)

The backend is structured as a tightly-coupled Modular Monolith, optimizing for performance while maintaining clear boundaries.

### 5.1 Module Design

Business logic is strictly segmented into modules (`auth`, `courses`, `learning`, `admin`, `assignments`).

- Each module has its own `router.py`, `schemas.py`, `models.py`, and `service.py`.
- **Strict Boundaries**: Modules communicate through internal service methods, not direct cross-table joins.

### 5.2 Data Integrity (Soft Deletes)

Database records are never hard-deleted. Models utilize a `SoftDeleteMixin` (or `is_active` boolean for Users). This preserves critical historical data (like past enrollments or quiz submissions) while immediately locking out the deactivated user or hiding the archived course.

### 5.3 Feature Flags / Module Licensing

A sophisticated Licensing system is built into the backend. Super Admins can toggle specific modules (like `assignments` or `catalog`) on or off for specific tenants. If a tenant disables the `assignments` module, any API requests to that module will instantly return a `403 Forbidden`, effectively enforcing paywalls for premium SaaS tiers.

---

## 6. Role-Based Access Control (RBAC) & UI Gating

Security is enforced at both the UI and API levels.

### 6.1 Frontend UI Gating

The `@lms/ui` package's `AppShell` and `navConfig` dictate what the user sees based on their roles array (e.g., `["student"]`, `["instructor"]`, `["tenant_admin"]`).

- Students only see "My Learning", "Dashboard", and "Assignments".
- Admins and Instructors see the "Admin" management panel, completely de-cluttering the UI based on intent.

### 6.2 API Permission Enforcement

The UI is purely cosmetic; true security lies in the backend.
The backend utilizes a strict permission matrix. Endpoints are secured via FastAPI dependencies:

```python
@router.post("/courses/{id}/lessons", dependencies=[require_permission("course:update")])
```

If a student attempts to bypass the UI and hit the POST endpoint directly, the backend verifies their JWT, realizes they lack the required permission, and throws a 403 Forbidden.

---

## 7. Production Deployment Wiring

The entire architecture is designed to be horizontally scaled on modern serverless or containerized infrastructure.

### 7.1 Database Deployment

Deploy PostgreSQL via a managed provider (e.g., AWS RDS, Supabase, Neon). Run Alembic migrations (`alembic upgrade head`) to construct the schema.

### 7.2 Backend Deployment

The FastAPI application contains a `Dockerfile`. Deploy it to a container service (e.g., Google Cloud Run, AWS ECS, or Render) scaling instances behind a Load Balancer.

### 7.3 Frontend Deployment (Vercel)

Deploying the MFEs to Vercel is seamless:

1. Connect Vercel to your GitHub repository.
2. Vercel automatically detects the Turborepo configuration.
3. You can either deploy the `shell` app directly (which will build all internal logic) or create 7 separate Vercel projects pointing to the same repository but selecting a different `apps/*` folder as the Root Directory.
4. Set the `NEXT_PUBLIC_API_URL` environment variable to point to your deployed FastAPI backend.
