import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LEGAL, MAX_RESULTS, RESULT_SIZES, SITE_NAME, TURNAROUND } from '../config.js'

const email = (
  <a href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</a>
)

// Every answer here repeats something the Terms or the Privacy Policy already
// says, or something the app visibly does. If you change one, change the other.
const GROUPS = [
  {
    title: 'The basics',
    items: [
      {
        q: `What does ${SITE_NAME} do?`,
        a: (
          <p>
            You tell us what you sell and who you want to find. We research real companies that
            fit and give you a list. Each company comes with a decision maker, a score for how good
            a match it is, and a drafted outreach email you can edit and send.
          </p>
        ),
      },
      {
        q: 'Who is it for?',
        a: (
          <p>
            Businesses that want to sell to other businesses in a new market, for example a
            manufacturer looking for distributors or importers in another country.
          </p>
        ),
      },
      {
        q: 'Do I need an account, and does it cost anything?',
        a: (
          <p>
            You need a free account, which takes an email address and a password. {SITE_NAME} is
            free during early access and there is no credit card. If we introduce paid plans later,
            we’ll tell you well in advance, and you’ll never be charged without clearly agreeing to
            it.
          </p>
        ),
      },
    ],
  },
  {
    title: 'Requests and timing',
    items: [
      {
        q: 'How do I ask for a list?',
        a: (
          <p>
            After you sign up, fill in the request form: your company, your industry and product,
            who you want to find, the country and city, and how many companies you want. The more
            specific you are, the better your matches will be.
          </p>
        ),
      },
      {
        q: 'How many companies can I ask for?',
        a: (
          <p>
            {RESULT_SIZES.slice(0, -1).join(', ')} or {MAX_RESULTS} per request, so one request
            never returns more than {MAX_RESULTS}. You can send another request any time.
          </p>
        ),
      },
      {
        q: 'How long does it take?',
        a: (
          <p>
            Results typically arrive within {TURNAROUND}. That’s an estimate, not a promise, and
            it’s never instant, because we’re in early access and research every request by hand.
          </p>
        ),
      },
      {
        q: 'Is it automated?',
        a: (
          <p>
            No. During early access a person researches each request by hand, which is why results
            take {TURNAROUND} instead of appearing straight away.
          </p>
        ),
      },
      {
        q: 'How will I know my list is ready?',
        a: (
          <p>
            We email you personally at the address on your account. You can also log in and open{' '}
            <Link to="/requests">My requests</Link> at any time to see where a request stands. Once
            it’s finished, the matches appear there.
          </p>
        ),
      },
    ],
  },
  {
    title: 'Your results',
    items: [
      {
        q: 'What do I get for each company?',
        a: (
          <p>
            The company name and location, its website, a decision maker with their job title, a
            lead score, and a drafted outreach email. Some results also include a work email
            address when we have one.
          </p>
        ),
      },
      {
        q: 'What do “Verified” and “Unverified” mean?',
        a: (
          <p>
            Verified means we confirmed that person and their role when we prepared your list.
            Unverified means we couldn’t confirm it, so double-check before you reach out.
          </p>
        ),
      },
      {
        q: 'What is the lead score?',
        a: (
          <p>
            A number from 0 to 100 for how well we think a company matches what you asked for.
            Higher is better. It’s our judgement, so treat it as a guide to where to start, not a
            guarantee that anyone will buy.
          </p>
        ),
      },
      {
        q: 'Can I use the emails as written?',
        a: (
          <p>
            They’re drafts. Read and edit every one before you send it. We never contact the
            companies for you, so you decide who to write to and what to say.
          </p>
        ),
      },
      {
        q: 'Can I download my list?',
        a: (
          <p>
            Yes. Every results page has an Export to CSV button. If your spreadsheet puts
            everything into a single column, use the Excel-friendly version linked beneath it. It
            suits computers set up with European regional settings.
          </p>
        ),
      },
    ],
  },
  {
    title: 'Privacy and legal',
    items: [
      {
        q: 'Where is my data stored, and who can see it?',
        a: (
          <p>
            In a database in {LEGAL.databaseRegion}. Each customer can only see their own requests
            and results. We don’t sell personal information and we use no advertising or tracking
            cookies. The <Link to="/privacy">Privacy Policy</Link> has the full detail.
          </p>
        ),
      },
      {
        q: 'How do I delete my account?',
        a: (
          <p>
            Email {email} and we’ll delete your account along with your requests and results.
          </p>
        ),
      },
      {
        q: 'Am I allowed to email the companies on my list?',
        a: (
          <>
            <p>
              You’re responsible for following the laws that apply to you and to the people you
              contact, including data protection and marketing email rules. These differ by
              country, and in some places, including some EU countries, unsolicited commercial
              email to businesses needs prior consent or is tightly restricted. This is not legal
              advice, so check the rules before you send anything.
            </p>
            <p>
              Please use the results only for your own business, and don’t resell or publish them.
              The <Link to="/terms">Terms of Use</Link> cover this in full.
            </p>
          </>
        ),
      },
    ],
  },
  {
    title: 'Help',
    items: [
      {
        q: 'I forgot my password. What do I do?',
        a: (
          <p>
            There’s no automatic password reset yet. Email {email} from the address on your
            account and we’ll help.
          </p>
        ),
      },
      {
        q: 'How do I contact you?',
        a: <p>Email {email}.</p>,
      },
    ],
  },
]

export default function Faq() {
  useEffect(() => {
    const previous = document.title
    document.title = `FAQ | ${SITE_NAME}`
    return () => {
      document.title = previous
    }
  }, [])

  return (
    <section className="section">
      <div className="container faq">
        <h1 className="h2">Frequently asked questions</h1>
        <p className="lead">
          Straight answers about how {SITE_NAME} works during early access. If something isn’t
          covered here, email us.
        </p>

        {GROUPS.map((group) => (
          <section key={group.title} className="faq__group" aria-label={group.title}>
            <h2 className="faq__heading">{group.title}</h2>
            {group.items.map((item) => (
              <details key={item.q} className="faq__item">
                <summary>{item.q}</summary>
                <div className="faq__answer">{item.a}</div>
              </details>
            ))}
          </section>
        ))}

        <div className="faq__cta">
          <h2 className="faq__heading">Still have a question?</h2>
          <p>
            Email {email} and we’ll get back to you. Ready to try it?{' '}
            <Link to="/signup">Request your first list</Link>.
          </p>
        </div>
      </div>
    </section>
  )
}
