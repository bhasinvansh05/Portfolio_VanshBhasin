import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type GlassCardIcon =
  | "briefcase"
  | "hand"
  | "drone"
  | "radio"
  | "bike"

export type GlassCardItem = {
  id: number
  title: string
  description: string
  color: string
  icon: GlassCardIcon
  /** End year for sorting “most recent” (higher = newer). */
  year: number
  href?: string
  tags?: string[]
  meta?: string
  details?: string[]
}

/** Default project card data used by Featured Work / demos. */
export const cardData: GlassCardItem[] = [
  {
    id: 1,
    title: "ConsultHub",
    description:
      "Full-stack consulting booking platform: Spring Boot REST API, PostgreSQL, Dockerized React frontend, and role-based flows for clients, consultants, and admins.",
    color: "#000000",
    icon: "briefcase",
    year: 2026,
    href: "https://consulthub.vanshbhasin.dev",
    tags: ["Spring Boot", "PostgreSQL"],
    meta: "EECS 3311 · 2025–2026",
    details: [
      "Layered Spring Boot backend (package-by-feature) with JPA: services catalog, availability slots, booking lifecycle, payments, notifications, JWT security, and admin policies.",
      "Modeled bookings with the State pattern (requested → confirmed → paid → completed, with reject/cancel paths), Strategy pattern for payment types (credit, debit, PayPal, bank transfer), and a factory for hydrating states from persisted status.",
      "Ran end-to-end with Docker Compose (PostgreSQL, API, Vite React UI), Neon or local Postgres optional, H2 for tests; integrated Gemini-powered AI assistant for clients.",
      "Live app at consulthub.vanshbhasin.dev; source at https://github.com/bhasinvansh05/ConsultHub.",
    ],
  },
  {
    id: 2,
    title: "VisionCalc",
    description:
      "In-browser hand-gesture calculator: count fingers for digits and signal operators with MediaPipe HandLandmarker — no backend, just webcam and computer vision.",
    color: "#000000",
    icon: "hand",
    year: 2026,
    href: "https://visioncalc.vanshbhasin.dev",
    tags: ["Computer Vision", "MediaPipe"],
    meta: "Personal · 2026",
    details: [
      "Built a static React + TypeScript SPA that tracks hands entirely in the browser with Google MediaPipe HandLandmarker — digits from extended-finger counts (0–5), distinct signals for +, −, ×, ÷, =, and clear.",
      "Separated recognition into pure, unit-tested logic: finger-extension state, gesture-to-token mapping, hold-to-confirm stabilization (~0.9 s), and a safe expression evaluator.",
      "Shipped a minimal Apple-inspired UI with live camera overlay, detection HUD, and gesture guide; demo mode drives the real pipeline without a webcam.",
      "Live app at visioncalc.vanshbhasin.dev; source at https://github.com/bhasinvansh05/VisionCalc.",
    ],
  },
  {
    id: 3,
    title: "Drone Traffic Analysis Pipeline",
    description:
      "Scalable computer vision system for analyzing drone-captured traffic footage using YOLO models.",
    color: "#000000",
    icon: "drone",
    year: 2025,
    tags: ["Computer Vision", "YOLO"],
    meta: "Elder Lab · 2025",
    details: [
      "Developed scalable computer vision pipelines to analyze drone traffic using YOLO object detection models.",
      "Sped up deployment by 40% across hybrid cloud environments using Docker and CI/CD tools.",
      "Built end-to-end data processing workflows for aerial traffic surveillance at Elder Lab, York University.",
    ],
  },
  {
    id: 4,
    title: "EMF Exposure Prediction System",
    description:
      "Deep learning research for predicting electromagnetic field exposure using generative data augmentation.",
    color: "#000000",
    icon: "radio",
    year: 2025,
    tags: ["Deep Learning", "Data Analytics"],
    meta: "NGWN Lab · 2024–2025",
    details: [
      "Conducted research on EMF exposure prediction using deep learning and generative data augmentation techniques.",
      "Built data pipelines connecting Python, SQL, and Power BI, boosting validation workflows by 15%.",
      "Published findings on predictive modeling for 5G network electromagnetic field mapping.",
    ],
  },
  {
    id: 5,
    title: "Micromobility Telemetry Platform",
    description:
      "Software systems supporting telemetry, safety, and data processing for electric micro-mobility vehicles.",
    color: "#000000",
    icon: "bike",
    year: 2026,
    tags: ["IoT", "Software Integration"],
    meta: "Sarit Micromobility · 2026",
    details: [
      "Contributed to the development and testing of software systems supporting telemetry, safety, and data processing.",
      "Worked on real-time data pipelines for electric micro-mobility vehicle monitoring and diagnostics.",
      "Integrated safety and compliance modules into the core mobility platform.",
    ],
  },
]

/** Newest first (year, then id). */
export function getProjectsByRecency(
  projects: GlassCardItem[] = cardData,
): GlassCardItem[] {
  return [...projects].sort((a, b) => b.year - a.year || b.id - a.id)
}

export function getRecentProjects(
  count = 3,
  projects: GlassCardItem[] = cardData,
): GlassCardItem[] {
  return getProjectsByRecency(projects).slice(0, count)
}
