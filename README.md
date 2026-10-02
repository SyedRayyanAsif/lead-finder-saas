# lead-finder-saas
A lead research tool for businesses expanding into new markets. Tell us your product and target customers, and we find, qualify, and verify real companies that match, with draft outreach emails ready to send.

## Local development

```bash
npm install
cp .env.example .env.local   # then fill in your Supabase values
npm run dev                  # http://localhost:5173
npm run build                # production build into dist/
```

## Supabase setup (sign up / login)

1. Create a free project at [supabase.com](https://supabase.com).
2. **Project Settings → API**: copy the *Project URL* and the *anon public* key into `.env.local` as
   `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Never use the `service_role` key in the frontend.
3. **Authentication → Providers**: make sure *Email* is enabled.
4. **Authentication → URL Configuration**: set *Site URL* to your deployed address (e.g. your Netlify URL)
   and add these under *Redirect URLs*: `http://localhost:5173/**` and `https://YOUR-SITE.netlify.app/**`.
   Confirmation emails send people back to `/request`; if the URL isn't listed, Supabase falls back to the Site URL.
5. **Email delivery:** Supabase's built-in email sender is for testing only. It is heavily rate-limited and may only
   deliver to your own team's addresses. Before real customers sign up, add a custom SMTP provider under
   **Authentication → Emails → SMTP Settings** (or, for private testing only, turn off *Confirm email*).
