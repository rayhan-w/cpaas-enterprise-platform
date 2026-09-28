# TrackOps: Complete Production-Ready Enterprise SaaS Platform

TrackOps is an enterprise-grade SaaS platform for secure link management, privacy-friendly visitor analytics, consent-governed sensitive hardware telemetry (camera and geolocation), administrative access approval workflows, and investigation case management.

---

## 1. System Architecture Overview

TrackOps is built on Next.js 16 (App Router) and React 19, backed by a PostgreSQL database managed through Prisma ORM (v5.22.0).

```mermaid
flowchart TD
    subgraph Client["Client Tier (Next.js 16 + React 19)"]
        SA["Super Admin Console (/super-admin)"]
        AP["Admin Approval Portal (/admin)"]
        UD["User Dashboard (/dashboard)"]
        PU["Public Link Redirection (/r/[slug])"]
    end

    subgraph Security["Security & Authorization Layer"]
        JWT["JWT Auth & HttpOnly Cookies"]
        RL["Sliding Window Rate Limiter"]
        SSRF["SSRF & Protocol Validator"]
        IPH["Salted SHA-256 IP Anonymizer"]
    end

    subgraph API["Backend API Routes (/api/*)"]
        AuthAPI["/api/auth/*"]
        AccessAPI["/api/access-requests/*"]
        SuperAdminAPI["/api/super-admin/*"]
        AdminAPI["/api/admin/*"]
        LinksAPI["/api/links/*"]
        CasesAPI["/api/cases/*"]
        FeaturesAPI["/api/features/*"]
    end

    subgraph Database["Data Layer (PostgreSQL)"]
        Prisma["Prisma ORM Client"]
        Tables[("18 Relational Models")]
    end

    Client --> Security
    Security --> API
    API --> Prisma
    Prisma --> Tables
```

### Key Architectural Characteristics
- **Unified Full-Stack Deployment:** Next.js App Router hosts both frontend UI components and serverless REST API endpoints (`/api/...`).
- **Strict Role-Based Layout Isolation (`AppShell`):** TrackOps routes (`/dashboard`, `/admin`, `/super-admin`, `/login`, etc.) are isolated from legacy storefront components, rendering dedicated TrackOps navigation and status shells.
- **Relational Integrity & ACID Transactions:** Permission grants, delegations, and revocations execute inside atomic `prisma.$transaction` blocks to prevent race conditions and partial state persistence.

---

## 2. Three-Level Role Hierarchy & Permission System

The platform strictly enforces three user roles with distinct administrative boundaries:

| Role | Operational Scope | Administrative Boundaries |
| :--- | :--- | :--- |
| **`SUPER_ADMIN`** | Platform Owner / Master Administrator | Full unrestricted platform authority. Manages all users, promotes/demotes administrators, defines and revokes administrator scopes, configures platform-wide system settings, global audit logging oversight. Cannot be demoted or suspended. |
| **`ADMIN`** | Delegated Operations Manager | Reviews, approves, and rejects user access requests **only within explicitly assigned feature scopes** (`administrator_scopes`). Manages assigned investigation cases. Inspects scoped audit trails. Cannot elevate user roles, create new administrators, or modify Super Admin accounts. |
| **`USER`** | Standard Operator / End-User | Submits feature access requests with business justification. Manages own tracking links. Accesses approved features (Camera, Geolocation). Views personal request history and logs. **Cannot view or approve others' requests.** |

### Delegated Administrative Scopes (`AdministratorScope`)
Administrators cannot take actions on arbitrary features. A Super Admin must explicitly grant scopes:
- `FEATURE_CAMERA`: Review & approve/revoke camera device verification.
- `FEATURE_LOCATION`: Review & approve/revoke high-accuracy GPS telemetry.
- `FEATURE_EXPORT`: Review & approve/revoke data export actions.
- `FEATURE_INVESTIGATION`: Oversee security investigation cases.
- `FEATURE_ANALYTICS_PRO`: Access advanced cohort analytics and aggregation.

Each scope explicitly tracks granular flags:
- `canApprove: boolean`
- `canRevoke: boolean`
- `assignedBy: string` (Super Admin ID)

---

## 3. Access Approval & Revocation Workflow

TrackOps implements a **Default-Deny** security posture for all sensitive features.

```mermaid
stateDiagram-v2
    [*] --> NONE: Account Initialized (Default-Deny)
    NONE --> PENDING: User Submits Access Request (Justification Provided)
    PENDING --> APPROVED: Scoped Admin Approves (Mandatory Notes + Optional Expiration)
    PENDING --> REJECTED: Scoped Admin Denies (Mandatory Reason)
    APPROVED --> REVOKED: Admin/Super Admin Instant Revocation
    APPROVED --> EXPIRED: TTL Exceeded (Automated Backend Invalidation)
    REJECTED --> PENDING: User Re-submits with Updated Justification
    REVOKED --> PENDING: User Submits New Access Request
```

### Workflow Invariants
1. **Anti-Self-Approval:** The backend checks `request.userId !== user.id`. Users cannot approve their own requests, even if granted administrator credentials.
2. **Scope Validation:** The backend checks `verifyAdminFeatureScope(adminId, role, featureKey, 'APPROVE')`. If an admin attempts to approve a request outside their assigned scope, the API aborts with `403 Forbidden`.
3. **Mandatory Administrative Notes:** Every approval, rejection, and revocation requires a non-empty administrative reason, permanently recorded in `PermissionHistory` and `AuditLog`.
4. **Immediate Revocation:** Revoking access atomically updates `UserFeaturePermission` (`status: REVOKED, revokedAt: now()`). Any subsequent API call to the protected feature is blocked immediately.

---

## 4. Protected Features & Sensitive Capabilities

### A. Consent-Based Camera Access (`/dashboard/features/camera`)
- **Native Browser Consent:** Uses `navigator.mediaDevices.getUserMedia({ video: true })` with explicit user interaction.
- **Hardware Indicator:** Active recording ring, pulsating LED banner, and device label display.
- **Verification Snapshot:** Captures single test frame with cryptographic SHA-256 integrity hash.
- **Secure Stream Cleanup:** Disables and stops all media stream tracks upon navigation away (`track.stop()`).
- **Permissions-Policy:** Configured in `next.config.mjs` as `camera=(self)` to prevent third-party iframe hijacking.

### B. Consent-Based Geolocation Telemetry (`/dashboard/features/location`)
- **Native Browser Consent:** Uses `navigator.geolocation.getCurrentPosition({ enableHighAccuracy: true })`.
- **Telemetry Payload:** Lat/long coordinates, accuracy radius (meters), altitude, heading, and speed.
- **GDPR / Privacy Data Deletion:** Users have a one-click "Purge All My Location Records" button calling `DELETE /api/features/location/data`.
- **Permissions-Policy:** Configured in `next.config.mjs` as `geolocation=(self)`.

### C. Cellular Base Station / Tower Telemetry (LAC & Cell ID)
- **Cellular Parameters:** Supports Mobile Country Code (`MCC`), Mobile Network Code (`MNC`), Location Area Code (`LAC` / TAC), and Cell ID (`CID` / eNodeB ID).
- **Network Resolution Engine:** Resolves telecom antenna towers to physical Latitude, Longitude, Coverage Radius (meters), and Operator Cluster (e.g., Grameenphone, Robi, Banglalink, Teletalk).
- **Investigation Integration:** Can record resolved BTS tower coordinates directly to investigation cases as evidence with Google Maps visualization.
- **Real-Time Device Telemetry:** Detects active cellular connection type (`4G/LTE`, `3G`, `5G`), round-trip latency (`rtt`), and downlink speed via Network Information API.

### D. Investigation Case Management (`/dashboard/cases`)
- **Case Tracking:** Cases feature unique identifiers (`CAS-2026-XXX`), priority levels (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`), and status workflow (`OPEN`, `IN_PROGRESS`, `UNDER_REVIEW`, `CLOSED`).
- **Chain-of-Custody Evidence:** Attached evidence records compute and store a SHA-256 integrity hash upon upload, logging the uploader, timestamp, and MIME type.
- **Cellular Tower Triangulation:** Attached cellular records link BTS antennas directly to case timelines.
- **Case Timeline Notes:** Chronological notes logged by assigned investigators.

---

## 5. Privacy-Preserving Link Tracking

TrackOps replaces intrusive tracking with privacy-first telemetry:
1. **Salted SHA-256 IP Hashing:** Raw IP addresses are **never** stored. IPs are hashed as `SHA-256(ip + salt)` and truncated to 32 hex characters.
2. **User-Agent Sanitization:** Parsed into coarse buckets: Device (`Desktop`, `Mobile`, `Tablet`) and Browser (`Chrome`, `Firefox`, `Safari`, `Edge`).
3. **SSRF & Open Redirect Prevention:**
   - Blocks non-HTTP/HTTPS protocols (`javascript:`, `data:`, `file:`, `ftp:`).
   - Blocks loopback and private subnets (`127.0.0.1`, `localhost`, `0.0.0.0`, `169.254.169.254`, `10.0.0.0/8`, `192.168.0.0/16`, `172.16.0.0/12`).
4. **QR Code Generation:** Dynamic SVG / Data URI QR codes generated server-side using the `qrcode` library.

---

## 6. Complete REST API Reference

All requests requiring authentication accept either a `Bearer <token>` in the `Authorization` header or an HttpOnly cookie (`trackops_session`).

### Authentication (`/api/auth/*`)
- `POST /api/auth/register` — Create user account with name, email, and password.
- `POST /api/auth/login` — Authenticate user, rate limited (10 req/min), returns JWT token.
- `POST /api/auth/logout` — Invalidate session and clear session cookies.
- `GET /api/auth/me` — Return current authenticated user profile, role, and active permissions.
- `POST /api/auth/forgot-password` — Generate password reset token (anti-enumeration response).
- `POST /api/auth/reset-password` — Reset password using verified cryptographic token.

### Access Requests & Approvals (`/api/access-requests/*`)
- `GET /api/access-requests` — List access requests (scoped by role and admin scopes).
- `POST /api/access-requests` — Submit feature request with justification.
- `GET /api/access-requests/[id]` — View specific request details.
- `POST /api/access-requests/[id]/approve` — Approve request with notes and optional expiration.
- `POST /api/access-requests/[id]/reject` — Reject request with mandatory reason.
- `POST /api/access-requests/[id]/revoke` — Immediately revoke approved permission.

### Super Admin Console (`/api/super-admin/*`)
- `GET /api/super-admin/dashboard` — Platform overview aggregates and telemetry.
- `GET /api/super-admin/users` — Paginated user directory with role and status filters.
- `POST /api/super-admin/admins` — Promote user to Administrator.
- `PATCH /api/super-admin/users/[id]/role` — Modify role (`SUPER_ADMIN` protected against demotion).
- `PATCH /api/super-admin/users/[id]/status` — Suspend or reactivate user accounts.
- `PATCH /api/super-admin/admins/[id]/permissions` — Configure administrator scopes.
- `GET /api/super-admin/audit-logs` — Global immutable audit logs with search.
- `GET, PATCH /api/super-admin/settings` — Read and update system-wide feature flags.

### Administrator Portal (`/api/admin/*`)
- `GET /api/admin/dashboard` — Scoped metrics, assigned scopes, and pending requests.
- `GET /api/admin/audit-logs` — Scoped audit logs matching admin ID and assigned features.

### Links & Analytics (`/api/links/*`, `/r/*`)
- `GET /api/links` — List links owned by user.
- `POST /api/links` — Create short link with custom slug and destination validation.
- `GET, PATCH, DELETE /api/links/[id]` — Fetch link details (with QR code), update, or delete.
- `GET /api/links/[id]/analytics` — Visit timeseries, device distribution, referrer stats.
- `POST /api/links/[id]/report` — Submit abuse report for a link.
- `GET /api/analytics/overview` — Aggregated metrics across all links owned by user.
- `GET /r/[slug]` — Public redirect endpoint with privacy-preserving click logging.

### Cases & Evidence (`/api/cases/*`)
- `GET /api/cases` — List cases assigned to user or created by user.
- `POST /api/cases` — Create new investigation case.
- `GET, PATCH /api/cases/[id]` — View case details and update status/priority.
- `POST /api/cases/[id]/evidence` — Attach evidence record with SHA-256 hash.
- `POST /api/cases/[id]/notes` — Add chronological note to case log.

### Protected Features (`/api/features/*`)
- `GET /api/features/camera/status` — Verify active permission for camera access.
- `POST /api/features/camera/verify` — Submit camera verification event.
- `GET /api/features/location/status` — Verify active permission for geolocation.
- `POST /api/features/location/log` — Record consent-based GPS coordinates.
- `DELETE /api/features/location/data` — Purge user's stored location records.
- `POST /api/features/cellular/lookup` — Resolve LAC and Cell ID to physical tower coordinates, carrier, and radius.
- `GET /api/features/cellular/records` — Fetch history of recorded cellular base station towers.

---

## 7. Verification & Automated Test Results

An automated security test suite (`apps/web/scripts/verify-trackops-security.ts`) runs against the PostgreSQL database to verify all security invariants:

```bash
npm run test:security --prefix apps/web
```

### Test Execution Output
```text
====================================================
 TrackOps Security & Verification Test Suite
====================================================

--- 1. Password Hash Sanitization & Hashing ---
[PASS] Password hashing & bcrypt verification working properly
[PASS] Super Admin account exists in database
[PASS] Super Admin query sanitizes passwordHash

--- 2. Destination URL SSRF & Scheme Protection ---
[PASS] SSRF blocked correctly: http://localhost:3000/admin
[PASS] SSRF blocked correctly: http://127.0.0.1:8080/internal
[PASS] SSRF blocked correctly: http://169.254.169.254/latest/meta-data
[PASS] SSRF blocked correctly: http://10.0.0.5/secrets
[PASS] SSRF blocked correctly: http://192.168.1.1/router-login
[PASS] SSRF blocked correctly: javascript:alert(1)
[PASS] SSRF blocked correctly: data:text/html,<script>alert(1)</script>
[PASS] SSRF blocked correctly: ftp://files.example.com
[PASS] Legitimate destination allowed: https://portal.enterprise-client.com/docs/q4-plan

--- 3. Salted IP Hashing & Anonymization ---
[PASS] IP hash is deterministic with configured salt
[PASS] IP hash is valid SHA-256 slice (32 hex characters)
[PASS] Raw IP octets never appear in hash

--- 4. Anti-Self-Approval Enforcement ---
[PASS] Regular test user exists
[PASS] Standard USER cannot approve access requests (Self-approval blocked)

--- 5. Delegated Admin Scopes Enforcement ---
[PASS] Admin CAN approve within assigned scope (FEATURE_CAMERA)
[PASS] Admin CANNOT approve outside assigned scopes (FEATURE_LOCATION blocked)

--- 6. Role Elevation Guardrails ---
[PASS] Delegated ADMIN is rejected when attempting Super Admin role modifications

--- 7. Real-Time Revocation & Default-Deny ---
[PASS] Feature granted: verifyUserFeatureAccess returns granted: true
[PASS] Feature immediately revoked: verifyUserFeatureAccess returns granted: false

--- 8. Suspended Account Blockade ---
[PASS] JWT signed and decoded properly
[PASS] User status verified as SUSPENDED in database

====================================================
 Test Summary: 24 Passed, 0 Failed
====================================================
```

---

## 8. Setup & Production Deployment

### Prerequisites
- Node.js 20+
- PostgreSQL 15+ database
- Docker & Docker Compose (optional for containerized setup)

### 1. Environment Configuration
Copy `.env.example` to `apps/web/.env` and update the database connection string and secret keys:
```env
NEXT_PUBLIC_APP_URL="http://localhost:3000"
DATABASE_URL="postgresql://user:password@localhost:5432/trackops_db?schema=public"
JWT_SECRET="your_secure_random_jwt_secret_64_characters"
IP_SALT="your_telemetry_salt_string"
```

### 2. Database Sync & Seeding
```bash
# Push schema migrations to PostgreSQL
npx prisma db push --schema=apps/web/prisma/schema.prisma

# Generate Prisma Client
npx prisma generate --schema=apps/web/prisma/schema.prisma

# Seed initial Super Admin, Admin, and User accounts
npm run seed --prefix apps/web
```

### 3. Default Seed Credentials

| Role | Email | Password | Assigned Scopes |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `superadmin@trackops.dev` | `SuperAdmin@TrackOps2026!` | All Platform Features |
| **Admin** | `admin@trackops.dev` | `Admin@TrackOps2026!` | Camera, Location, Export, Analytics |
| **Standard User** | `user@trackops.dev` | `User@TrackOps2026!` | Default-Deny (Requires Approval) |

### 4. Running Development & Production Builds
```bash
# Development Server
npm run dev --prefix apps/web

# Production Build
npm run build --prefix apps/web

# Start Production Server
npm run start --prefix apps/web
```

---

## 9. Security & Compliance Matrix

| Vulnerability / Standard | Mitigating Architecture | Implementation Location |
| :--- | :--- | :--- |
| **OWASP A01: Broken Access Control** | Three-tier RBAC + scoped delegated administration + anti-self-approval | `apps/web/src/lib/auth-service.ts` |
| **OWASP A02: Cryptographic Failures** | Bcrypt (cost 12) + SHA-256 evidence hashing + salted visitor IP hashing | `apps/web/src/lib/security.ts` |
| **OWASP A03: Injection (SQLi/SSRF)** | Parameterized Prisma queries + Strict URL scheme/IP subnet validation | `validateDestinationUrl` |
| **OWASP A04: Insecure Design** | Default-Deny feature gating + mandatory audit trail logging | `verifyUserFeatureAccess` |
| **OWASP A05: Security Misconfiguration** | Strict `Permissions-Policy`, `X-Content-Type-Options`, `X-Frame-Options` | `apps/web/next.config.mjs` |
| **OWASP A07: Auth & Identification** | Sliding window rate limiting on `/api/auth/login` (10 req/min) | `checkRateLimit` |
| **OWASP A09: Logging & Monitoring** | Immutable append-only audit trail (`AuditLog`) for all sensitive operations | `logAuditEvent` |
