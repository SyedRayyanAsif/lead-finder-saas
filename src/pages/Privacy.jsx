import { Link } from 'react-router-dom'
import LegalPage, { Fill } from '../components/LegalPage.jsx'
import { LEGAL, SITE_NAME } from '../config.js'

export default function Privacy() {
  return (
    <LegalPage title="Privacy Policy">
      <p className="lead">
        This explains what information {SITE_NAME} collects, why, who it’s shared with, and the
        choices you have. We’ve tried to keep it plain and honest.
      </p>

      <aside className="legal__summary" aria-label="The short version">
        <h2>The short version</h2>
        <ul>
          <li>We collect what we need to run the service: your email, your requests, and the results we prepare for you.</li>
          <li>During early access we research each request by hand.</li>
          <li>No advertising, no tracking cookies, no analytics, and we don’t sell your data.</li>
          <li>A few service providers help us run the site (hosting, database, email). They’re listed below.</li>
          <li>You can ask us to show, correct, or delete your information at any time.</li>
        </ul>
      </aside>

      <h2>1. Who we are</h2>
      <p>
        {SITE_NAME} is operated by <Fill>{LEGAL.operatorName}</Fill>,{' '}
        <Fill>{LEGAL.operatorAddress}</Fill> (“we”, “us”). We are responsible for the personal
        information described here. Contact us at{' '}
        <a href={`mailto:${LEGAL.contactEmail}`}>
          <Fill>{LEGAL.contactEmail}</Fill>
        </a>
        .
      </p>

      <h2>2. Information we collect</h2>
      <h3>Information you give us</h3>
      <ul>
        <li>
          <strong>Your account:</strong> your email address and a password. We never see your
          password in readable form; it is handled by our sign-in provider (Supabase).
        </li>
        <li>
          <strong>Your requests:</strong> your company name, industry, product details, the kind of
          customer you want to find, the country and city, how many companies you want, and any
          optional notes you add.
        </li>
        <li>
          <strong>Messages:</strong> anything you send us by email.
        </li>
      </ul>

      <h3>Information we create for you</h3>
      <ul>
        <li>
          <strong>Your results:</strong> the companies we find for each request, with business
          contact details, a score, and a drafted outreach email (see section 4).
        </li>
        <li>
          <strong>Our records:</strong> when you sent each request, its status, and whether we’ve
          emailed you that your results are ready.
        </li>
      </ul>

      <h3>Information collected automatically</h3>
      <ul>
        <li>
          <strong>Technical data:</strong> like most websites, our hosting and database providers
          see your IP address and basic browser information when you use the site, and keep
          ordinary server logs.
        </li>
        <li>
          <strong>Your login:</strong> to keep you signed in, a sign-in token is kept in your
          browser’s local storage. A small note in session storage remembers that we’ve already
          shown a “your results are ready” celebration. Neither is used to track you.
        </li>
      </ul>

      <h3>What we don’t do</h3>
      <p>
        We don’t use advertising or analytics trackers, and the site sets no tracking cookies. We
        don’t take payments while we’re in early access, so we hold no card details.
      </p>

      <h2>3. How we use your information</h2>
      <ul>
        <li>to create and secure your account;</li>
        <li>to research your requests and deliver your results;</li>
        <li>to email you (for example, when your results are ready or about your account);</li>
        <li>to answer your questions and keep the service safe and working; and</li>
        <li>to meet our legal obligations.</li>
      </ul>
      <p>
        <strong>If you’re in the EEA or UK,</strong> our legal bases are: performing our agreement
        with you (providing the service); our legitimate interests (running, securing and improving
        a small service, and handling business contact details as described in section 4); and
        legal obligations. Where we rely on consent, you can withdraw it at any time.
      </p>
      <p>
        We use AI-assisted tools to help research companies and draft emails (
        <Fill>{LEGAL.aiTools}</Fill>), so details from your request may be processed by them. A
        person reviews each request. We don’t make decisions about you that have legal or similarly
        significant effects through automated means.
      </p>

      <h2>4. Information about businesses and people in your results</h2>
      <p>
        Your results contain information about companies and about people in business roles, such
        as a name, job title, and work email address. We gather it from publicly available sources
        such as <Fill>{LEGAL.researchSources}</Fill>, and mark a contact as “Verified” only when
        we’ve confirmed it, otherwise “Unverified”.
      </p>
      <p>
        If you’re one of those people and want to see, correct, or remove your details, email us at{' '}
        <a href={`mailto:${LEGAL.contactEmail}`}>
          <Fill>{LEGAL.contactEmail}</Fill>
        </a>{' '}
        and we’ll act on it. People who receive outreach from our customers may also object
        directly to that customer.
      </p>

      <h2>5. Who we share it with</h2>
      <p>We don’t sell personal information. We share it only with providers that help us run the service:</p>
      <ul>
        <li>
          <strong>Netlify</strong>, which hosts the website (sees visitors’ IP addresses and
          requests).
        </li>
        <li>
          <strong>Supabase</strong>, which provides our database and sign-in, and stores your
          account, requests and results in <Fill>{LEGAL.databaseRegion}</Fill>. It also sends the
          confirmation email when you sign up.
        </li>
        <li>
          <strong>Google Fonts</strong>, which supplies the typeface used on the site. When a page
          loads, your browser contacts Google, so Google receives your IP address and browser
          details.
        </li>
        <li>
          <strong>Our email</strong>: when we tell you your results are ready, we send the email
          from <Fill>{LEGAL.emailSender}</Fill>.
        </li>
        <li>
          <strong>AI tools</strong> that help with research and drafting, as described in
          section 3.
        </li>
      </ul>
      <p>
        We may also disclose information if the law requires it, or to protect our rights or the
        safety of others.
      </p>

      <h2>6. Transfers outside your country</h2>
      <p>
        Some of these providers are based in, or process data in, other countries, including the
        United States. Where the law requires it, we rely on safeguards such as standard
        contractual clauses to protect your information.
      </p>

      <h2>7. How long we keep it</h2>
      <p>
        We keep your account and request information <Fill>{LEGAL.retention}</Fill>. When a request
        is deleted, its results are deleted with it. We may keep limited records longer where the
        law requires or to resolve disputes.
      </p>

      <h2>8. Security</h2>
      <p>
        The site uses HTTPS, and our database is set up so that each customer can only read their
        own requests and results. Only we can see all records. No online service is perfectly
        secure, so we can’t guarantee absolute security, but we take reasonable care and will tell
        you about a breach that affects you where the law requires.
      </p>

      <h2>9. Your rights</h2>
      <p>Depending on where you live, you can ask us to:</p>
      <ul>
        <li>show you the information we hold about you;</li>
        <li>correct anything that’s wrong;</li>
        <li>delete your account and information;</li>
        <li>give you a copy you can reuse (data portability);</li>
        <li>limit how we use it, or object to certain uses.</li>
      </ul>
      <p>
        Email{' '}
        <a href={`mailto:${LEGAL.contactEmail}`}>
          <Fill>{LEGAL.contactEmail}</Fill>
        </a>{' '}
        and we’ll respond within one month. To delete your account, just ask, and we’ll delete it
        along with your requests and results. If you’re in the EEA or UK you can also complain to
        your local data protection authority.
      </p>

      <h2>10. Children</h2>
      <p>{SITE_NAME} is a business service and isn’t intended for anyone under 18.</p>

      <h2>11. Changes to this policy</h2>
      <p>
        We’ll update this page when something changes and show the date at the top. If a change is
        significant we’ll email you.
      </p>

      <h2>12. Contact</h2>
      <p>
        Questions about privacy? Email{' '}
        <a href={`mailto:${LEGAL.contactEmail}`}>
          <Fill>{LEGAL.contactEmail}</Fill>
        </a>
        . You can also read our <Link to="/terms">Terms of Use</Link>.
      </p>
    </LegalPage>
  )
}
