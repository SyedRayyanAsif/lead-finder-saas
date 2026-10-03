// Placeholder brand name – change it here and it updates across the whole site.
export const SITE_NAME = 'LeadFinder'

// The three list sizes a customer can ask for. Shown on the landing page now,
// and reused by the request form later so the cap is always stated honestly.
export const RESULT_SIZES = [10, 20, 50]
export const MAX_RESULTS = Math.max(...RESULT_SIZES)

// How long we honestly expect a manual request to take.
export const TURNAROUND = 'a day or two'

// Max lengths for the request form. These mirror the CHECK constraints in
// supabase/schema.sql, so keep the two in step.
export const FIELD_LIMITS = {
  company_name: 200,
  industry: 200,
  product_details: 1000,
  extra_notes: 1000,
  target_customer: 300,
  target_country: 100,
  target_city: 100,
}
