"use client"

import { useEffect, useRef, useState } from "react"
import {
  MeshGradientSVG,
  type CreatureExpression,
} from "@/components/ui/shader-svg"

type WanderMood =
  | "roam"
  | "zap"
  | "notice"
  | "stare"
  | "dive"
  | "cross"
  | "emerge"
  | "leave"

type Point = { x: number; y: number }
type Rect = { left: number; top: number; right: number; bottom: number; key: string }
type Vec = { x: number; y: number }

const CREATURE_W = 52
const CREATURE_H = 66
const SAFE_PAD = 10
const NOTICE_DIST = 160
const STARE_MS = 1600
const POINTER_NEAR = 130
const CROSS_EXIT_PAD = 36

const PLAY_SELECTOR = [
  "h1",
  "h2",
  "h3",
  "h4",
  "p",
  "button",
  "a",
  "label",
  "input",
  "textarea",
  "nav",
  "[role='button']",
  "[role='link']",
  "[role='slider']",
  "[data-creature-obstacle]",
].join(",")

/** Hard walls that truly block roaming — keep text soft so it can cross the page. */
const SOLID_SELECTOR = [
  "button",
  "a",
  "label",
  "input",
  "textarea",
  "nav",
  "[role='button']",
  "[role='link']",
  "[role='slider']",
  "[data-creature-obstacle]",
].join(",")

const STARE_EXPRS: CreatureExpression[] = ["curious", "happy", "glance", "happy", "curious"]
const IDLE_EXPRS: CreatureExpression[] = ["normal", "happy", "curious", "glance", "happy"]
const EDGE_STUCK_MS = 4200
const EDGE_BAND = 72

function rand(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function len(v: Vec) {
  return Math.hypot(v.x, v.y)
}

function norm(v: Vec): Vec {
  const l = len(v) || 1
  return { x: v.x / l, y: v.y / l }
}

function clampToViewport(p: Point): Point {
  const pad = 10
  const maxX = Math.max(pad, window.innerWidth - CREATURE_W - pad)
  const maxY = Math.max(pad, window.innerHeight - CREATURE_H - pad)
  return {
    x: Math.min(maxX, Math.max(pad, p.x)),
    y: Math.min(maxY, Math.max(pad, p.y)),
  }
}

function creatureBox(p: Point): Rect {
  return {
    left: p.x,
    top: p.y,
    right: p.x + CREATURE_W,
    bottom: p.y + CREATURE_H,
    key: "creature",
  }
}

function centerOf(p: Point): Point {
  return { x: p.x + CREATURE_W / 2, y: p.y + CREATURE_H / 2 }
}

function rectCenter(r: Rect): Point {
  return { x: (r.left + r.right) / 2, y: (r.top + r.bottom) / 2 }
}

function obsKey(r: Omit<Rect, "key">) {
  return `${Math.round(r.left / 6)}_${Math.round(r.top / 6)}_${Math.round(r.right / 6)}_${Math.round(r.bottom / 6)}`
}

function inflate(r: Rect, pad: number): Rect {
  const next = {
    left: r.left - pad,
    top: r.top - pad,
    right: r.right + pad,
    bottom: r.bottom + pad,
  }
  return { ...next, key: r.key || obsKey(next) }
}

function overlaps(a: Rect, b: Rect) {
  return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom)
}

function separation(box: Rect, obs: Rect): number {
  const dx = Math.max(0, Math.max(obs.left - box.right, box.left - obs.right))
  const dy = Math.max(0, Math.max(obs.top - box.bottom, box.top - obs.bottom))
  if (dx === 0 && dy === 0) return 0
  return Math.hypot(dx, dy)
}

function collectRects(
  selector: string,
  limit = 70,
): { rects: Rect[]; elByKey: Map<string, HTMLElement> } {
  const nodes = document.querySelectorAll<HTMLElement>(selector)
  const rects: Rect[] = []
  const elByKey = new Map<string, HTMLElement>()
  const vw = window.innerWidth
  const vh = window.innerHeight

  for (let i = 0; i < nodes.length; i++) {
    const el = nodes[i]
    if (el.closest("[data-wandering-creature]")) continue
    if (el.closest("[data-creature-static]")) continue
    const style = window.getComputedStyle(el)
    if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") continue

    const r = el.getBoundingClientRect()
    if (r.width < 14 || r.height < 12) continue
    if (r.bottom < -20 || r.top > vh + 20 || r.right < -20 || r.left > vw + 20) continue
    if (r.width > vw * 0.92 && r.height > vh * 0.55) continue

    const rect = {
      left: r.left,
      top: r.top,
      right: r.right,
      bottom: r.bottom,
      key: obsKey(r),
    }
    rects.push(rect)
    elByKey.set(rect.key, el)
    if (rects.length >= limit) break
  }
  return { rects, elByKey }
}

function collectPlaythings() {
  return collectRects(PLAY_SELECTOR, 70)
}

function collectSolids() {
  return collectRects(SOLID_SELECTOR, 40)
}

function nearestEdge(
  from: Point,
  obs: Rect,
): "left" | "right" | "top" | "bottom" {
  const c = centerOf(from)
  const cx = Math.min(obs.right, Math.max(obs.left, c.x))
  const cy = Math.min(obs.bottom, Math.max(obs.top, c.y))
  const toL = Math.abs(cx - obs.left)
  const toR = Math.abs(obs.right - cx)
  const toT = Math.abs(cy - obs.top)
  const toB = Math.abs(obs.bottom - cy)
  const m = Math.min(toL, toR, toT, toB)
  if (m === toL) return "left"
  if (m === toR) return "right"
  if (m === toT) return "top"
  return "bottom"
}

function oppositeEdge(
  edge: "left" | "right" | "top" | "bottom",
): "left" | "right" | "top" | "bottom" {
  if (edge === "left") return "right"
  if (edge === "right") return "left"
  if (edge === "top") return "bottom"
  return "top"
}

/** Slip just under the near edge so the creature is occluded / ready to vanish. */
function hidePointBehind(from: Point, obs: Rect): Point {
  const edge = nearestEdge(from, obs)
  const c = centerOf(from)
  const inset = 10
  let x = c.x
  let y = c.y
  if (edge === "left") {
    x = obs.left + inset
    y = Math.min(obs.bottom - 8, Math.max(obs.top + 8, c.y))
  } else if (edge === "right") {
    x = obs.right - inset
    y = Math.min(obs.bottom - 8, Math.max(obs.top + 8, c.y))
  } else if (edge === "top") {
    y = obs.top + inset
    x = Math.min(obs.right - 8, Math.max(obs.left + 8, c.x))
  } else {
    y = obs.bottom - inset
    x = Math.min(obs.right - 8, Math.max(obs.left + 8, c.x))
  }
  return clampToViewport({ x: x - CREATURE_W / 2, y: y - CREATURE_H / 2 })
}

/** Pop out from the far side — behind the element, not through its face. */
function emergePointBehind(from: Point, obs: Rect): Point {
  const entry = nearestEdge(from, obs)
  const exit = oppositeEdge(entry)
  const c = centerOf(from)
  const out = CROSS_EXIT_PAD + rand(8, 22)
  let x = c.x
  let y = c.y

  if (exit === "left" || exit === "right") {
    y = Math.min(obs.bottom - 6, Math.max(obs.top + 6, c.y + rand(-18, 18)))
    x = exit === "left" ? obs.left - out : obs.right + out
  } else {
    x = Math.min(obs.right - 6, Math.max(obs.left + 6, c.x + rand(-18, 18)))
    y = exit === "top" ? obs.top - out : obs.bottom + out
  }

  return clampToViewport({ x: x - CREATURE_W / 2, y: y - CREATURE_H / 2 })
}

function perimeterAnchor(from: Point, obs: Rect, margin = SAFE_PAD): Point {
  const zone = inflate(obs, margin)
  const c = centerOf(from)
  const cx = Math.min(zone.right, Math.max(zone.left, c.x))
  const cy = Math.min(zone.bottom, Math.max(zone.top, c.y))

  const toL = Math.abs(cx - zone.left)
  const toR = Math.abs(zone.right - cx)
  const toT = Math.abs(cy - zone.top)
  const toB = Math.abs(zone.bottom - cy)
  const m = Math.min(toL, toR, toT, toB)

  let edge: Point
  if (m === toL) edge = { x: zone.left, y: cy }
  else if (m === toR) edge = { x: zone.right, y: cy }
  else if (m === toT) edge = { x: cx, y: zone.top }
  else edge = { x: cx, y: zone.bottom }

  return clampToViewport({
    x: edge.x - CREATURE_W / 2,
    y: edge.y - CREATURE_H / 2,
  })
}

function edgeSide(p: Point): "left" | "right" | "center" {
  const cx = p.x + CREATURE_W / 2
  if (cx < EDGE_BAND + CREATURE_W * 0.5) return "left"
  if (cx > window.innerWidth - EDGE_BAND - CREATURE_W * 0.5) return "right"
  return "center"
}

function halfSide(p: Point): "left" | "right" {
  return p.x + CREATURE_W / 2 < window.innerWidth / 2 ? "left" : "right"
}

function pickWanderTarget(
  from: Point,
  solids: Rect[],
  preferOpposite = true,
): Point {
  const pad = 10
  const maxX = Math.max(pad, window.innerWidth - CREATURE_W - pad)
  const maxY = Math.max(pad, window.innerHeight - CREATURE_H - pad)
  const fromHalf = halfSide(from)
  const wantRight = preferOpposite ? fromHalf === "left" : Math.random() < 0.5

  let best = clampToViewport({
    x: wantRight ? rand(maxX * 0.55, maxX) : rand(pad, maxX * 0.45),
    y: rand(pad, maxY),
  })
  let bestScore = -Infinity

  for (let i = 0; i < 28; i++) {
    // Bias samples toward the opposite half so it doesn't camp one gutter
    const next =
      i < 18
        ? {
            x: wantRight ? rand(maxX * 0.52, maxX) : rand(pad, maxX * 0.48),
            y: rand(pad, maxY),
          }
        : { x: rand(pad, maxX), y: rand(pad, maxY) }

    const box = creatureBox(next)
    let blocked = false
    let clear = 0
    for (const obs of solids) {
      const zone = inflate(obs, SAFE_PAD)
      if (overlaps(box, zone)) {
        blocked = true
        break
      }
      clear += separation(box, obs)
    }
    if (blocked) continue
    const dist = Math.hypot(next.x - from.x, next.y - from.y)
    if (dist < 90) continue
    const sideBonus =
      (wantRight && next.x > maxX * 0.5) || (!wantRight && next.x < maxX * 0.5) ? 80 : 0
    const score = dist * 0.45 + clear * 0.02 + sideBonus + rand(0, 30)
    if (score > bestScore) {
      bestScore = score
      best = next
    }
  }
  return best
}

/** Prefer a playful UI “toy” within reach, else null. */
function pickPlayObstacle(from: Point, obstacles: Rect[], avoidKey: string | null): Rect | null {
  const candidates = obstacles.filter((o) => o.key !== avoidKey)
  if (!candidates.length) return null

  let best: Rect | null = null
  let bestScore = -Infinity
  const c = centerOf(from)
  const preferRight = halfSide(from) === "left"
  for (const obs of candidates) {
    const rc = rectCenter(obs)
    const dist = Math.hypot(rc.x - c.x, rc.y - c.y)
    if (dist < 40 || dist > Math.max(window.innerWidth, window.innerHeight) * 0.85) continue
    const area = (obs.right - obs.left) * (obs.bottom - obs.top)
    const sizeBonus = area > 800 && area < 180_000 ? 40 : 0
    const crossBonus =
      (preferRight && rc.x > window.innerWidth * 0.5) ||
      (!preferRight && rc.x < window.innerWidth * 0.5)
        ? 35
        : 0
    const score = sizeBonus + crossBonus - dist * 0.12 + rand(0, 50)
    if (score > bestScore) {
      bestScore = score
      best = obs
    }
  }
  return best
}

function findNearestInteresting(from: Point, obstacles: Rect[]): { obs: Rect; dist: number } | null {
  const box = creatureBox(from)
  let best: { obs: Rect; dist: number } | null = null
  for (const obs of obstacles) {
    const d = separation(box, inflate(obs, 0))
    if (d < NOTICE_DIST && (best === null || d < best.dist)) {
      best = { obs, dist: d }
    }
  }
  return best
}

function resolveCollisions(p: Point, obstacles: Rect[], ignoreKey: string | null): Point {
  let x = p.x
  let y = p.y
  for (let pass = 0; pass < 3; pass++) {
    const box = creatureBox({ x, y })
    for (const obs of obstacles) {
      if (ignoreKey && obs.key === ignoreKey) continue
      const zone = inflate(obs, SAFE_PAD)
      if (!overlaps(box, zone)) continue
      const c = centerOf({ x, y })
      const rc = rectCenter(zone)
      const push = norm({ x: c.x - rc.x || 0.01, y: c.y - rc.y || 0.01 })
      x += push.x * 6
      y += push.y * 6
    }
  }
  return clampToViewport({ x, y })
}

function faceToward(from: Point, target: Point) {
  const a = Math.atan2(target.y - from.y, target.x - from.x) * (180 / Math.PI)
  return Math.max(-16, Math.min(16, a * 0.18))
}

function isCrossing(mood: WanderMood) {
  return mood === "dive" || mood === "cross"
}

function pulseElement(el: HTMLElement | undefined) {
  if (!el) return
  el.classList.remove("creature-play-pulse")
  // Force reflow so the animation can retrigger
  void el.offsetWidth
  el.classList.add("creature-play-pulse")
  window.setTimeout(() => el.classList.remove("creature-play-pulse"), 900)
}

/**
 * Playful house-creature: zaps toward UI, stares with expressions,
 * pulses elements, then waterfall-dives through them.
 */
export default function WanderingCreature() {
  const [pos, setPos] = useState<Point>({ x: 80, y: 100 })
  const [rotate, setRotate] = useState(0)
  const [expression, setExpression] = useState<CreatureExpression>("happy")
  const [ready, setReady] = useState(false)
  const [behindUi, setBehindUi] = useState(false)
  const [crossOpacity, setCrossOpacity] = useState(1)
  const [fadeOpacity, setFadeOpacity] = useState(true)

  const posRef = useRef(pos)
  const velRef = useRef<Vec>({ x: 0, y: 0 })
  const moodRef = useRef<WanderMood>("roam")
  const targetRef = useRef<Point>({ x: 80, y: 100 })
  const stareUntilRef = useRef(0)
  const stareExprIdxRef = useRef(0)
  const nextStareExprAtRef = useRef(0)
  const focusObsRef = useRef<Rect | null>(null)
  const lastInteractedKeyRef = useRef<string | null>(null)
  const elByKeyRef = useRef<Map<string, HTMLElement>>(new Map())
  const expressionLockRef = useRef<{ expr: CreatureExpression; until: number } | null>(null)
  const nextSeekAtRef = useRef(0)
  const edgeSinceRef = useRef<{ side: "left" | "right" | "center"; since: number }>({
    side: "center",
    since: 0,
  })

  posRef.current = pos

  const lockExpression = (expr: CreatureExpression, ms: number) => {
    expressionLockRef.current = { expr, until: performance.now() + ms }
    setExpression(expr)
  }

  const setBehind = (value: boolean, hidden = false) => {
    setBehindUi(value)
    if (hidden) {
      // Snap invisible before relocating so it never flashes across the element
      setFadeOpacity(false)
      setCrossOpacity(0)
    } else {
      setFadeOpacity(true)
      setCrossOpacity(value ? 0.5 : 1)
    }
  }

  useEffect(() => {
    const start = clampToViewport({
      x: window.innerWidth * 0.58,
      y: window.innerHeight * 0.32,
    })
    posRef.current = start
    targetRef.current = start
    setPos(start)
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return

    let cancelled = false
    let raf = 0
    let emergeAt = 0

    const beginRoamTarget = (solids: Rect[], forceOpposite = false) => {
      targetRef.current = pickWanderTarget(posRef.current, solids, true)
      if (forceOpposite) {
        // Hard nudge across the screen if it's been camping an edge
        const pad = 10
        const maxX = Math.max(pad, window.innerWidth - CREATURE_W - pad)
        const maxY = Math.max(pad, window.innerHeight - CREATURE_H - pad)
        const side = halfSide(posRef.current)
        targetRef.current = clampToViewport({
          x: side === "right" ? rand(pad, maxX * 0.35) : rand(maxX * 0.65, maxX),
          y: rand(pad * 2, maxY * 0.85),
        })
      }
      moodRef.current = "roam"
      focusObsRef.current = null
      setBehind(false)
      nextSeekAtRef.current = performance.now() + rand(900, 2200)
    }

    /** Dash playfully at a UI toy. */
    const startZap = (obs: Rect) => {
      moodRef.current = "zap"
      focusObsRef.current = obs
      targetRef.current = perimeterAnchor(posRef.current, obs, SAFE_PAD + 12)
      lockExpression("happy", 900)
      const toward = norm({
        x: targetRef.current.x - posRef.current.x,
        y: targetRef.current.y - posRef.current.y,
      })
      velRef.current = { x: toward.x * 140, y: toward.y * 140 }
      setRotate(faceToward(centerOf(posRef.current), rectCenter(obs)))
      pulseElement(elByKeyRef.current.get(obs.key))
    }

    const startStare = (obs: Rect) => {
      moodRef.current = "stare"
      focusObsRef.current = obs
      lastInteractedKeyRef.current = obs.key
      stareUntilRef.current = performance.now() + STARE_MS + rand(200, 700)
      stareExprIdxRef.current = 0
      nextStareExprAtRef.current = performance.now() + 350
      velRef.current = { x: velRef.current.x * 0.15, y: velRef.current.y * 0.15 }
      targetRef.current = perimeterAnchor(posRef.current, obs, SAFE_PAD + 4)
      lockExpression("happy", 500)
      setRotate(faceToward(centerOf(posRef.current), rectCenter(obs)))
      pulseElement(elByKeyRef.current.get(obs.key))
    }

    /** Slip behind the near edge (go under), then reappear from the far side. */
    const startDive = (obs: Rect) => {
      moodRef.current = "dive"
      focusObsRef.current = obs
      lastInteractedKeyRef.current = obs.key
      setBehind(true, false)
      targetRef.current = hidePointBehind(posRef.current, obs)
      lockExpression("curious", 1000)
      setRotate(faceToward(centerOf(posRef.current), rectCenter(obs)))
      pulseElement(elByKeyRef.current.get(obs.key))
    }

    const startCross = (obs: Rect) => {
      moodRef.current = "cross"
      focusObsRef.current = obs
      // Vanish while behind, then warp to the far side — never slide across the face
      setBehind(true, true)
      const emerge = emergePointBehind(posRef.current, obs)
      posRef.current = emerge
      targetRef.current = emerge
      velRef.current = { x: 0, y: 0 }
      setPos(emerge)
      emergeAt = performance.now() + rand(280, 520)
      lockExpression("glance", 800)
    }

    const startEmerge = (solids: Rect[]) => {
      moodRef.current = "emerge"
      setBehind(false)
      lockExpression("happy", 1100)
      beginRoamTarget(solids, true)
      moodRef.current = "leave"
      window.setTimeout(() => {
        if (!cancelled) lastInteractedKeyRef.current = null
      }, 1800)
    }

    velRef.current = { x: rand(-20, 20), y: rand(-12, 12) }
    const initialPlay = collectPlaythings()
    const initialSolids = collectSolids()
    elByKeyRef.current = initialPlay.elByKey
    beginRoamTarget(initialSolids.rects)
    nextSeekAtRef.current = performance.now() + 400
    edgeSinceRef.current = { side: edgeSide(posRef.current), since: performance.now() }

    let last = performance.now()
    let exprTick = 0

    const frame = (now: number) => {
      if (cancelled) return
      const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000))
      last = now

      const lock = expressionLockRef.current
      if (lock && now >= lock.until) expressionLockRef.current = null

      const { rects: playthings, elByKey } = collectPlaythings()
      const { rects: solids } = collectSolids()
      elByKeyRef.current = elByKey

      if (focusObsRef.current) {
        const live = playthings.find((o) => o.key === focusObsRef.current!.key)
        if (live) focusObsRef.current = live
      }

      let p = posRef.current
      let v = velRef.current
      const mood = moodRef.current
      const focusKey = focusObsRef.current?.key ?? null
      const crossing = isCrossing(mood)

      // Break out of edge camping
      const side = edgeSide(p)
      if (side !== edgeSinceRef.current.side) {
        edgeSinceRef.current = { side, since: now }
      } else if (
        (side === "left" || side === "right") &&
        now - edgeSinceRef.current.since > EDGE_STUCK_MS &&
        (mood === "roam" || mood === "leave")
      ) {
        beginRoamTarget(solids, true)
        edgeSinceRef.current = { side: "center", since: now }
        lockExpression("curious", 600)
      }

      // Actively seek playmates while roaming
      if ((mood === "roam" || mood === "leave") && now >= nextSeekAtRef.current) {
        nextSeekAtRef.current = now + rand(1400, 3200)
        if (Math.random() < 0.72) {
          const toy = pickPlayObstacle(p, playthings, lastInteractedKeyRef.current)
          if (toy) startZap(toy)
        }
      }

      if (mood === "roam" || mood === "leave") {
        const near = findNearestInteresting(p, playthings)
        if (near && near.obs.key !== lastInteractedKeyRef.current && moodRef.current !== "zap") {
          startZap(near.obs)
        } else if (mood === "leave" && (!near || near.dist > NOTICE_DIST * 1.2)) {
          if (moodRef.current === "leave") beginRoamTarget(solids)
        }
      }

      // Zap arrives → stare
      if (moodRef.current === "zap" && focusObsRef.current) {
        const t = targetRef.current
        const d = separation(creatureBox(p), focusObsRef.current)
        if (Math.hypot(t.x - p.x, t.y - p.y) < 22 || d < SAFE_PAD + 24) {
          startStare(focusObsRef.current)
        }
      }

      if (moodRef.current === "notice" && focusObsRef.current) {
        const d = separation(creatureBox(p), focusObsRef.current)
        if (d < SAFE_PAD + 28) startStare(focusObsRef.current)
      }

      if (moodRef.current === "stare" && focusObsRef.current) {
        setRotate(faceToward(centerOf(p), rectCenter(focusObsRef.current)))
        if (now >= nextStareExprAtRef.current) {
          stareExprIdxRef.current = (stareExprIdxRef.current + 1) % STARE_EXPRS.length
          lockExpression(STARE_EXPRS[stareExprIdxRef.current], 420)
          nextStareExprAtRef.current = now + rand(320, 520)
          if (stareExprIdxRef.current % 2 === 0) {
            pulseElement(elByKeyRef.current.get(focusObsRef.current.key))
          }
        }
        targetRef.current = perimeterAnchor(p, focusObsRef.current, SAFE_PAD + 2 + Math.sin(now / 180) * 3)
        if (now >= stareUntilRef.current) startDive(focusObsRef.current)
      }

      if (moodRef.current === "dive" && focusObsRef.current) {
        const t = targetRef.current
        const arrived = Math.hypot(t.x - p.x, t.y - p.y) < 16
        const under =
          overlaps(creatureBox(p), focusObsRef.current) ||
          separation(creatureBox(p), focusObsRef.current) < 6
        // Slip under the near edge, then reappear from the far side
        if (under || arrived) startCross(focusObsRef.current)
      }

      if (moodRef.current === "cross") {
        // Hold invisible behind the element, then pop out from the far side
        if (now >= emergeAt) startEmerge(solids)
        velRef.current = { x: 0, y: 0 }
        raf = requestAnimationFrame(frame)
        return
      }

      if (moodRef.current === "roam") {
        const t = targetRef.current
        if (Math.hypot(t.x - p.x, t.y - p.y) < 24) beginRoamTarget(solids)
      }

      const maxSpeed =
        moodRef.current === "stare"
          ? 22
          : moodRef.current === "zap"
            ? 160
            : moodRef.current === "notice"
              ? 90
              : moodRef.current === "dive"
                ? 70
                : moodRef.current === "leave"
                    ? 105
                    : 98

      const accel =
        moodRef.current === "zap"
          ? 220
          : moodRef.current === "notice" || moodRef.current === "dive"
            ? 110
            : 145

      const desired = {
        x: targetRef.current.x - p.x,
        y: targetRef.current.y - p.y,
      }
      const desiredN = norm(desired)
      const steer = {
        x: desiredN.x * maxSpeed - v.x,
        y: desiredN.y * maxSpeed - v.y,
      }

      let repulse = { x: 0, y: 0 }
      const box = creatureBox(p)
      const ignoreFocus =
        crossing || moodRef.current === "zap" || moodRef.current === "stare" || moodRef.current === "notice"
      for (const obs of solids) {
        if (ignoreFocus && focusKey && obs.key === focusKey) continue
        const zone = inflate(obs, SAFE_PAD)
        const d = separation(box, zone)
        if (d < 40) {
          const push = norm({
            x: centerOf(p).x - rectCenter(zone).x || 0.01,
            y: centerOf(p).y - rectCenter(zone).y || 0.01,
          })
          const strength = (40 - d) / 40
          repulse.x += push.x * strength * 90
          repulse.y += push.y * strength * 90
        }
      }

      const wobble =
        moodRef.current === "zap"
          ? { x: Math.sin(now / 90) * 12, y: Math.cos(now / 100) * 10 }
          : moodRef.current === "roam" || moodRef.current === "leave"
            ? { x: Math.sin(now / 420) * 8, y: Math.cos(now / 530) * 6 }
            : moodRef.current === "cross" || moodRef.current === "dive"
              ? { x: Math.sin(now / 280) * 5, y: Math.cos(now / 310) * 4 }
              : { x: Math.sin(now / 700) * 3, y: Math.cos(now / 640) * 2 }

      v = {
        x: v.x + (steer.x + repulse.x + wobble.x) * (accel / Math.max(maxSpeed, 1)) * dt,
        y: v.y + (steer.y + repulse.y + wobble.y) * (accel / Math.max(maxSpeed, 1)) * dt,
      }

      const damp = moodRef.current === "stare" ? 0.82 : moodRef.current === "zap" ? 0.9 : 0.94
      v = { x: v.x * damp, y: v.y * damp }

      const speed = len(v)
      if (speed > maxSpeed) {
        v = { x: (v.x / speed) * maxSpeed, y: (v.y / speed) * maxSpeed }
      }

      p = { x: p.x + v.x * dt, y: p.y + v.y * dt }
      p = resolveCollisions(p, solids, ignoreFocus ? focusKey : null)
      p = clampToViewport(p)

      velRef.current = v
      posRef.current = p
      setPos(p)

      if (
        moodRef.current === "roam" ||
        moodRef.current === "leave" ||
        moodRef.current === "zap" ||
        moodRef.current === "dive" ||
        moodRef.current === "cross"
      ) {
        setRotate(faceToward(p, { x: p.x + v.x, y: p.y + v.y }))
      }

      exprTick += dt
      if (exprTick > 2.6 && !expressionLockRef.current && !crossing && moodRef.current === "roam") {
        exprTick = 0
        setExpression(IDLE_EXPRS[Math.floor(rand(0, IDLE_EXPRS.length))])
      }

      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    const onResize = () => {
      posRef.current = clampToViewport(posRef.current)
      setPos(posRef.current)
    }

    const onScroll = () => {
      if (isCrossing(moodRef.current) || moodRef.current === "zap") return
      const { rects } = collectPlaythings()
      const near = findNearestInteresting(posRef.current, rects)
      if (near && near.obs.key !== lastInteractedKeyRef.current) {
        lockExpression("curious", 500)
        if (moodRef.current === "roam" || moodRef.current === "leave") startZap(near.obs)
      }
    }

    const onPointerMove = (e: PointerEvent) => {
      if (moodRef.current === "stare" || isCrossing(moodRef.current) || moodRef.current === "zap") return
      const c = centerOf(posRef.current)
      const dist = Math.hypot(e.clientX - c.x, e.clientY - c.y)
      if (dist < POINTER_NEAR) lockExpression("happy", 400)
    }

    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Element | null
      if (target?.closest?.("[data-wandering-creature]")) return
      if (moodRef.current === "stare" || isCrossing(moodRef.current) || moodRef.current === "zap") return

      const clicked = (target as HTMLElement | null)?.closest?.(PLAY_SELECTOR) as HTMLElement | null
      if (clicked && !clicked.closest("[data-creature-static]")) {
        const r = clicked.getBoundingClientRect()
        const obs: Rect = {
          left: r.left,
          top: r.top,
          right: r.right,
          bottom: r.bottom,
          key: obsKey(r),
        }
        lockExpression("happy", 700)
        startZap(obs)
        return
      }

      lockExpression("startled", 500)
      const c = centerOf(posRef.current)
      const click = { x: e.clientX, y: e.clientY }
      if (Math.hypot(c.x - click.x, c.y - click.y) < 200) {
        const away = norm({ x: c.x - click.x, y: c.y - click.y })
        targetRef.current = clampToViewport({
          x: posRef.current.x + away.x * rand(70, 120),
          y: posRef.current.y + away.y * rand(70, 120),
        })
        moodRef.current = "leave"
        velRef.current = { x: away.x * 58, y: away.y * 58 }
      }
    }

    window.addEventListener("resize", onResize)
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("pointermove", onPointerMove, { passive: true })
    window.addEventListener("click", onDocClick, true)

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", onResize)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("click", onDocClick, true)
    }
  }, [ready])

  return (
    <div
      data-wandering-creature=""
      aria-hidden="true"
      className={`pointer-events-none fixed ${behindUi ? "z-[1]" : "z-40"}`}
      style={{
        left: pos.x,
        top: pos.y,
        width: CREATURE_W,
        height: CREATURE_H,
        transform: `rotate(${rotate}deg)`,
        transformOrigin: "center bottom",
        opacity: crossOpacity,
        transition: fadeOpacity
          ? "transform 0.35s ease-out, opacity 0.4s ease, z-index 0s"
          : "transform 0.35s ease-out, z-index 0s",
        willChange: "left, top, transform, opacity",
      }}
    >
      <MeshGradientSVG
        expression={expression}
        className="!m-0 !max-w-none !w-full !p-0"
      />
    </div>
  )
}
