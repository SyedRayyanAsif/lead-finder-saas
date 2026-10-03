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

// Facts the privacy policy and terms need from YOU. Anything still starting with
// "[" shows up highlighted on the legal pages, and while any are left a visible
// "Draft" banner is shown. Replace each value with the real fact (no brackets).
export const LEGAL = {
  lastUpdated: '3 October 2026',
  operatorName: '[YOUR FULL NAME OR BUSINESS NAME]',
  operatorAddress: '[YOUR POSTAL ADDRESS]',
  contactEmail: '[YOUR CONTACT EMAIL]',
  governingLaw: '[THE LAW THAT APPLIES, e.g. the laws of Germany]',
  databaseRegion: '[YOUR SUPABASE REGION, e.g. Frankfurt, Germany]',
  emailSender: '[THE EMAIL ADDRESS OR SERVICE YOU SEND RESULTS FROM]',
  researchSources:
    '[PUBLIC SOURCES YOU USE, e.g. company websites and public business directories]',
  aiTools: '[NAMES OF THE AI TOOLS OR PROVIDERS YOU USE FOR RESEARCH AND DRAFTING]',
  retention: '[HOW LONG YOU KEEP DATA, e.g. until you ask us to delete it]',
}

export const legalHasPlaceholders = Object.values(LEGAL).some(
  (v) => typeof v === 'string' && v.startsWith('['),
)
