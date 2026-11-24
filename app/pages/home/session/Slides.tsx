// The recap-slides carousel: a fullscreen, party-facing deck for the session
// before this one, opened from the "Previously on…" card and screen-shared at
// the table. The deck is DM-approved text from the folder's _slides.md
// (meta/recap-slides.md) plus the slides built from the ledgers (deck.ts); this
// only shows it.
//
// Keys: → / Space / Enter next · ← / Backspace previous · Home / End · Esc closes ·
// F toggles browser fullscreen. Keys are caught at the document's capture phase
// so the runner underneath never sees them while the deck is open.

import "./slides.css";
import { useEffect, useEffectEvent, useRef, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { Box, Button, Heading, Prose, Row, Stage, Text } from "jeff-ui";
import { unlink, type DeckSlide } from "./deck.js";
import { KIND_HUE } from "./hues.js";
import { Markdown } from "./MarkdownView.js";
import { RefContext } from "./RefChips.js";

// Auto-scroll for a slide taller than its box (the standings, a long
// achievements list): creep down, hold at the bottom, glide back up, hold at the
// top, repeat. Pure, so the loop below is just frames feeding it.
export type Scroll = { phase: "down" | "up"; wait: number; pos: number };
export const SCROLL = { speed: 40, back: 600, hold: 2.5, manual: 3, hover: 1 }; // px/s, px/s, then holds in s

export function stepScroll(s: Scroll, dt: number, max: number): Scroll {
  if (max <= 0) return s;
  if (s.wait > 0) return { ...s, wait: s.wait - dt };
  if (s.phase === "down") {
    const pos = Math.min(max, s.pos + SCROLL.speed * dt);
    return pos >= max ? { phase: "up", wait: SCROLL.hold, pos } : { ...s, pos };
  }
  const pos = Math.max(0, s.pos - SCROLL.back * dt);
  return pos <= 0 ? { phase: "down", wait: SCROLL.hold, pos } : { ...s, pos };
}

const scrollBoxes = (root: HTMLElement) =>
  [...root.querySelectorAll<HTMLElement>(".sr-slide-body *")].filter(
    (b) => /auto|scroll/.test(getComputedStyle(b).overflowY) && b.scrollHeight > b.clientHeight + 2,
  );

// Runs the loop on every overflowing scroll box in the slide; returns a stop
// function. A scroll the loop didn't make (wheel, scrollbar drag) takes over:
// the loop waits SCROLL.manual seconds, then carries on down from there.
function autoScroll(root: HTMLElement): () => void {
  const boxes = scrollBoxes(root);
  if (!boxes.length || matchMedia?.("(prefers-reduced-motion: reduce)").matches) return () => {};
  const st = boxes.map((): Scroll => ({ phase: "down", wait: SCROLL.hold, pos: 0 }));
  // Hovering anything with a tooltip (a hall-of-fame chip) holds the scroll, so
  // the thing being inspected doesn't slide out from under the pointer.
  let held = false;
  const onOver = (ev: PointerEvent) => {
    held = !!(ev.target as Element).closest?.(".sr-slide-body [title]");
  };
  root.addEventListener("pointerover", onOver);
  let last = performance.now();
  let raf = requestAnimationFrame(function frame(now) {
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    boxes.forEach((b, k) => {
      if (Math.abs(b.scrollTop - st[k].pos) > 2)
        st[k] = { phase: "down", wait: SCROLL.manual, pos: b.scrollTop };
      if (held) st[k] = { ...st[k], wait: Math.max(st[k].wait, SCROLL.hover) };
      st[k] = stepScroll(st[k], dt, b.scrollHeight - b.clientHeight);
      b.scrollTop = st[k].pos;
    });
    raf = requestAnimationFrame(frame);
  });
  return () => {
    cancelAnimationFrame(raf);
    root.removeEventListener("pointerover", onOver);
  };
}

// One slide and the foot under it.
export function Slide({
  deck,
  i,
  label,
  onClose,
}: {
  deck: DeckSlide[];
  i: number;
  label: string;
  onClose: () => void;
}) {
  const s = deck[i];
  const body = s.body ?? (
    <Prose>
      <Markdown md={unlink(s.md)} />
    </Prose>
  );
  return (
    <>
      <Stage
        className={`sr-slides-stage${s.bare ? " is-bare" : ""}`}
        data-index={i}
        aria-label={s.bare ? s.title : undefined}
      >
        {s.bare ? (
          <div className="sr-slide-body">{body}</div>
        ) : (
          <Box hue={KIND_HUE.recap} edge="start" className="sr-slide-text">
            <Heading level={1} size="xl" className="sr-slide-title">
              {s.title}
            </Heading>
            <div className="sr-slide-body">{body}</div>
          </Box>
        )}
      </Stage>
      <Row as="footer" gap={4} className="sr-slides-foot">
        <Text as="span" size="sm" tone="muted" className="sr-slides-label">
          {label}
        </Text>
        <Text as="span" size="sm" tone="muted" numeric className="sr-slides-count">
          {i + 1} / {deck.length}
        </Text>
        <Button size="sm" data-act="close" title="Close (Esc)" onClick={onClose}>
          Close
        </Button>
      </Row>
    </>
  );
}

// The deck over the page, until onClose. An empty deck shows nothing.
export function Slides({
  deck,
  label,
  onClose,
}: {
  deck: DeckSlide[];
  label: string;
  onClose: () => void;
}) {
  const [i, setI] = useState(0);
  const el = useRef<HTMLDivElement>(null);
  const show = (n: number) => setI(Math.max(0, Math.min(deck.length - 1, n)));
  const onSlideKey = useEffectEvent((ev: KeyboardEvent) => {
    ev.stopPropagation();
    const k = ev.key;
    if (k === "Escape") onClose();
    else if (k === "ArrowRight" || k === " " || k === "Enter") show(i + 1);
    else if (k === "ArrowLeft" || k === "Backspace") show(i - 1);
    else if (k === "Home") show(0);
    else if (k === "End") show(Infinity);
    else if (k === "f" || k === "F") {
      if (document.fullscreenElement) void document.exitFullscreen?.();
      else void el.current?.requestFullscreen?.();
    } else return;
    ev.preventDefault();
  });

  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => onSlideKey(ev);
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      if (document.fullscreenElement) void document.exitFullscreen?.();
    };
  }, []);

  // The wheel scrolls the slide's scroll box from anywhere on the slide, not
  // only with the pointer over the box itself. Native, to be allowed preventDefault.
  useEffect(() => {
    const root = el.current;
    if (!root) return;
    const onWheel = (ev: WheelEvent) => {
      const box = scrollBoxes(root)[0];
      if (!box || box.contains(ev.target as Node)) return;
      box.scrollTop += ev.deltaY;
      ev.preventDefault();
    };
    root.addEventListener("wheel", onWheel, { passive: false });
    return () => root.removeEventListener("wheel", onWheel);
  }, [deck.length]);

  useEffect(() => (el.current ? autoScroll(el.current) : undefined), [i, deck]);

  if (!deck.length) return null;
  // Click the right two-thirds to advance, the left third to go back.
  const onClick = (ev: MouseEvent<HTMLDivElement>) => {
    if ((ev.target as HTMLElement).closest(".sr-slides-foot")) return;
    show(ev.clientX < ev.currentTarget.clientWidth / 3 ? i - 1 : i + 1);
  };
  // A portal keeps React's context, so the runner's beat and scene chips are switched off here.
  return createPortal(
    <div
      ref={el}
      className="sr-slides"
      data-theme="ink"
      data-density="comfortable"
      role="dialog"
      aria-label={label}
      onClick={onClick}
    >
      <RefContext.Provider value={null}>
        <Slide deck={deck} i={Math.min(i, deck.length - 1)} label={label} onClose={onClose} />
      </RefContext.Provider>
    </div>,
    document.body,
  );
}
