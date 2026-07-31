"use client"

import { useEffect, useRef } from "react"

export type StarColor = { r: number; g: number; b: number }

export type StarfieldProps = {
  starCount?: number
  waveFrequency?: number
  starEscapeWidth?: number
  voidWidth?: number
  starColor?: StarColor
  maxOpacity?: number
  rotationSpeed?: number
  waveSpeed?: number
  /** Vertical origin as a fraction of canvas height (0.5 = center). Lower = higher on screen. */
  centerYRatio?: number
  /** Freeze the last frame — avoids compositor flicker under CSS blur / backdrop samples. */
  paused?: boolean
  className?: string
}

type Star = {
  orbital: number
  opacity: number
  baseOpacity: number
  position: { x: number; y: number }
  originPosition: { x: number; y: number }
  rotation: number
  realPosition: { x: number; y: number }
  rSpeed: number
  waveSpeed1: number
  waveSpeed2: number
  wave1: number
  wave2: number
  twinklePhase: number
  twinkleSpeed: number
  id: number
}

const Starfield = ({
  starCount = 25000,
  waveFrequency = 20,
  starEscapeWidth = 255,
  voidWidth = 100,
  starColor = { r: 168, g: 85, b: 247 },
  maxOpacity = 255,
  rotationSpeed = 0.0005,
  waveSpeed = 0.01,
  centerYRatio = 0.5,
  paused = false,
  className,
}: StarfieldProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const starsRef = useRef<Star[]>([])
  const animationFrameRef = useRef<number | null>(null)
  const centerYRatioRef = useRef(centerYRatio)
  const voidWidthRef = useRef(voidWidth)
  const starEscapeWidthRef = useRef(starEscapeWidth)
  const starColorRef = useRef(starColor)
  const pausedRef = useRef(paused)
  const kickRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    centerYRatioRef.current = centerYRatio
  }, [centerYRatio])

  useEffect(() => {
    voidWidthRef.current = voidWidth
  }, [voidWidth])

  useEffect(() => {
    starEscapeWidthRef.current = starEscapeWidth
  }, [starEscapeWidth])

  useEffect(() => {
    starColorRef.current = starColor
  }, [starColor])

  useEffect(() => {
    pausedRef.current = paused
    if (!paused) {
      kickRef.current?.()
    }
  }, [paused])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const context = canvas.getContext("2d", { alpha: false })
    if (!context) return

    let size = { x: 0, y: 0 }
    let imagedata: ImageData
    let data: Uint32Array
    const startTime = Date.now()
    let currentTime = 0
    let pausedAt = 0
    let pauseOffset = 0
    let lastOrigin = { x: 0, y: 0 }
    let hasOrigin = false
    let wasPaused = false

    const readOrigin = () => ({
      x: size.x / 2,
      y: size.y * centerYRatioRef.current,
    })

    const origin = () => {
      const next = readOrigin()
      if (hasOrigin) {
        const dx = next.x - lastOrigin.x
        const dy = next.y - lastOrigin.y
        if (dx !== 0 || dy !== 0) {
          for (const star of starsRef.current) {
            star.position.x += dx
            star.position.y += dy
            star.realPosition.x += dx
            star.realPosition.y += dy
            star.originPosition.x += dx
            star.originPosition.y += dy
          }
        }
      }
      lastOrigin = next
      hasOrigin = true
      return next
    }

    const setSize = () => {
      const nextX = container.clientWidth
      const nextY = container.clientHeight
      if (nextX === size.x && nextY === size.y) return

      const oldX = size.x
      const oldY = size.y
      const hadStars = starsRef.current.length > 0
      // Soft-resize for small iOS chrome changes; hard rebuild only on big layout shifts
      const significant =
        !hadStars ||
        !oldX ||
        !oldY ||
        Math.abs(nextX - oldX) > 48 ||
        Math.abs(nextY - oldY) / Math.max(oldY, 1) > 0.12

      if (hadStars && !significant) {
        lastOrigin = { x: oldX / 2, y: oldY * centerYRatioRef.current }
        hasOrigin = true
      }

      size.x = nextX
      size.y = nextY
      canvas.width = nextX
      canvas.height = nextY

      imagedata = context.createImageData(size.x, size.y)
      data = new Uint32Array(imagedata.data.buffer)

      if (significant) {
        starsRef.current = []
        hasOrigin = false
      }
    }

    const rotate = (cx: number, cy: number, x: number, y: number, radians: number) => {
      const cos = Math.cos(radians)
      const sin = Math.sin(radians)
      const nx = cos * (x - cx) + sin * (y - cy) + cx
      const ny = cos * (y - cy) - sin * (x - cx) + cy
      return { x: nx, y: ny }
    }

    const createStar = () => {
      const star = {} as Star
      const { x: cx, y: cy } = origin()
      const inner = Math.max(8, voidWidthRef.current)
      const outer = Math.max(inner + 24, starEscapeWidthRef.current)
      const rands = [
        Math.random() * ((outer - inner) / 2) + inner,
        Math.random() * ((outer - inner) / 2) + (inner + outer) / 2,
      ]
      star.orbital = rands.reduce((p, c) => p + c, 0) / rands.length
      star.baseOpacity = Math.floor(
        (1 - (star.orbital - inner) / Math.max(1, outer - inner)) * maxOpacity,
      )
      star.opacity = star.baseOpacity
      star.position = {
        x: cx,
        y: cy + star.orbital,
      }
      star.originPosition = { ...star.position }
      star.rotation = Math.PI * (Math.random() * 2)
      star.position = rotate(
        cx,
        cy,
        star.position.x,
        star.position.y,
        star.rotation,
      )
      star.realPosition = { ...star.position }
      star.rSpeed = Math.random() * rotationSpeed + star.baseOpacity / 20000
      star.waveSpeed1 = Math.random() * waveSpeed
      star.waveSpeed2 = Math.random() * waveSpeed
      star.wave1 = Math.sin(currentTime * star.waveSpeed1) * waveFrequency
      star.wave2 = Math.sin(currentTime * star.waveSpeed2) * waveFrequency
      star.twinklePhase = Math.random() * Math.PI * 2
      star.twinkleSpeed = 0.015 + Math.random() * 0.025
      star.id = starsRef.current.length
      starsRef.current.push(star)
    }

    const plot = (x: number, y: number, opacity: number) => {
      const index = Math.floor(y) * size.x + Math.floor(x)
      if (index < 0 || index >= data.length) return
      const c = starColorRef.current
      const a = opacity / 255
      // Premultiply onto opaque black buffer so twinkle works with alpha:false
      const r = Math.floor(c.r * a)
      const g = Math.floor(c.g * a)
      const b = Math.floor(c.b * a)
      data[index] = (255 << 24) | (b << 16) | (g << 8) | r
    }

    const drawStar = (star: Star, cx: number, cy: number) => {
      star.wave1 = Math.sin(currentTime * star.waveSpeed1) * waveFrequency
      star.wave2 = Math.sin(currentTime * star.waveSpeed2) * waveFrequency
      star.realPosition = rotate(
        cx,
        cy,
        star.position.x,
        star.position.y,
        star.rSpeed * currentTime,
      )

      // Smooth twinkle — no Math.random per frame (that caused visible flicker)
      const twinkle =
        0.72 + 0.28 * Math.sin(currentTime * star.twinkleSpeed + star.twinklePhase)
      const op = Math.min(255, Math.max(0, Math.floor(star.baseOpacity * twinkle)))
      star.opacity = op

      const x = star.realPosition.x + star.wave2
      const y = star.realPosition.y + star.wave1
      plot(x, y, op)
      plot(x + 1, y, Math.floor(op * 0.7))
      plot(x, y + 1, Math.floor(op * 0.55))
    }

    const render = () => {
      animationFrameRef.current = null

      if (pausedRef.current) {
        if (!wasPaused) {
          pausedAt = Date.now()
          wasPaused = true
        }
        // Hold the last painted frame — no putImageData while CSS blur / section
        // backdrop-blur is sampling this layer (that was the flicker).
        return
      }

      if (wasPaused) {
        pauseOffset += Date.now() - pausedAt
        wasPaused = false
      }

      currentTime = (Date.now() - startTime - pauseOffset) / 10

      // Fill black once (alpha:false context) — cheaper and avoids clear flicker
      data.fill(0xff000000)

      const { x: cx, y: cy } = origin()

      if (starsRef.current.length < starCount) {
        for (let i = 0; i < Math.min(160, starCount - starsRef.current.length); i++) {
          createStar()
        }
      }

      for (const star of starsRef.current) {
        drawStar(star, cx, cy)
      }

      context.putImageData(imagedata, 0, 0)
      animationFrameRef.current = requestAnimationFrame(render)
    }

    const kick = () => {
      if (animationFrameRef.current == null && !pausedRef.current) {
        animationFrameRef.current = requestAnimationFrame(render)
      }
    }
    kickRef.current = kick

    setSize()
    render()

    let resizeRaf = 0
    const resizeHandler = () => {
      if (resizeRaf) return
      resizeRaf = requestAnimationFrame(() => {
        resizeRaf = 0
        const stayPaused = pausedRef.current
        setSize()
        if (stayPaused) {
          // Canvas resize clears pixels — paint one frozen frame, then stay paused.
          pausedRef.current = false
          render()
          pausedRef.current = true
          wasPaused = true
          pausedAt = Date.now()
        } else {
          kick()
        }
      })
    }
    window.addEventListener("resize", resizeHandler)
    window.visualViewport?.addEventListener("resize", resizeHandler)

    return () => {
      kickRef.current = null
      window.removeEventListener("resize", resizeHandler)
      window.visualViewport?.removeEventListener("resize", resizeHandler)
      if (resizeRaf) cancelAnimationFrame(resizeRaf)
      if (animationFrameRef.current != null) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [starCount, waveFrequency, maxOpacity, rotationSpeed, waveSpeed])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: "100%", height: "100%", transform: "translateZ(0)" }}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  )
}

export { Starfield }
export default Starfield
