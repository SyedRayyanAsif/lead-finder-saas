import { Link } from 'react-router-dom'
import LegalPage, { Fill } from '../components/LegalPage.jsx'
import { LEGAL, MAX_RESULTS, RESULT_SIZES, SITE_NAME, TURNAROUND } from '../config.js'

export default function Terms() {
  return (
    <LegalPage title="Terms of Use">
      <p className="lead">
        These terms are the agreement between you and us when you use {SITE_NAME}. Please read them
        before you create an account. If you don’t agree, please don’t use the service.
      </p>

      <aside className="legal__summary" aria-label="The short version">
        <h2>The short version</h2>
        <ul>
          <li>{SITE_NAME} is an early-access service for businesses. Each request is researched by hand.</li>
          <li>It’s free for now. We’ll tell you well in advance before anything changes.</li>
          <li>We do our best, but we can’t promise every result is complete or correct. Check before you rely on it.</li>
          <li>You’re responsible for using the results lawfully, especially when you contact the companies.</li>
        </ul>
      </aside>

      <h2>1. Who we are</h2>
      <p>
        {SITE_NAME} is operated by <Fill>{LEGAL.operatorName}</Fill>,{' '}
        <Fill>{LEGAL.operatorAddress}</Fill> (“we”, “us”). You can reach us at{' '}
        <a href={`mailto:${LEGAL.contactEmail}`}>
          <Fill>{LEGAL.contactEmail}</Fill>
        </a>
        . Our <Link to="/privacy">Privacy Policy</Link> explains how we handle personal information.
      </p>

      <h2>2. The service</h2>
      <p>
        You tell us what you sell and what kind of customers you want to find. We research real
        companies that fit, and give you a list with a decision maker (marked “Verified” or
        “Unverified”), a lead score, and a drafted outreach email for each company.
      </p>
      <ul>
        <li>
          Each request returns up to {RESULT_SIZES.slice(0, -1).join(', ')} or {MAX_RESULTS}{' '}
          companies, as you choose.
        </li>
        <li>
          We’re in early access, so requests are researched by hand. Results typically arrive
          within {TURNAROUND}, but that’s an estimate, not a promise.
        </li>
        <li>
          We may decline, limit, or stop work on a request, for example if it looks unlawful or
          abusive.
        </li>
      </ul>

      <h2>3. Your account</h2>
      <ul>
        <li>{SITE_NAME} is for business use, and you must be at least 18.</li>
        <li>Give us accurate information and keep your password private.</li>
        <li>You’re responsible for what happens under your account. Tell us promptly if you think it has been misused.</li>
      </ul>

      <h2>4. Free during early access</h2>
      <p>
        {SITE_NAME} is free while we’re in early access. We may introduce paid plans later. We’ll
        tell you well in advance, and you’ll never be charged without clearly agreeing to it.
      </p>

      <h2>5. Accuracy of results</h2>
      <p>
        We work carefully, but information about companies and people changes, and some will be
        incomplete or out of date. “Verified” means we confirmed that detail when we prepared your
        list. “Unverified” means we couldn’t confirm it, so double-check before you rely on it.
        Lead scores and drafted emails are suggestions: read and edit every email before you send
        it. We don’t guarantee that results will lead to any sale, reply, or other outcome.
      </p>

      <h2>6. Using the results lawfully</h2>
      <p>
        You’re responsible for how you use the results. In particular, you must follow the laws
        that apply to you and to the people you contact, including data protection and
        marketing-email rules. These differ by country, and in some places, including some EU
        countries, unsolicited commercial email to businesses needs prior consent or is tightly
        restricted. This is not legal advice, so check the rules where you and your recipients are
        before you send anything.
      </p>
      <p>When you contact people from your results, you must:</p>
      <ul>
        <li>identify yourself honestly and don’t mislead anyone;</li>
        <li>offer an easy way to opt out, and respect anyone who asks you to stop or to delete their details; and</li>
        <li>use the results only for your own business, and don’t resell or publish them.</li>
      </ul>

      <h2>7. What you submit</h2>
      <p>
        You’re responsible for the information in your requests, and you promise you’re allowed to
        share it. You give us permission to use it to provide the service to you, including
        researching your request and preparing your results, as described in our Privacy Policy.
      </p>

      <h2>8. Acceptable use</h2>
      <p>Please don’t:</p>
      <ul>
        <li>use the service for anything unlawful, deceptive, harassing, or abusive;</li>
        <li>try to access other people’s accounts or data, or to disrupt or overload the site;</li>
        <li>copy or scrape the service, or get around its limits; or</li>
        <li>submit requests that are false or meant to harm someone.</li>
      </ul>
      <p>We can suspend or close an account that breaks these rules.</p>

      <h2>9. Our content</h2>
      <p>
        The site, its design, and its software belong to us. We give you a personal,
        non-transferable right to use your results for your own business, as described in these
        terms.
      </p>

      <h2>10. Availability and changes</h2>
      <p>
        {SITE_NAME} is in early access. It may have errors or be unavailable at times, and we may
        change, pause, or end features. We don’t promise a particular level of uptime. Please
        export the results you want to keep: there is an “Export to CSV” button on each results
        page.
      </p>

      <h2>11. Our responsibility to you</h2>
      <p>
        The service is provided “as is”. To the extent the law allows, we aren’t liable for
        indirect or consequential losses (such as lost profit or lost business), or for anything
        that results from how you use the results, including contact you make with other
        businesses. Nothing in these terms limits liability that cannot be limited by law, for
        example for death or personal injury caused by negligence, or for fraud.
      </p>

      <h2>12. Ending your account</h2>
      <p>
        You can stop using {SITE_NAME} and ask us to delete your account at any time. We can
        suspend or end your access if you break these terms or if we stop offering the service. We’ll
        tell you if we do.
      </p>

      <h2>13. Changes to these terms</h2>
      <p>
        We may update these terms. We’ll show the date at the top, and email you about significant
        changes before they apply. If you keep using the service after a change, you accept it.
      </p>

      <h2>14. Governing law</h2>
      <p>
        These terms are governed by <Fill>{LEGAL.governingLaw}</Fill>. If we can’t resolve a
        disagreement informally, the courts there will handle it, unless the law gives you the
        right to go elsewhere.
      </p>

      <h2>15. Contact</h2>
      <p>
        Questions about these terms? Email{' '}
        <a href={`mailto:${LEGAL.contactEmail}`}>
          <Fill>{LEGAL.contactEmail}</Fill>
        </a>
        .
      </p>
    </LegalPage>
  )
}
