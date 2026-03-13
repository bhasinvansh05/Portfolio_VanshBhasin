import { useRef } from "react";
import { TimelineContent } from "./ui/timeline-animation";

export default function About() {
  const heroRef = useRef(null);
  
  const revealVariants = {
    visible: (i) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.4,
        duration: 0.8,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: 40,
      opacity: 0,
    },
  };
  
  const textVariants = {
    visible: (i) => ({
      filter: "blur(0px)",
      opacity: 1,
      transition: {
        delay: i * 0.2,
        duration: 0.8,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      opacity: 0,
    },
  };

  return (
    <section id="about" className="min-h-[70vh] flex flex-col justify-center px-4 sm:px-6 py-16 sm:py-24 relative z-10 w-full overflow-hidden">
      <div className="max-w-5xl mx-auto w-full" ref={heroRef}>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white mb-8 sm:mb-12 drop-shadow-[0_2px_10px_rgba(0,0,0,1)]">
          About
        </h2>
        
        <div className="flex flex-col lg:flex-row items-start gap-6 sm:gap-8 bg-card/30 border border-white/5 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 backdrop-blur-md">
          <div className="flex-1">
            <TimelineContent
              as="h3"
              animationNum={0}
              timelineRef={heroRef}
              customVariants={revealVariants}
              className="text-base sm:text-xl md:text-2xl lg:text-3xl leading-[1.6] font-medium text-muted-foreground"
            >
              Hey! I'm Vansh — a Computer Science student at York University with a soft spot for{" "}
              <TimelineContent
                as="span"
                animationNum={1}
                timelineRef={heroRef}
                customVariants={textVariants}
                className="text-amber-500 border-2 border-amber-500/40 inline-block border-dotted px-2 rounded-md mx-1 bg-amber-500/5 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
              >
                elegant systems
              </TimelineContent>{" "}
              that actually work. From building telemetry platforms for electric micro-mobility vehicles at Sarit, to training{" "}
              <TimelineContent
                as="span"
                animationNum={2}
                timelineRef={heroRef}
                customVariants={textVariants}
                className="text-cyan-400 border-2 border-cyan-400/40 inline-block border-dotted px-2 rounded-md mx-1 bg-cyan-400/5 shadow-[0_0_15px_rgba(34,211,238,0.1)]"
              >
                YOLO models
              </TimelineContent>{" "}
              on drone footage at Elder Lab, and predicting 5G electromagnetic fields with deep learning at NGWN Lab — I operate best where AI, data, and solid engineering converge.
              <br className="mb-6 block" />
              I'm equally comfortable orchestrating cloud pipelines as I am leading library operations and coordinating teams (yes, really). When I'm not shipping code, you'll find me dissecting{" "}
              <TimelineContent
                as="span"
                animationNum={3}
                timelineRef={heroRef}
                customVariants={textVariants}
                className="text-rose-500 border-2 border-rose-500/40 inline-block border-dotted px-2 rounded-md mx-1 bg-rose-500/5 shadow-[0_0_15px_rgba(244,63,94,0.1)]"
              >
                Formula 1
              </TimelineContent>{" "}
              tyre strategies, hunting down niche{" "}
              <TimelineContent
                as="span"
                animationNum={4}
                timelineRef={heroRef}
                customVariants={textVariants}
                className="text-emerald-400 border-2 border-emerald-400/40 inline-block border-dotted px-2 rounded-md mx-1 bg-emerald-400/5 shadow-[0_0_15px_rgba(52,211,153,0.1)]"
              >
                fragrances
              </TimelineContent>
              , or obsessing over the perfect minimal UI.
            </TimelineContent>
          </div>
        </div>
      </div>
    </section>
  );
}
