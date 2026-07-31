"use client"

import { MeshGradient } from "@paper-design/shaders-react"
import { motion } from "framer-motion"
import { useState, useEffect, useId, useRef } from "react"

export type CreatureExpression =
  | "normal"
  | "curious"
  | "sleepy"
  | "glance"
  | "blink"
  | "startled"
  | "happy"

const EXPRESSION_EYES: Record<
  CreatureExpression,
  { rx: number; ry: number; baseOffset?: { x: number; y: number } }
> = {
  normal: { rx: 20, ry: 30 },
  curious: { rx: 24, ry: 34 },
  sleepy: { rx: 20, ry: 8 },
  glance: { rx: 18, ry: 28, baseOffset: { x: 6, y: -2 } },
  blink: { rx: 20, ry: 3 },
  startled: { rx: 28, ry: 38 },
  // Squinty smile-eyes
  happy: { rx: 22, ry: 10, baseOffset: { x: 0, y: 2 } },
}

export interface MeshGradientSVGProps {
  expression?: CreatureExpression
  className?: string
  /** Soften the idle bob while resting */
  reducedBob?: boolean
  /** Extra scale pulse for energize */
  energize?: boolean
}

export function MeshGradientSVG({
  expression = "normal",
  className = "",
  reducedBob = false,
  energize = false,
}: MeshGradientSVGProps) {
  const colors = [
    "#FFB3D9", // Pastel pink
    "#87CEEB", // Sky blue
    "#4A90E2", // Medium blue
    "#2C3E50", // Dark blue-gray
    "#1A1A2E", // Very dark blue
  ]

  const clipId = useId().replace(/:/g, "")
  const svgRef = useRef<SVGSVGElement | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 })

  const eye = EXPRESSION_EYES[expression]
  const trackEyes = expression !== "sleepy" && expression !== "blink"

  useEffect(() => {
    if (!trackEyes) return
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [trackEyes])

  useEffect(() => {
    if (!trackEyes) {
      setEyeOffset(eye.baseOffset ?? { x: 0, y: 0 })
      return
    }

    const rect = svgRef.current?.getBoundingClientRect()
    if (rect) {
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const deltaX = (mousePosition.x - centerX) * 0.08
      const deltaY = (mousePosition.y - centerY) * 0.08

      const maxOffset = 8
      const base = eye.baseOffset ?? { x: 0, y: 0 }
      setEyeOffset({
        x: Math.max(-maxOffset, Math.min(maxOffset, deltaX)) + base.x,
        y: Math.max(-maxOffset, Math.min(maxOffset, deltaY)) + base.y,
      })
    }
  }, [mousePosition, trackEyes, eye.baseOffset])

  const bobY = reducedBob ? [0, -3, 0] : [0, -8, 0]
  const bobScale = reducedBob ? [1, 1.02, 1] : [1, 1.08, 1]

  return (
    <motion.div
      className={`relative w-full h-full mx-auto rounded-lg ${energize ? "creature-energize" : ""} ${className}`}
      animate={
        energize
          ? {
              y: [0, -10, 0],
              scaleY: [1, 1.18, 0.94, 1.1, 1],
              scaleX: [1, 0.94, 1.06, 0.97, 1],
              opacity: [1, 1, 0.88, 1, 1],
            }
          : {
              y: bobY,
              scaleY: bobScale,
            }
      }
      transition={
        energize
          ? { duration: 1.6, ease: "easeInOut" }
          : {
              duration: reducedBob ? 4.2 : 2.8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }
      }
      style={{ transformOrigin: "top center" }}
    >
      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        width="231"
        height="289"
        viewBox="0 0 231 289"
        className="w-full h-auto block text-foreground"
      >
        <defs>
          <clipPath id={`shapeClip-${clipId}`}>
            <path d="M230.809 115.385V249.411C230.809 269.923 214.985 287.282 194.495 288.411C184.544 288.949 175.364 285.718 168.26 280C159.746 273.154 147.769 273.461 139.178 280.23C132.638 285.384 124.381 288.462 115.379 288.462C106.377 288.462 98.1451 285.384 91.6055 280.23C82.912 273.385 70.9353 273.385 62.2415 280.23C55.7532 285.334 47.598 288.411 38.7246 288.462C17.4132 288.615 0 270.667 0 249.359V115.385C0 51.6667 51.6756 0 115.404 0C179.134 0 230.809 51.6667 230.809 115.385Z" />
          </clipPath>
        </defs>

        <foreignObject width="231" height="289" clipPath={`url(#shapeClip-${clipId})`}>
          <div className="w-full h-full">
            <MeshGradient colors={colors} className="w-full h-full" speed={1} />
          </div>
        </foreignObject>

        {expression === "happy" ? (
          <>
            <motion.path
              d="M62 118 Q80 138 98 118"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              strokeLinecap="round"
              animate={{
                d: `M${62 + eyeOffset.x} ${118 + eyeOffset.y} Q${80 + eyeOffset.x} ${138 + eyeOffset.y} ${98 + eyeOffset.x} ${118 + eyeOffset.y}`,
              }}
              transition={{ type: "spring", stiffness: 160, damping: 16 }}
            />
            <motion.path
              d="M132 118 Q150 138 168 118"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              strokeLinecap="round"
              animate={{
                d: `M${132 + eyeOffset.x} ${118 + eyeOffset.y} Q${150 + eyeOffset.x} ${138 + eyeOffset.y} ${168 + eyeOffset.x} ${118 + eyeOffset.y}`,
              }}
              transition={{ type: "spring", stiffness: 160, damping: 16 }}
            />
          </>
        ) : (
          <>
            <motion.ellipse
              rx={eye.rx}
              ry={eye.ry}
              fill="currentColor"
              className={expression === "normal" || expression === "curious" ? "creature-blink" : undefined}
              animate={{
                cx: 80 + eyeOffset.x,
                cy: 120 + eyeOffset.y,
                rx: eye.rx,
                ry: eye.ry,
              }}
              transition={{ type: "spring", stiffness: 150, damping: 15 }}
            />
            <motion.ellipse
              rx={eye.rx}
              ry={eye.ry}
              fill="currentColor"
              className={expression === "normal" || expression === "curious" ? "creature-blink" : undefined}
              animate={{
                cx: 150 + eyeOffset.x,
                cy: 120 + eyeOffset.y,
                rx: eye.rx,
                ry: eye.ry,
              }}
              transition={{ type: "spring", stiffness: 150, damping: 15 }}
            />
          </>
        )}
      </svg>
    </motion.div>
  )
}
