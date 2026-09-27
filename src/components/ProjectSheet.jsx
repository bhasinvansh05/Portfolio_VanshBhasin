import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { ArrowUpRight, Play, X } from 'lucide-react';
import {
  DRAG_THRESHOLD,
  projectMomentum,
  rubberband,
  velocityFrom,
} from '../lib/gesture';
import { FADE, SPRING } from '../lib/motion';

/** Fraction of sheet height the projected release point must pass to dismiss. */
const DISMISS_FRACTION = 0.38;

/** Desktop dialog geometry, needed to anchor transform-origin to the trigger. */
const DIALOG_MAX_WIDTH = 512;
const DIALOG_GUTTER = 48;

export default function ProjectSheet({ project, originRect, titleId, onClosed }) {
  const reduceMotion = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(min-width: 640px)').matches,
  );
  const [state, setState] = useState('closed');
  const [dragging, setDragging] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);

  const y = useMotionValue(0);
  const dragScale = useTransform(y, [0, 420], [1, 0.96]);
  const sheetRef = useRef(null);
  const scrollRef = useRef(null);
  const closeRef = useRef(null);
  const dragRef = useRef(null);
  const runningRef = useRef(null);
  const closingRef = useRef(false);
  const didDragRef = useRef(false);

  /* Drag belongs to the bottom-sheet layout, where the shape promises it.
     The desktop dialog is a pointer-precision surface and keeps click/Escape. */
  const canDrag = !isDesktop;
  const animatesY = canDrag && !reduceMotion;
  const demoUrl = project.demoUrl || project.href;

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 640px)');
    const onChange = (event) => setIsDesktop(event.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const sheetHeight = () =>
    sheetRef.current?.offsetHeight || window.innerHeight;

  /* Enter along the axis the sheet will leave on, so the paths stay symmetric. */
  useLayoutEffect(() => {
    setState('open');
    if (!animatesY) return undefined;

    y.set(sheetHeight());
    const enter = animate(y, 0, SPRING.ui);
    runningRef.current = enter;
    return () => enter.stop();
  }, [animatesY, y]);

  useEffect(() => {
    document.body.classList.add('sheet-open');
    const previous = document.activeElement;
    requestAnimationFrame(() => closeRef.current?.focus());

    return () => {
      document.body.classList.remove('sheet-open');
      if (previous instanceof HTMLElement) previous.focus();
    };
  }, []);

  const requestClose = useCallback(
    (velocity = 0) => {
      if (closingRef.current) return;
      closingRef.current = true;
      setState('closed');

      if (!animatesY) return;

      runningRef.current?.stop();
      // onComplete, not a promise: a stopped animation must not unmount the sheet,
      // otherwise grabbing it mid-dismiss would still tear it down.
      runningRef.current = animate(y, sheetHeight(), {
        ...SPRING.snappy,
        velocity,
        onComplete: onClosed,
      });
    },
    [animatesY, onClosed, y],
  );

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') requestClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [requestClose]);

  /* ---- Direct manipulation ---- */

  const beginDrag = (event) => {
    if (!canDrag) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    // Grabbing mid-flight continues from the on-screen value, never the target.
    runningRef.current?.stop();
    runningRef.current = null;
    didDragRef.current = false;

    // A sheet caught on its way out is not closing any more — hand control back.
    if (closingRef.current) {
      closingRef.current = false;
      setState('open');
    }

    // Capture keeps tracking alive once the pointer leaves the sheet's bounds.
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Capture is an optimisation; tracking still works without it.
    }

    dragRef.current = {
      pointerId: event.pointerId,
      startPointer: event.clientY,
      startY: y.get(),
      committed: false,
      history: [{ y: event.clientY, t: event.timeStamp }],
    };
  };

  /* From the content area, only take over when there's no scrolling left to do. */
  const beginDragFromContent = (event) => {
    if ((scrollRef.current?.scrollTop ?? 0) > 0) return;
    beginDrag(event);
  };

  const moveDrag = (event) => {
    const drag = dragRef.current;
    if (!drag || event.pointerId !== drag.pointerId) return;

    drag.history.push({ y: event.clientY, t: event.timeStamp });
    if (drag.history.length > 6) drag.history.shift();

    const delta = event.clientY - drag.startPointer;
    if (!drag.committed) {
      if (Math.abs(delta) < DRAG_THRESHOLD) return;
      drag.committed = true;
      didDragRef.current = true;
      setDragging(true);
    }

    const raw = drag.startY + delta;
    // Downward tracks the finger exactly; upward resists, since there's nothing there.
    y.set(raw < 0 ? -rubberband(-raw, sheetHeight()) : raw);
  };

  const endDrag = (event) => {
    const drag = dragRef.current;
    if (!drag || event.pointerId !== drag.pointerId) return;
    dragRef.current = null;
    setDragging(false);

    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (!drag.committed) return;

    const velocity = velocityFrom(drag.history);

    if (reduceMotion) {
      if (y.get() > sheetHeight() * DISMISS_FRACTION) requestClose();
      else y.set(0);
      return;
    }

    // Snap to whichever target the flick was actually heading for.
    const projected = y.get() + projectMomentum(velocity, 0.995);
    if (projected > sheetHeight() * DISMISS_FRACTION) {
      requestClose(velocity);
      return;
    }

    // The release carried momentum, so a little overshoot is earned here.
    runningRef.current = animate(y, 0, { ...SPRING.momentum, velocity });
  };

  const onCloseClick = () => {
    if (didDragRef.current) return;
    requestClose();
  };

  const transformOrigin = useMemo(() => {
    if (!isDesktop || !originRect) return '50% 50%';

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const dialogWidth = Math.min(vw - DIALOG_GUTTER, DIALOG_MAX_WIDTH);
    const dialogLeft = (vw - dialogWidth) / 2;

    const centerX = originRect.left + originRect.width / 2;
    const centerY = originRect.top + originRect.height / 2;

    const originX = Math.min(Math.max(centerX - dialogLeft, 0), dialogWidth);
    const originY = Math.min(
      Math.max(50 + ((centerY - vh / 2) / (vh / 2)) * 50, 0),
      100,
    );

    return `${originX.toFixed(1)}px ${originY.toFixed(1)}%`;
  }, [isDesktop, originRect]);

  const variants = useMemo(() => {
    if (reduceMotion) {
      return { open: { opacity: 1 }, closed: { opacity: 0 } };
    }
    return {
      open: { opacity: 1, scale: 1, filter: 'blur(0px)' },
      closed: {
        opacity: 0,
        // Desktop grows out of the row that opened it; mobile slides, so it holds scale.
        scale: isDesktop ? 0.94 : 1,
        filter: 'blur(8px)',
      },
    };
  }, [isDesktop, reduceMotion]);

  const details = project.details?.length
    ? project.details
    : project.description
      ? [project.description]
      : [];

  /* Portalled to the body: each section is `relative z-10`, which makes it a
     stacking context, so an overlay rendered inside one is trapped underneath
     the sections that follow it. */
  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6">
      <motion.button
        type="button"
        aria-label="Close project details"
        className="absolute inset-0 bg-[var(--scrim)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: state === 'open' ? 1 : 0 }}
        transition={reduceMotion ? FADE.quick : FADE.ui}
        onClick={() => requestClose()}
      />

      <motion.div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        variants={variants}
        initial="closed"
        animate={state}
        transition={reduceMotion ? FADE.quick : SPRING.snappy}
        onAnimationComplete={(definition) => {
          if (definition === 'closed' && !animatesY) onClosed();
        }}
        style={{
          y,
          scale: canDrag && !reduceMotion ? dragScale : undefined,
          transformOrigin,
          willChange: 'transform',
        }}
        className="apple-material-heavy relative z-10 flex max-h-[88dvh] w-full max-w-[min(100%,32rem)] flex-col rounded-t-[var(--radius)] sm:max-h-[85dvh] sm:rounded-[var(--radius)]"
      >
        <div
          onPointerDown={beginDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className={`shrink-0 px-[var(--panel-pad-x)] pt-1.5 sm:pt-[var(--panel-pad-x)] ${
            canDrag ? 'touch-none' : ''
          } ${dragging ? 'cursor-grabbing' : canDrag ? 'cursor-grab' : ''}`}
        >
          {canDrag ? (
            <div
              className="mx-auto mb-2 flex w-full max-w-[6rem] flex-col items-center gap-2 py-2"
              aria-hidden="true"
            >
              <div
                className={`h-1.5 w-12 rounded-full transition-colors ${
                  dragging ? 'bg-black/35' : 'bg-black/22'
                }`}
              />
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-[var(--ink-secondary)]/80">
                Drag to close
              </p>
            </div>
          ) : null}

          <div className="flex items-start justify-between gap-4 pb-4">
            <div className="min-w-0">
              <h2
                id={titleId}
                className="apple-title text-[clamp(1.4rem,1.1rem+1.2vw,1.85rem)] text-[var(--ink)]"
              >
                {project.title}
              </h2>
              {project.meta ? (
                <p className="mt-1 text-sm font-medium text-[var(--ink-secondary)]">
                  {project.meta}
                </p>
              ) : null}
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={onCloseClick}
              className="apple-press inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black/[0.05] text-[var(--ink)]"
            >
              <span className="sr-only">Close</span>
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          onPointerDown={beginDragFromContent}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-[var(--panel-pad-x)] pb-[var(--panel-pad-x)]"
        >
          {project.tags?.length ? (
            <div className="mb-5 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="apple-tag">
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          {demoUrl ? (
            <div className="mb-6">
              {!demoOpen ? (
                <button
                  type="button"
                  onClick={() => setDemoOpen(true)}
                  className="apple-press apple-capsule w-full gap-2 border border-black/10 bg-[var(--grey)] text-[var(--ink)]"
                >
                  <Play className="h-4 w-4" aria-hidden="true" />
                  Try live demo
                </button>
              ) : (
                <div className="overflow-hidden rounded-[calc(var(--radius)-0.35rem)] border border-black/10 bg-[var(--grey)]">
                  <div className="flex items-center justify-between gap-2 border-b border-black/8 px-3 py-2">
                    <p className="text-xs font-semibold text-[var(--ink-secondary)]">
                      Live demo
                    </p>
                    <div className="flex items-center gap-1">
                      <a
                        href={demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="apple-press rounded-full px-2.5 py-1 text-xs font-semibold text-[var(--ink-secondary)] hover:text-[var(--ink)]"
                      >
                        Open tab
                      </a>
                      <button
                        type="button"
                        onClick={() => setDemoOpen(false)}
                        className="apple-press rounded-full px-2.5 py-1 text-xs font-semibold text-[var(--ink-secondary)] hover:text-[var(--ink)]"
                      >
                        Hide
                      </button>
                    </div>
                  </div>
                  <iframe
                    title={`${project.title} live demo`}
                    src={demoUrl}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="aspect-[16/10] w-full bg-white"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  />
                  <p className="border-t border-black/8 px-3 py-2 text-[0.7rem] leading-snug text-[var(--ink-secondary)]">
                    If the embed stays blank, the host is blocking iframes — use
                    Open tab.
                  </p>
                </div>
              )}
            </div>
          ) : null}

          <div className="space-y-3">
            {details.map((detail) => (
              <p
                key={detail}
                className="apple-body text-[clamp(0.9rem,0.82rem+0.3vw,1rem)] leading-relaxed"
              >
                {detail}
              </p>
            ))}
          </div>

          {project.href ? (
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="apple-press apple-capsule mt-8 gap-1.5 bg-[var(--ink)] text-white"
            >
              Open project
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          ) : null}
        </div>
      </motion.div>
    </div>,
    document.body,
  );
}
