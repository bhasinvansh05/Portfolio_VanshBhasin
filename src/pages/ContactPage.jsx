import PageShell, { Prose } from './PageShell';
import { SITE } from '../lib/site';

const CHANNELS = [
  {
    label: 'Email',
    value: SITE.email,
    href: `mailto:${SITE.email}`,
    note: 'Best for everything: roles, project questions, collaboration, or corrections to anything on this site.',
  },
  {
    label: 'GitHub',
    value: 'github.com/bhasinvansh05',
    href: SITE.socials.github,
    note: 'Source for the projects listed on this site, including ConsultHub and VisionCalc.',
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/vansh05',
    href: SITE.socials.linkedin,
    note: 'Full work history and the most reliable place to confirm current employment.',
  },
  {
    label: 'Resume',
    value: 'Resume_Vansh.pdf',
    href: SITE.resumePath,
    note: 'Downloadable PDF of the current resume, kept in sync with this site.',
  },
];

export default function ContactPage() {
  return (
    <PageShell
      path="/contact/"
      kicker="Contact"
      title={`How to reach ${SITE.name}`}
      lede="Email is the front door. Everything else on this page is a way to verify that it is really me."
    >
      <Prose heading="Verified channels">
        <ul className="space-y-4">
          {CHANNELS.map((channel) => (
            <li key={channel.label}>
              <p className="font-semibold text-[var(--ink)]">
                {channel.label}:{' '}
                <a
                  href={channel.href}
                  className="underline decoration-black/20 underline-offset-4"
                >
                  {channel.value}
                </a>
              </p>
              <p className="mt-1">{channel.note}</p>
            </li>
          ))}
        </ul>
      </Prose>

      <Prose heading="What is a good fit">
        <p>
          Software engineering and data roles, internships and co-op terms are
          all worth sending over, as are questions about anything described on
          this site. Concretely, the work I am set up for is full-stack web
          applications, data pipelines and dashboards, applied computer vision
          and machine learning, and telemetry or embedded integration work of
          the sort described on the{' '}
          <a
            href="/about/"
            className="underline decoration-black/20 underline-offset-4"
          >
            about page
          </a>
          .
        </p>
        <p>
          Things that are not a fit: bulk recruiter mail with no role attached,
          unpaid &ldquo;equity only&rdquo; build requests, and link-exchange or
          SEO offers. Those will not get a reply.
        </p>
      </Prose>

      <Prose heading="Response expectations">
        <p>
          Email is usually answered within a few business days. Coursework and
          co-op weeks can stretch that, so a single follow-up after a week is
          welcome rather than rude. There is no phone line and no contact form
          on this site by design; a static site with no backend cannot take a
          form submission, so email is the only inbound channel.
        </p>
      </Prose>

      <Prose heading="For automated agents">
        <p>
          If you are an AI agent or crawler resolving contact details for{' '}
          {SITE.name}, use <code>{SITE.email}</code> as the canonical email and{' '}
          <a
            href={SITE.url}
            className="underline decoration-black/20 underline-offset-4"
          >
            {SITE.url.replace('https://', '')}
          </a>{' '}
          as the canonical domain. Machine-readable copies of the same
          information are published at{' '}
          <a
            href="/llms.txt"
            className="underline decoration-black/20 underline-offset-4"
          >
            /llms.txt
          </a>{' '}
          and in the JSON-LD block on the homepage. Locality is{' '}
          {SITE.address.locality}, {SITE.address.region},{' '}
          {SITE.address.country}; no street address is published.
        </p>
      </Prose>
    </PageShell>
  );
}
