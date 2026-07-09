# VibeLeak Manual Approval Flow

Setup:
1. Run supabase_schema.sql in Supabase.
2. Add Vercel env vars:
   - NEXT_PUBLIC_SITE_URL
   - NEXT_PUBLIC_SUPABASE_URL
   - SUPABASE_SERVICE_ROLE_KEY
   - ADMIN_PIN
3. Deploy.
4. Customer submits UTR.
5. Go to /admin, enter ADMIN_PIN, approve.
6. Customer opens /unlock/<id>.
