import PageShell, { Prose } from './PageShell';
import { portfolioData } from '../data/portfolio';
import { SITE } from '../lib/site';
import { getProjectsByRecency } from '../lib/utils';

export default function AboutPage() {
  const roles = portfolioData.experience;
  const projects = getProjectsByRecency().slice(0, 3);

  return (
    <PageShell
      path="/about/"
      kicker="About"
      title={`Who ${SITE.name} is and what he works on`}
      lede={SITE.tagline}
    >
      <Prose heading="Background">
        <p>{portfolioData.about.description}</p>
        <p>
          I am currently completing a computer science degree at York University
          in Toronto, Canada, alongside co-op and research placements. The
          through-line across all of it is the same: take a system that has to
          keep working when nobody is watching it, and make it do that
          reliably — whether that system is an executive dashboard, a vehicle
          telemetry feed, or a detection pipeline chewing through drone footage.
        </p>
      </Prose>

      <Prose heading="Current and recent roles">
        <ul className="space-y-4">
          {roles.map((role) => (
            <li key={role.id}>
              <p className="font-semibold text-[var(--ink)]">
                {role.role} · {role.company}
              </p>
              <p className="text-[0.9375rem]">{role.duration}</p>
              <p className="mt-1">{role.description}</p>
            </li>
          ))}
        </ul>
      </Prose>

      <Prose heading="Selected projects">
        <ul className="space-y-4">
          {projects.map((project) => (
            <li key={project.id}>
              <p className="font-semibold text-[var(--ink)]">
                {project.href ? (
                  <a
                    href={project.href}
                    className="underline decoration-black/20 underline-offset-4"
                  >
                    {project.title}
                  </a>
                ) : (
                  project.title
                )}
              </p>
              <p className="mt-1">{project.description}</p>
            </li>
          ))}
        </ul>
        <p>
          The full list, with implementation notes for each one, is on the{' '}
          <a
            href="/"
            className="underline decoration-black/20 underline-offset-4"
          >
            homepage
          </a>
          .
        </p>
      </Prose>

      <Prose heading="Areas of technical depth">
        <p>{SITE.knowsAbout.join(' · ')}</p>
        <p>
          Day to day that means Python, TypeScript, SQL and Java; React,
          Next.js and Spring Boot on the product side; PyTorch, OpenCV and
          Pandas for anything model- or data-shaped; and Docker, Postgres and
          CI pipelines to keep all of it deployable.
        </p>
      </Prose>

      <Prose heading="Get in touch">
        <p>
          The fastest route is email at{' '}
          <a
            href={`mailto:${SITE.email}`}
            className="underline decoration-black/20 underline-offset-4"
          >
            {SITE.email}
          </a>
          . The{' '}
          <a
            href="/contact/"
            className="underline decoration-black/20 underline-offset-4"
          >
            contact page
          </a>{' '}
          lists every verified channel, plus the kinds of enquiries that are a
          good fit.
        </p>
      </Prose>
    </PageShell>
  );
}
