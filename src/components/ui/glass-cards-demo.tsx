import React from "react";
import { StackedCards } from "@/components/ui/glass-cards";

/** Demo component showcasing the stacked cards with different configurations */
export const DefaultDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-black">
      <StackedCards showIntro />
    </div>
  );
};

/** Alternative demo with different styling */
export const AlternativeDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-950">
      <div className="px-4 pt-10 sm:px-8">
        <h1 className="mb-2 text-center text-3xl font-medium text-white sm:text-4xl">
          Alternative Style Demo
        </h1>
        <p className="mb-8 text-center text-sm text-white/60">
          Same stacking interaction, quieter chrome.
        </p>
        <StackedCards />
      </div>
    </div>
  );
};

export default DefaultDemo;
