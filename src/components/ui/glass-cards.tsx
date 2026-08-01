import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Calculator,
  ExternalLink,
  Plane,
  RadioTower,
  Bike,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  cardData,
  type GlassCardIcon,
  type GlassCardItem,
  cn,
} from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const ICONS: Record<GlassCardIcon, LucideIcon> = {
  briefcase: BriefcaseBusiness,
  hand: Calculator,
  drone: Plane,
  radio: RadioTower,
  bike: Bike,
};

export interface ProjectTileProps {
  project: GlassCardItem;
  className?: string;
  onSelect?: () => void;
}

/** Pitch-black square project tile with logo + white title. */
export function ProjectTile({ project, className, onSelect }: ProjectTileProps) {
  const Icon = ICONS[project.icon];

  return (
    <article
      className={cn(
        "relative flex aspect-square w-full flex-col overflow-hidden rounded-[22px] border border-white/16 bg-black text-white shadow-[0_16px_40px_rgba(0,0,0,0.75)]",
        className,
      )}
    >
      <div className="relative z-[2] flex h-full flex-col p-5 sm:p-6">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/[0.04]">
          <Icon className="h-5 w-5 text-white" strokeWidth={1.75} aria-hidden="true" />
        </div>

        <h3 className="text-[1.25rem] font-semibold leading-tight tracking-tight text-white sm:text-xl md:text-2xl">
          {project.href ? (
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-start gap-2 rounded-sm underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span>{project.title}</span>
              <ExternalLink className="mt-1 h-4 w-4 shrink-0 opacity-70" aria-hidden="true" />
            </a>
          ) : (
            project.title
          )}
        </h3>

        {project.meta ? (
          <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-white/45">
            {project.meta}
          </p>
        ) : null}

        <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-white/65 sm:line-clamp-5">
          {project.description}
        </p>

        <div className="mt-auto flex flex-col gap-3 pt-4">
          <div className="flex flex-wrap gap-1.5">
            {project.tags?.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="border border-white/12 bg-white/[0.04] text-white/80"
              >
                {tag}
              </Badge>
            ))}
          </div>

          {onSelect ? (
            <button
              type="button"
              onClick={onSelect}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1.5 text-sm font-medium text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Read more
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}

interface StackCardProps {
  id: number;
  title: string;
  description: string;
  index: number;
  totalCards: number;
  icon: GlassCardIcon;
  href?: string;
  tags?: string[];
  meta?: string;
  onSelect?: () => void;
}

const StackCard: React.FC<StackCardProps> = ({
  title,
  description,
  index,
  totalCards,
  icon,
  href,
  tags,
  meta,
  onSelect,
  id,
}) => {
  const project: GlassCardItem = {
    id,
    title,
    description,
    color: "#000000",
    icon,
    year: 0,
    href,
    tags,
    meta,
  };
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const container = containerRef.current;
    if (!card || !container) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const targetScale = 1 - (totalCards - index) * 0.035;

    gsap.set(card, {
      scale: 1,
      transformOrigin: "center top",
    });

    if (prefersReduced) {
      gsap.set(card, { scale: targetScale });
      return;
    }

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        const scale = gsap.utils.interpolate(1, targetScale, self.progress);
        gsap.set(card, {
          scale: Math.max(scale, targetScale),
          transformOrigin: "center top",
        });
      },
    });

    ScrollTrigger.refresh();

    return () => {
      trigger.kill();
    };
  }, [index, totalCards]);

  return (
    <div
      ref={containerRef}
      className="sticky flex h-[100svh] items-start justify-center px-3 sm:px-6"
      style={{
        zIndex: index + 1,
        top: `calc(10svh + ${index} * min(86vw, 380px) * 0.65)`,
      }}
    >
      <div
        ref={cardRef}
        className="will-change-transform w-[min(86vw,380px)]"
        style={{ transformOrigin: "top center" }}
      >
        <ProjectTile project={project} onSelect={onSelect} />
      </div>
    </div>
  );
};

export interface StackedCardsProps {
  cards?: GlassCardItem[];
  showIntro?: boolean;
  className?: string;
  onSelectCard?: (card: GlassCardItem) => void;
}

export const StackedCards: React.FC<StackedCardsProps> = ({
  cards = cardData,
  showIntro = false,
  className,
  onSelectCard,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const tween = gsap.fromTo(
      container,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.7,
        ease: "power2.out",
      },
    );

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      tween.kill();
      window.removeEventListener("load", onLoad);
    };
  }, [cards.length]);

  return (
    <div ref={containerRef} className={cn("w-full bg-transparent", className)}>
      {showIntro ? (
        <section className="relative grid h-[40vh] w-full place-content-center text-white">
          <h2 className="relative z-[1] px-8 text-center text-[clamp(1.75rem,4vw,3rem)] font-medium leading-tight">
            Stacking Glass Cards with GSAP
            <br />
            Scroll down
          </h2>
        </section>
      ) : null}

      <section className="relative w-full text-white">
        {cards.map((card, index) => (
          <StackCard
            key={card.id}
            id={card.id}
            title={card.title}
            description={card.description}
            index={index}
            totalCards={cards.length}
            icon={card.icon}
            href={card.href}
            tags={card.tags}
            meta={card.meta}
            onSelect={onSelectCard ? () => onSelectCard(card) : undefined}
          />
        ))}
        <div aria-hidden="true" className="h-[20vh]" />
      </section>
    </div>
  );
};

export default StackedCards;
