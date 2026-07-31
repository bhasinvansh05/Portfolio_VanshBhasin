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
  className?: string
}

type Star = {
  orbital: number
  opacity: number
  position: { x: number; y: number }
  originPosition: { x: number; y: number }
  rotation: number
  realPosition: { x: number; y: number }
  rSpeed: number
  waveSpeed1: number
  waveSpeed2: number
  wave1: number
  wave2: number
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
  className,
}: StarfieldProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const starsRef = useRef<Star[]>([])
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const context = canvas.getContext("2d")
    if (!context) return

    let size = { x: 0, y: 0 }
    let imagedata: ImageData
    let data: Uint32Array
    const startTime = Date.now()
    let currentTime = 0

    const setSize = () => {
      size.x = container.clientWidth
      size.y = container.clientHeight
      canvas.width = size.x
      canvas.height = size.y

      imagedata = context.createImageData(size.x, size.y)
      data = new Uint32Array(imagedata.data.buffer)
      starsRef.current = []
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
      // Keep a clear center void, then ring out to starEscapeWidth
      const inner = Math.max(8, voidWidth)
      const outer = Math.max(inner + 24, starEscapeWidth)
      const rands = [
        Math.random() * ((outer - inner) / 2) + inner,
        Math.random() * ((outer - inner) / 2) + (inner + outer) / 2,
      ]
      star.orbital = rands.reduce((p, c) => p + c, 0) / rands.length
      star.opacity = Math.floor(
        (1 - (star.orbital - inner) / Math.max(1, outer - inner)) * maxOpacity +
          Math.random() * 80,
      )
      star.position = {
        x: size.x / 2,
        y: size.y / 2 + star.orbital,
      }
      star.originPosition = { ...star.position }
      star.rotation = Math.PI * (Math.random() * 2)
      star.position = rotate(
        size.x / 2,
        size.y / 2,
        star.position.x,
        star.position.y,
        star.rotation,
      )
      star.realPosition = { ...star.position }
      star.rSpeed = Math.random() * rotationSpeed + star.opacity / 20000
      star.waveSpeed1 = Math.random() * waveSpeed
      star.waveSpeed2 = Math.random() * waveSpeed
      star.wave1 = Math.sin(currentTime * star.waveSpeed1) * waveFrequency
      star.wave2 = Math.sin(currentTime * star.waveSpeed2) * waveFrequency
      star.id = starsRef.current.length
      starsRef.current.push(star)
    }

    const plot = (x: number, y: number, opacity: number) => {
      const index = Math.floor(y) * size.x + Math.floor(x)
      if (index < 0 || index >= data.length) return
      data[index] =
        (opacity << 24) | (starColor.b << 16) | (starColor.g << 8) | starColor.r
    }

    const drawStar = (star: Star) => {
      const prevX = star.realPosition.x + star.wave2
      const prevY = star.realPosition.y + star.wave1
      const prevIndex = Math.floor(prevY) * size.x + Math.floor(prevX)
      if (prevIndex >= 0 && prevIndex < data.length) {
        data[prevIndex] = 0
      }
      const prevIndex2 = Math.floor(prevY) * size.x + Math.floor(prevX + 1)
      if (prevIndex2 >= 0 && prevIndex2 < data.length) data[prevIndex2] = 0

      star.wave1 = Math.sin(currentTime * star.waveSpeed1) * waveFrequency
      star.wave2 = Math.sin(currentTime * star.waveSpeed2) * waveFrequency
      star.realPosition = rotate(
        size.x / 2,
        size.y / 2,
        star.position.x,
        star.position.y,
        star.rSpeed * currentTime,
      )
      const inner = Math.max(8, voidWidth)
      const outer = Math.max(inner + 24, starEscapeWidth)
      star.opacity = Math.floor(
        (1 - (star.orbital - inner) / Math.max(1, outer - inner)) * maxOpacity +
          Math.random() * 80,
      )

      const x = star.realPosition.x + star.wave2
      const y = star.realPosition.y + star.wave1
      const op = Math.min(255, Math.max(0, star.opacity))
      plot(x, y, op)
      plot(x + 1, y, Math.floor(op * 0.7))
      plot(x, y + 1, Math.floor(op * 0.55))
    }

    const render = () => {
      currentTime = (Date.now() - startTime) / 10

      data.fill(0)

      if (starsRef.current.length < starCount) {
        for (let i = 0; i < Math.min(160, starCount - starsRef.current.length); i++) {
          createStar()
        }
      }

      for (const star of starsRef.current) {
        drawStar(star)
      }

      context.putImageData(imagedata, 0, 0)
      animationFrameRef.current = requestAnimationFrame(render)
    }

    setSize()
    render()

    const resizeHandler = () => setSize()
    window.addEventListener("resize", resizeHandler)

    return () => {
      window.removeEventListener("resize", resizeHandler)
      if (animationFrameRef.current != null) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [
    starCount,
    waveFrequency,
    starEscapeWidth,
    voidWidth,
    starColor,
    maxOpacity,
    rotationSpeed,
    waveSpeed,
  ])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: "100%", height: "100%" }}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  )
}

export { Starfield }
export default Starfield
