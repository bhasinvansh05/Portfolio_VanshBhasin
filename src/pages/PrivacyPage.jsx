import PageShell, { Prose } from './PageShell';
import { SITE } from '../lib/site';

/**
 * Statement of fact about a static site: it is accurate only for as long as
 * the site ships no analytics, no cookies, and no third-party embeds. Adding
 * any of those means this page has to be updated in the same change.
 */
export default function PrivacyPage() {
  return (
    <PageShell
      path="/privacy/"
      kicker="Privacy"
      title="Privacy on this site"
      lede="This site collects nothing. The detail below explains what that means and who else is involved in serving it."
    >
      <Prose heading="What this site collects">
        <p>
          Nothing. {SITE.url.replace('https://', '')} is a static site: a
          bundle of HTML, CSS, JavaScript, images and one PDF, served as files.
          There is no backend, no database, no account system and no contact
          form, so there is nowhere for personal data to be submitted to or
          stored.
        </p>
        <p>
          The site sets no cookies and uses no local storage for tracking. It
          runs no analytics, no tag manager, no advertising scripts, no session
          recording and no A/B testing. Fonts are the ones already on your
          device, and every image is served from this domain, so simply loading
          a page makes no request to any third party.
        </p>
      </Prose>

      <Prose heading="Who else is involved">
        <p>
          Serving any website means someone sees the request. This site is
          hosted on GitHub Pages and served through Cloudflare, and both keep
          their own short-lived operational logs — typically IP address, user
          agent, requested path and timestamp — for delivery, caching and abuse
          prevention. Those logs are handled under their own privacy policies
          and are not accessible to me in an identifiable form.
        </p>
        <p>
          Some pages link out to GitHub, LinkedIn and project subdomains.
          Following those links puts you on someone else&rsquo;s site, under
          their policies, not this one.
        </p>
      </Prose>

      <Prose heading="Your data requests">
        <p>
          Because nothing is collected, there is generally nothing to export or
          delete. If you have emailed me, that message sits in my mailbox like
          any other email, and you can ask for it to be deleted at{' '}
          <a
            href={`mailto:${SITE.email}`}
            className="underline decoration-black/20 underline-offset-4"
          >
            {SITE.email}
          </a>
          . The same address handles any question about this statement, and any
          correction to information published about me on this site.
        </p>
      </Prose>

      <Prose heading="Changes">
        <p>
          If this site ever gains analytics or any other third-party script,
          this page gets updated in the same change that introduces it. The
          page&rsquo;s history is public in the repository behind the site, so
          any edit to this statement is auditable.
        </p>
      </Prose>
    </PageShell>
  );
}
