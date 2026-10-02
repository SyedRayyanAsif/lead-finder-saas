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

## Database setup (requests & results)

1. Supabase dashboard → **SQL Editor** → **New query**.
2. Paste the whole of [`supabase/schema.sql`](supabase/schema.sql) and click **Run**. It's safe to run again later.

This creates two tables:

| Table | Who fills it | What it holds |
| --- | --- | --- |
| `requests` | The customer, via the form | Company, industry, who they want to find, country, city, how many (10/20/50), plus a `status` |
| `leads` | **You**, by hand | One row per company you find: name, location, decision maker (+ verified tick), lead score, drafted email |

### Fulfilling a request by hand (no admin panel needed)

1. **Table Editor → `requests`**: new rows show `status = pending`, with the customer's email filled in for you.
2. Research it on your own machine. (Optional: set `status` to `researching`.)
3. **Table Editor → `leads` → Insert row** (or **Import data from CSV**). Pick the request with the `request_id` record picker. Only `request_id` and `company_name` are required.
   Tick `decision_maker_verified` **only** if you confirmed the person and their role.
4. Set the request's `status` to **`completed`**. Only now can the customer see the leads (and `completed_at` is stamped for you).
5. Email the customer (address is in `customer_email`) to say their matches are ready.

Access rules are built in: customers can only create requests and see their own results; they can't edit anything or see anyone else's data.
