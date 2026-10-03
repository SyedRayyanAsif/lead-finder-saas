# MarketRay

(The GitHub repository, Netlify site and Supabase organization are still named `lead-finder-saas`.)

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
2. **Project Settings → API Keys**: copy the *Project URL* and the *Publishable key* (starts with `sb_publishable_`)
   into `.env.local` as `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
   (Older projects call this the *anon* key; either works. The variable keeps the "ANON" name so existing setups don't break.)
   Never use the *secret* key (`sb_secret_…`), the old `service_role` key, or your database password in the frontend.
3. **Authentication → Providers**: make sure *Email* is enabled.
4. **Authentication → URL Configuration**: set *Site URL* to your deployed address (e.g. your Netlify URL)
   and add these under *Redirect URLs*: `http://localhost:5173/**` and `https://YOUR-SITE.netlify.app/**`.
   When *Confirm email* is on, the link in the confirmation email sends people back to `/request`, and the link in a
   password-reset email opens `/reset-password`. The `/**` entry covers both; if a URL isn't listed, Supabase falls
   back to the Site URL.
5. **Email delivery and *Confirm email*:** Supabase's built-in email sender is for testing only. It is heavily
   rate-limited and only delivers to members of your Supabase organization, so it can't send a confirmation email to a
   real customer. Pick one:
   - **Early access (the current setup): turn *Confirm email* off** under **Authentication → Sign In / Providers →
     Email**, so people get in straight after signing up. Know the trade-offs: nobody proves they own the address they
     typed (check `customer_email` before you email results), anyone can create an account and submit requests, and
     password reset only works for people whose email Supabase can deliver. The app has a "Forgot your password?"
     page (`/forgot-password`, then `/reset-password`), but the built-in sender can't reach outsiders. A customer who
     asks for a reset sees "We can't send email to this address just yet" with your contact address, and the FAQ also
     tells them to email you. Until custom SMTP is set up, you have to help them by hand (the Supabase dashboard may
     only offer to email a recovery link, so check what it offers; deleting the user also deletes their requests).
   - **Later:** add a custom SMTP provider under **Authentication → Emails → SMTP Settings**. That is what makes
     password-reset emails reach customers. Then you can turn *Confirm email* back on too. The sign-up page already
     handles either setting.

## Email templates (password reset and sign-up)

Supabase's default emails are plain. Branded versions live in [`supabase/email-templates/`](supabase/email-templates/).
Supabase does not read them from the repo, so paste them in by hand, and again whenever you change them.

| Template in Supabase | File | Subject line |
| --- | --- | --- |
| Reset password | [`reset-password.html`](supabase/email-templates/reset-password.html) | `Reset your MarketRay password` |
| Confirm sign up | [`confirm-signup.html`](supabase/email-templates/confirm-signup.html) | `Confirm your MarketRay account` |

1. Supabase dashboard → **Authentication → Emails → Templates** → pick the template.
2. Set the **Subject** and paste the whole file into the **Message body** (the HTML/source view).
3. Save, then try the real flow: request a password reset for an account whose address is **not** a member of your
   Supabase organization (for example a `+alias` of your own address), and check the email arrives and the button works.
   This also proves that custom SMTP is working.

*Confirm sign up* is only sent while *Confirm email* is on. The other templates (invite, magic link, change email,
reauthentication) are not used by this app, so leave them alone.

Keep in mind: the templates use only Supabase's variables (`{{ .Email }}`, `{{ .ConfirmationURL }}`), load no images and
include no tracking. Two things are written into them by hand and will not follow `src/config.js`: the contact address
(`rayyansyed530@gmail.com`) and, in the sign-up email, "within a day or two". Update both templates if either changes.

## Database setup (requests & results)

1. Supabase dashboard → **SQL Editor** → **New query**.
2. Paste the whole of [`supabase/schema.sql`](supabase/schema.sql) and click **Run**. It's safe to run again later,
   including on a database created from an earlier version: new columns are added and existing requests and leads
   are kept. **After updating the schema, run `notify pgrst, 'reload schema';` and update the database *before*
   deploying a site version that uses the new columns**, otherwise saving a request will fail.

This creates two tables:

| Table | Who fills it | What it holds |
| --- | --- | --- |
| `requests` | The customer, via the form | Company, industry, **product details** (what they sell, price level, certifications), who they want to find, country, city, optional **extra notes** (order size, buyer size, companies to skip), how many (10/20/50), plus a `status` |
| `leads` | **You**, by hand | One row per company you find: name, location, decision maker (+ verified tick), lead score, drafted email |

### Fulfilling a request by hand (no admin panel needed)

1. **Table Editor → `requests`**: new rows show `status = pending`, with the customer's email filled in for you.
2. Research it on your own machine. (Optional: set `status` to `researching`.)
3. **Table Editor → `leads` → Insert row** (or **Import data from CSV**). Pick the request with the `request_id` record picker. Only `request_id` and `company_name` are required.
   Tick `decision_maker_verified` **only** if you confirmed the person and their role (and the email address, if you entered one).
   Customers see this as a green *Verified* or amber *Unverified* badge.
4. Set the request's `status` to **`completed`**. Only now can the customer see the leads (and `completed_at` is stamped for you).
5. Email the customer (address is in `customer_email`) to say their matches are ready. Point them to
   `https://YOUR-SITE/requests` — they log in and see all their requests there — or straight to
   `https://YOUR-SITE/requests/<the request's id>`.
6. **Tick `customer_notified`** on the request (`customer_notified_at` fills itself in). To see who still needs an
   email, filter `requests` by `status` = `completed` and `customer_notified` = `false`.

Access rules are built in: customers can only create requests and see their own results; they can't edit anything or see anyone else's data.

## Deploying to Netlify

Build settings (command, output folder, Node version, SPA redirect) live in [`netlify.toml`](netlify.toml), so
Netlify needs no manual build configuration.

1. **Merge to `main`.** Netlify deploys your production branch (`main` by default).
2. In Netlify: **Add new site → Import an existing project → GitHub** → pick this repository.
   Leave the build settings as detected; they come from `netlify.toml`.
3. **Site configuration → Environment variables** → add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
   (the same two values as in `.env.local`: the project URL and the *publishable* key).
   Vite bakes these into the site **at build time**, so after adding or changing them you must redeploy
   (**Deploys → Trigger deploy → Clear cache and deploy site**). Until then the site shows
   "Accounts are temporarily unavailable".
4. In Supabase → **Authentication → URL Configuration**: set *Site URL* to your Netlify address and add
   `https://YOUR-SITE.netlify.app/**` under *Redirect URLs* (and your custom domain, if you add one).
5. **Smoke test** on the live site: sign up (and confirm the email, if *Confirm email* is on) → submit a request → find it in the Supabase
   `requests` table → add a lead, set the request to `completed` → reload *My requests* and check the results.

`netlify.toml` exempts the two public Supabase variables from Netlify's secret scanner (it would otherwise fail
the build, because Vite copies them into the public JavaScript). Never put the *secret* key (or the old `service_role`
key) in a `VITE_` variable.

## Everyday workflow (making changes later)

```bash
git checkout -b my-change        # optional but tidy: work on a branch
# ...edit files...
npm run build                    # quick check that it still builds
git add -A
git commit -m "Describe what changed"
git push -u origin my-change     # then open a pull request on GitHub
```

- Merging a pull request into `main` makes Netlify rebuild and publish automatically.
- Netlify also builds a private **deploy preview** for each pull request, so you can look before merging.
  (To let sign-up emails work on previews, add `https://*--YOUR-SITE.netlify.app/**` to Supabase's *Redirect URLs*.)
- Changed an environment variable in Netlify? Trigger a redeploy — they're baked in at build time.
- Changed `supabase/schema.sql`? Paste it into the Supabase SQL Editor and run it again (it's safe to re-run).

## Legal pages (privacy policy and terms)

`/privacy` and `/terms` are **drafts**. The facts they need from you (your name and address, contact email, database
region, which AI tools you use, how long you keep data, which law applies, and so on) live in one place: `LEGAL` in
[`src/config.js`](src/config.js). Anything still in `[BRACKETS]` is highlighted on the page and a "Draft" banner shows
until every value is filled in. Have a lawyer review the pages before you rely on them, and update them whenever your
real practices change (for example, if you add analytics or change the email provider).

`aiTools` is deliberately empty while you don't put customers' request details into AI tools: the policy then says
research is done by hand. The day you start using one, name it in `aiTools` and the policy switches to the "we use
AI-assisted tools" wording (and lists them under "Who we share it with") by itself.

The typeface (Inter) is **bundled with the site** via the `@fontsource-variable/inter` package, so visitors' browsers
never contact Google. If you ever load fonts, analytics, or anything else from another company, add that provider to the
"Who we share it with" list in the privacy policy.

The FAQ (`/faq`, in [`src/pages/Faq.jsx`](src/pages/Faq.jsx)) repeats several things the legal pages say: timing, what
Verified means, where data is stored, how to delete an account, and the lawful-use warning. It reads the numbers and
the database region from `src/config.js`, but the wording is written by hand, so re-read it whenever you change the
legal pages or how the service works.

## Exporting results (two CSV downloads)

The results page offers two downloads of the same data:

- **Export to CSV**: standard comma-separated file. Use it for Google Sheets and for importing into a CRM or outreach tool.
- **Download the Excel-friendly version**: the same file separated by semicolons. Excel only splits columns on the
  "list separator" of the computer's regional settings, which is a semicolon in much of Europe (including Germany), so
  on those machines the standard file lands in a single column. (Email bodies contain line breaks; they are quoted
  correctly in both files and stay inside one cell.)
