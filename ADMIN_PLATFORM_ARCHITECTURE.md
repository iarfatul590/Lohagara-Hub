# Lohagara Hub Admin Platform

This workspace includes a static admin UI and an Express/PostgreSQL API. The UI obtains an API-authorized Firebase session, loads union-scoped records, and receives committed updates over SSE. PostgreSQL migrations seed the nine unions and wards; the API enforces role/union access. Infrastructure dependencies such as the private storage bucket, ClamAV, Firebase credentials, and SMS gateway must be configured before production use.

## Service Layout

- Admin web client: existing Tailwind page; call the API through a same-origin `/api/v1` reverse proxy.
- API: Node.js 20+, Express, TypeScript, Zod request validation, PostgreSQL 16, and a migration runner such as Prisma Migrate or node-pg-migrate.
- Identity: verify Firebase ID tokens server-side (or use an OIDC session in secure, HTTP-only cookies). Resolve role assignments from the database on every request; never trust client-supplied roles or email allowlists.
- Files: private Google Cloud Storage ownership documents, short-lived signed URLs, hash verification, and a ClamAV scanning worker. Do not approve until a clean scan.
- Jobs: transactional outbox and notification worker for market bulletins, emergency SMS/Push. Large PDF/XLSX report generation still needs its export worker.

## PostgreSQL Schema

Use UUID primary keys, UTC timestamps, parameterized SQL, and migrations. This is a core schema; add locality-specific reference data and retention policies before launch.

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE admin_role AS ENUM ('super_admin', 'moderator', 'market_editor', 'data_entry_operator');
CREATE TYPE listing_type AS ENUM ('house', 'land', 'apartment');
CREATE TYPE listing_status AS ENUM ('pending', 'active', 'sold', 'rented', 'rejected', 'suspended');
CREATE TYPE lead_stage AS ENUM ('new', 'contacted', 'viewing', 'booked', 'closed', 'lost');
CREATE TYPE report_status AS ENUM ('open', 'investigating', 'resolved', 'dismissed');

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid text UNIQUE NOT NULL,
  display_name text NOT NULL,
  email text UNIQUE,
  phone text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'warned', 'suspended', 'banned')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE admin_role_assignments (
  user_id uuid NOT NULL REFERENCES users(id),
  role admin_role NOT NULL,
  granted_by uuid REFERENCES users(id),
  granted_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, role)
);

CREATE TABLE property_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  public_code text UNIQUE NOT NULL,
  owner_id uuid NOT NULL REFERENCES users(id),
  listing_type listing_type NOT NULL,
  status listing_status NOT NULL DEFAULT 'pending',
  title text NOT NULL,
  description text NOT NULL,
  upazila text NOT NULL,
  union_name text,
  price_amount numeric(14,2) NOT NULL CHECK (price_amount > 0),
  price_period text NOT NULL DEFAULT 'sale',
  verified_at timestamptz,
  verified_by uuid REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX listings_queue_idx ON property_listings(status, created_at DESC);
CREATE INDEX listings_area_type_idx ON property_listings(upazila, listing_type, status);
CREATE TABLE ownership_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES property_listings(id),
  object_key text NOT NULL UNIQUE,
  original_name text NOT NULL,
  content_type text NOT NULL,
  sha256 text NOT NULL,
  scan_status text NOT NULL DEFAULT 'pending' CHECK (scan_status IN ('pending', 'clean', 'blocked')),
  reviewed_by uuid REFERENCES users(id),
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE vendor_verification_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  business_name text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  evidence_object_keys jsonb NOT NULL DEFAULT '[]'::jsonb,
  reviewed_by uuid REFERENCES users(id),
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE content_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid NOT NULL REFERENCES users(id),
  subject_user_id uuid REFERENCES users(id),
  listing_id uuid REFERENCES property_listings(id),
  reason_code text NOT NULL,
  details text,
  status report_status NOT NULL DEFAULT 'open',
  assigned_to uuid REFERENCES users(id),
  resolution text,
  created_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz,
  CHECK (listing_id IS NOT NULL OR subject_user_id IS NOT NULL)
);
CREATE INDEX reports_queue_idx ON content_reports(status, created_at DESC);
CREATE TABLE property_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES property_listings(id),
  buyer_id uuid NOT NULL REFERENCES users(id),
  stage lead_stage NOT NULL DEFAULT 'new',
  request_type text NOT NULL,
  viewing_at timestamptz,
  assigned_to uuid REFERENCES users(id),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX leads_pipeline_idx ON property_leads(stage, updated_at DESC);

CREATE TABLE market_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  commodity_code text NOT NULL,
  display_name text NOT NULL,
  market_name text NOT NULL,
  unit text NOT NULL,
  retail_amount numeric(12,2) NOT NULL CHECK (retail_amount > 0),
  wholesale_amount numeric(12,2) NOT NULL CHECK (wholesale_amount > 0 AND wholesale_amount <= retail_amount),
  effective_at timestamptz NOT NULL,
  published_by uuid NOT NULL REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX market_history_idx ON market_prices(commodity_code, market_name, effective_at DESC);
CREATE TABLE donor_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES users(id),
  blood_group text NOT NULL CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  upazila text NOT NULL,
  union_name text,
  phone_ciphertext bytea NOT NULL,
  available boolean NOT NULL DEFAULT true,
  last_donated_at date,
  consented_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX donor_search_idx ON donor_profiles(blood_group, upazila) WHERE available = true;
CREATE TABLE emergency_incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_type text NOT NULL,
  upazila text NOT NULL,
  details text NOT NULL,
  status text NOT NULL CHECK (status IN ('open', 'dispatched', 'resolved', 'cancelled')),
  assigned_team text,
  created_by uuid REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE audit_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  actor_id uuid REFERENCES users(id),
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id text NOT NULL,
  before_state jsonb,
  after_state jsonb,
  request_id text NOT NULL,
  source_ip inet,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX audit_resource_idx ON audit_events(resource_type, resource_id, created_at DESC);
CREATE INDEX audit_actor_idx ON audit_events(actor_id, created_at DESC);
CREATE TABLE report_exports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requested_by uuid NOT NULL REFERENCES users(id),
  period_start date NOT NULL,
  period_end date NOT NULL,
  format text NOT NULL CHECK (format IN ('pdf', 'xlsx', 'csv')),
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'ready', 'failed', 'expired')),
  object_key text,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (period_end >= period_start)
);
```

Audit records should be append-only for the application role. Store only redacted state diffs, never passwords, auth tokens, donor phone plaintext, or ownership-document contents.

## API Contract

All routes are under `/api/v1`; JSON errors use `{ "error": { "code", "message", "requestId" } }`. Cursor pagination uses `?limit=50&cursor=...`; mutations require an idempotency key for retryable operations.

| Method and route | Capability | Roles |
| --- | --- | --- |
| `GET /admin/overview?from=&to=` | KPI aggregates and timeseries | All admin roles, scoped fields |
| `GET /admin/unions` and `GET /admin/unions/:unionId/wards` | Assigned union and canonical ward directory | Super Admin or assigned local role |
| `GET /admin/unions/:unionId/owners` | Property-owner lookup for selected union | Super Admin or assigned local role |
| `GET /admin/unions/:unionId/emergency/teams` and `POST /admin/unions/:unionId/emergency/teams` | Union response-team directory and registration | Assigned local role |
| `PATCH /admin/unions/:unionId/emergency/teams/:id` | Edit, verify, or deactivate local team | Union Moderator, Local Editor; verification restricted |
| `POST /admin/unions/:unionId/emergency/teams/:id/members` | Add verified member to an active response team | Union Moderator |
| `POST /admin/unions/:unionId/emergency-alerts` | Confirmed, idempotent ward/union SMS + Push fan-out | Union Moderator, Super Admin |
| `POST /admin/unions/:unionId/emergencies` and `PATCH /admin/unions/:unionId/emergencies/:id` | Incident logging and dispatch state | Assigned local role; dispatch requires Union Moderator |
| `GET /admin/unions/:unionId/donors?bloodGroup=&available=` | Union/ward-scoped donor directory, no phone numbers | Assigned local role |
| `GET /admin/unions/:unionId/donor-enrollments` and `POST /admin/unions/:unionId/donor-enrollments/:id/decision` | Review encrypted pending donor signup; verified state requires recent audited phone reveal | Union Moderator |
| `POST /admin/listings` and `PATCH /admin/unions/:unionId/listings/:id` | Union/ward property post and listing lifecycle | Local Editor, Union Moderator, Super Admin |
| `POST /admin/listings/:id/documents/upload-url` and `POST /admin/listings/:id/documents` | Signed private proof upload and hash-verified registration | Assigned union role |
| `GET /admin/unions/:unionId/market/prices` and `POST /admin/unions/:unionId/market/prices` | Union and market-specific price history writes | Assigned local role |
| `GET /admin/events` | Union-filtered server-sent updates | Authenticated admin; scope-filtered |
| `GET /api/v1/public/market/prices?unionSlug=&marketId=` | Published union/bazar price records | Public, bounded/cached |
| `GET /api/v1/public/emergency/teams?unionSlug=&type=` | Verified, active emergency team contacts | Public, bounded/cached |
| `GET /api/v1/public/blood/donors?unionSlug=&bloodGroup=` | Available donors with explicit public consent; no phone | Public, consent-gated |
| `POST /api/v1/public/blood/donor-enrollments` | Encrypted registration request, held pending manual verification | Public, rate-limited |
| `GET /admin/listings?status=&type=&upazila=&cursor=` | Filtered listing queue | Moderator, Super Admin |
| `GET /admin/listings/:id/documents` | Short-lived private document URLs | Moderator, Super Admin |
| `POST /admin/listings/:id/decision` | Approve / reject with reason | Moderator, Super Admin |
| `GET /admin/reports?status=&cursor=` | Report queue | Moderator, Super Admin |
| `POST /admin/reports/:id/actions` | Warn, remove listing, suspend/ban user | Moderator; ban requires Super Admin |
| `GET /admin/vendors/requests` and `POST /admin/vendors/:id/decision` | Trust badge review | Moderator, Super Admin |
| `GET /admin/leads?stage=&listingId=` and `PATCH /admin/leads/:id` | CRM pipeline | Moderator, Super Admin |
| `GET /admin/market/prices?market=&date=` | Current rates and historical series | All admin roles |
| `GET /admin/market/prices/:commodityCode/history?market=&from=` | Bounded price history series | All admin roles |
| `PUT /admin/market/prices/:id` | Validate and update rates | Market Editor, Super Admin |
| `POST /admin/market/broadcast` | Publish approved price bulletin | Market Editor, Super Admin |
| `GET /admin/donors?bloodGroup=&upazila=&available=true` | Minimal emergency donor results | Moderator, Super Admin; audited |
| `GET /admin/donors/:id/contact` | Decrypt and audit one available donor contact | Moderator, Super Admin |
| `GET /admin/emergencies` and `PATCH /admin/emergencies/:id` | Incident log and dispatch status | Moderator, Super Admin |
| `GET /admin/roles` and `PUT /admin/users/:id/roles` | Role assignment | Super Admin only |
| `GET /admin/audit?actor=&resource=&from=&to=` | Filtered audit trail | Super Admin; moderator read-only scope |
| `POST /admin/reports/exports` and `GET /admin/reports/exports/:id` | Queue and download PDF/XLSX/CSV | Super Admin; moderator scoped |

## Authorization and Operations

- Enforce RBAC in Express middleware and again in service methods. Deny by default; scope market editors to pricing and data-entry operators to draft creation. The role mutation route requires recent Firebase authentication; add dual-approval for privileged assignments before production.
- Verify identity tokens, issuer, audience, expiry, and revocation; rate-limit login, search, donor, and report endpoints. Use TLS, strict origin allowlists, secure headers, request-size limits, CSRF protection for cookie auth, and parameterized queries.
- Log moderation/price/role/emergency changes in the same database transaction as the mutation. Derive client IP only from a correctly configured trusted proxy; do not accept it from request JSON.
- Encrypt donor contact data with managed keys, return phone numbers only for an authorized emergency workflow, log every access, and provide donor consent/withdrawal and retention controls.
- Use keyset pagination, composite indexes listed above, bounded date ranges, cached aggregate overview queries, and asynchronous export jobs with expiring signed download URLs. Never export private donor contacts or ownership documents in growth reports.
- Configure production Firebase web credentials, trusted origins, private storage, ClamAV, SMS provider, managed phone encryption key, backups, and monitoring before enabling real operations. Push requires enrollment of encrypted FCM subscriptions; report generation still needs a PDF/XLSX/CSV worker. The browser UI may hide controls by role, but only API checks authorize operations.
- Migration `002_union_network.sql` seeds exactly nine canonical unions and nine initial ward records per union, adds local markets and response teams, and stores union IDs on price, property, donor, incident, audit, and notification records. Replace generic ward labels with verified local ward/area names before public rollout.
- Admin market, donor, property, team, incident, CRM, audit, and SSE screens call the protected API. Proofs stay private and are previewable only after ClamAV marks them clean. The notification worker requires a real SMS gateway and Firebase push credentials; report jobs still need a file-generation worker. No database, Firebase, GCS, ClamAV, or SMS provider credentials are committed.