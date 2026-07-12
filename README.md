# VibeLytix — Final Master

A production-ready Next.js self-discovery platform with premium reports, accounts, payments, admin operations, affiliate recommendations and search-focused educational content.

## Verified repository size

**85 deployable files**

Generated directories such as `node_modules`, `.next`, `coverage` and `.git` are excluded and must never be uploaded to GitHub.

## Product experiences

### Premium flagship

- Personality DNA
- 16 weighted questions
- Four explainable dimensions
- Free personal preview
- ₹149 premium report
- Coupon support
- Secure server-side report generation
- UPI payment and manual UTR verification
- Cloud report saving after sign-in

### Free full-result assessments

- Relationship Intelligence
- Career Alignment
- Growth Systems

All three use one shared assessment engine and one shared responsive interface to keep the repository below the 100-file limit.

## Growth and SEO foundation

- Search-focused assessment landing pages
- Four original educational guides
- Static generation for assessment and learning pages
- Canonical metadata
- FAQ, Organization, Website and Article structured data
- Sitemap and robots
- Generated Open Graph image
- Web app manifest
- Internal linking between assessments and guides
- First-party event collection
- Affiliate click tracking
- Result-based affiliate recommendations
- Affiliate disclosure

Technical SEO makes the site crawlable and understandable, but no codebase can guarantee a number-one Google ranking or a specific visitor count. Ranking also depends on content quality, authority, links, competition, user satisfaction and time.

## Accounts and privacy

- Supabase passwordless email authentication
- Protected dashboard
- Row-Level Security
- Cloud report history
- JSON export
- Report deletion
- Local browser saving before sign-in
- Server-only secrets
- Legal, privacy and refund pages

## Revenue operations

- Premium report locking
- UPI deep links
- UTR submission
- Duplicate UTR prevention
- Encrypted payment-status tokens
- Admin allowlist
- Approval and rejection
- Customer status links
- Optional Resend emails
- Coupon validation
- Admin revenue summary
- Assessment completion and affiliate-click metrics

## Required Supabase setup

Create a Supabase project and run the **entire** file:

```text
supabase/schema.sql
```

Do not run only selected fragments.

In Supabase Authentication URL Configuration add:

```text
http://localhost:3000/auth/callback
https://vibelytix.lol/auth/callback
```

Set the production Site URL to:

```text
https://vibelytix.lol
```

## Environment variables

Copy `.env.example` to `.env.local`.

Required for production:

```env
NEXT_PUBLIC_APP_URL=https://vibelytix.lol
NEXT_PUBLIC_SUPPORT_EMAIL=support@vibelytix.lol
NEXT_PUBLIC_UPI_ID=YOUR_REAL_UPI_ID@bank
NEXT_PUBLIC_UPI_NAME=VibeLytix

NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SECRET_KEY=YOUR_SUPABASE_SECRET_KEY

ADMIN_EMAILS=YOUR_ADMIN_LOGIN_EMAIL
PAYMENT_TOKEN_SECRET=AT_LEAST_32_RANDOM_CHARACTERS
PAYMENT_NOTIFICATION_EMAIL=YOUR_ADMIN_NOTIFICATION_EMAIL
```

Optional email delivery:

```env
RESEND_API_KEY=
EMAIL_FROM=VibeLytix <reports@vibelytix.lol>
```

Optional affiliate destinations:

```env
AFFILIATE_RELATIONSHIP_BOOK=
AFFILIATE_RELATIONSHIP_COURSE=
AFFILIATE_CAREER_BOOK=
AFFILIATE_CAREER_COURSE=
AFFILIATE_GROWTH_BOOK=
AFFILIATE_GROWTH_COURSE=
```

When an affiliate destination is blank, the recommendation safely opens a matching internal educational guide instead of a broken link.

## Local verification

```bash
npm install
npm run check
npm run dev
```

`npm run check` performs:

1. ESLint with zero warnings
2. Strict standalone TypeScript validation
3. Unit tests
4. Production build

The production build skips Next.js's duplicate internal type pass because strict `tsc --noEmit` already runs first and fails the quality gate when types are invalid. This keeps low-resource CI environments deterministic.

## Main routes

```text
/
 /assessments/personality-dna
 /assessments/relationship-intelligence
 /assessments/career-alignment
 /assessments/growth-systems
 /learn/how-personality-tests-work
 /learn/healthy-relationship-communication
 /learn/choose-a-career-that-fits
 /learn/build-habits-that-survive-bad-days
 /auth
 /dashboard
 /admin
```

## Verified quality results

- ESLint: passed with zero warnings
- Strict TypeScript: passed
- Unit tests: 21/21 passed
- Production compilation: passed
- Static generation: 27/27 routes generated
- Critical production advisories: 0
- High production advisories: 0
- Moderate production advisories: 2

## Deployment

1. Upload the clean project files to one GitHub repository.
2. Do not upload `node_modules` or `.next`.
3. Import the repository into Vercel.
4. Add every required environment variable.
5. Deploy.
6. Connect `vibelytix.lol`.
7. Verify `/api/health`.
8. Submit `https://vibelytix.lol/sitemap.xml` in Google Search Console.
9. Request indexing for the homepage and assessment pages.
10. Verify every UPI payment independently before approval.

## Vercel install fix (v5.0.1)

This package contains a regenerated Vercel-safe dependency configuration:

- Node.js pinned to `22.x`
- npm pinned through `packageManager: npm@10.9.2`
- public npm registry forced through `.npmrc`
- deterministic `npm ci --no-audit --no-fund` in `vercel.json`
- package-lock resolved URLs point to `https://registry.npmjs.org/`

After pushing this version, redeploy in Vercel with **Use existing Build Cache disabled**. The previous cache may contain the failed dependency installation.
