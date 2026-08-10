import Reveal from './Reveal';

const groups = [
  {
    title: 'Languages',
    items: ['Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'SQL'],
  },
  {
    title: 'Product & web',
    items: ['React', 'Node.js', 'Next.js', 'TailwindCSS', 'Flask', 'Express'],
  },
  {
    title: 'AI & data',
    items: ['PyTorch', 'TensorFlow', 'OpenCV', 'Pandas', 'Power BI', 'Tableau'],
  },
  {
    title: 'Systems',
    items: ['Docker', 'Kubernetes', 'AWS', 'PostgreSQL', 'MongoDB', 'Git'],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="apple-section relative z-10">
      <div className="apple-panel">
        <Reveal className="apple-section-head">
          <p className="apple-kicker mb-3">Skills</p>
          <h2 className="apple-title text-[clamp(1.75rem,1.2rem+2.2vw,3rem)] text-[var(--ink)]">
            What I reach for when something needs shipping
          </h2>
        </Reveal>

        <div className="grid gap-8 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-12">
          {groups.map((group, index) => (
            <Reveal key={group.title} delay={index * 0.04}>
              <div>
                <h3 className="apple-kicker">{group.title}</h3>
                <ul className="mt-3 space-y-2 sm:mt-4 sm:space-y-2.5">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="text-[clamp(1rem,0.9rem+0.45vw,1.125rem)] font-medium tracking-[-0.015em] text-[var(--ink)]"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
