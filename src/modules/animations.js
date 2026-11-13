import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(ScrollTrigger, TextPlugin);

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const canHover = matchMedia("(hover: hover)").matches;
const $ = (s) => document.querySelector(s);

// intro screen
export function playIntro(onDone) {
  const intro = $("#intro");
  if (reduce) { intro.remove(); onDone(); return; }

  const word = $("#intro-word");
  const text = word.textContent;
  word.textContent = "";
  [...text].forEach((c) => {
    const span = document.createElement("span");
    span.textContent = c;
    word.append(span);
  });

  document.body.classList.add("lock");
  const count = { v: 0 };
  const tl = gsap.timeline({
    onComplete: () => {
      intro.remove();
      document.body.classList.remove("lock");
      ScrollTrigger.refresh();
    },
  });
  tl.from("#intro-word span", { yPercent: 110, duration: 0.7, stagger: 0.07, ease: "power4.out" });
  tl.to(count, { v: 100, duration: 1.2, ease: "power2.inOut", onUpdate: () => { $("#intro-count").textContent = `${Math.round(count.v)}%`; } }, "<0.2");
  tl.add(onDone, ">0.1");
  tl.to(intro, { yPercent: -100, duration: 0.9, ease: "power4.inOut" }, "<");
}

export function pageIn() {
  if (reduce) return;
  gsap.from(".top > *", { y: -30, opacity: 0, duration: 0.6, stagger: 0.08, ease: "power3.out", delay: 0.3 });
  gsap.from(".grid-bg", { opacity: 0, duration: 1.4, delay: 0.3 });
}

export function gridEffects() {
  if (reduce) return;
  gsap.to(".grid-bg", { "--gx": "-56px", "--gy": "-56px", duration: 8, ease: "none", repeat: -1 });
  if (!canHover) return;
  window.addEventListener("mousemove", (e) => {
    gsap.to(".grid-bg", { "--mx": `${e.pageX}px`, "--my": `${e.pageY}px`, duration: 0.5, ease: "power2.out", overwrite: "auto" });
  });
}

// typing effect
export function typeHero() {
  const lines = [...document.querySelectorAll(".typed")];
  const texts = lines.map((l) => l.textContent);
  const more = ["and fight css.", "and love the terminal.", "and push to git.", texts[2]];
  if (reduce) return null;

  lines.forEach((l) => (l.textContent = ""));
  const tl = gsap.timeline({ paused: true, delay: 0.4 });
  lines.forEach((line, i) => {
    tl.call(() => {
      lines.forEach((l) => l.classList.remove("typing"));
      line.classList.add("typing");
    });
    tl.to(line, { text: texts[i], duration: texts[i].length * 0.05, ease: "none" });
  });
  tl.from(".sub, .sticker", { opacity: 0, y: 20, duration: 0.6, stagger: 0.15 });
  tl.from(".sticker", { rotation: 12, duration: 0.5, ease: "back.out(3)" }, "<");

  let current = texts[2];
  const loop = gsap.timeline({ repeat: -1, delay: 1 });
  more.forEach((next) => {
    loop.to({}, { duration: 2 });
    loop.to(lines[2], { text: "", duration: current.length * 0.03, ease: "none" });
    loop.to(lines[2], { text: next, duration: next.length * 0.06, ease: "none" });
    current = next;
  });
  tl.add(loop);
  return tl;
}

// marquee under the hero
export function marquee() {
  if (reduce) return;
  const tween = gsap.to("#marquee", { xPercent: -50, duration: 25, ease: "none", repeat: -1 });
  ScrollTrigger.create({ onUpdate: (self) => tween.timeScale(1 + Math.abs(self.getVelocity()) / 400) });
  gsap.ticker.add(() => tween.timeScale(tween.timeScale() + (1 - tween.timeScale()) * 0.05));
}

export function headings() {
  if (reduce) return;
  gsap.utils.toArray("h2").forEach((h) => {
    gsap.from(h, { clipPath: "inset(0 100% 0 0)", x: -30, duration: 0.8, ease: "power3.out", clearProps: "clipPath", scrollTrigger: { trigger: h, start: "top 88%" } });
  });
}

export function showCards(gridSelector, item = ".card") {
  if (reduce) return;
  gsap.from(`${gridSelector} ${item}`, {
    opacity: 0, y: 40, scale: 0.92, duration: 0.6, stagger: 0.08, ease: "back.out(1.6)",
    scrollTrigger: { trigger: gridSelector, start: "top 85%" },
  });
}

// cards tilt when the mouse moves
export function tilt(selector) {
  if (reduce || !canHover) return;
  gsap.utils.toArray(selector).forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(card, { rotationY: x * 10, rotationX: -y * 10, transformPerspective: 900, duration: 0.3, ease: "power2.out" });
    });
    card.addEventListener("mouseleave", () => gsap.to(card, { rotationX: 0, rotationY: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" }));
  });
}

export function magnet(selector) {
  if (reduce || !canHover) return;
  gsap.utils.toArray(selector).forEach((a) => {
    a.addEventListener("mousemove", (e) => {
      const r = a.getBoundingClientRect();
      gsap.to(a, { x: (e.clientX - r.left - r.width / 2) * 0.3, y: (e.clientY - r.top - r.height / 2) * 0.3, duration: 0.3 });
    });
    a.addEventListener("mouseleave", () => gsap.to(a, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" }));
  });
}

export function tileHover() {
  if (reduce || !canHover) return;
  gsap.utils.toArray(".tile").forEach((tile) => {
    const icon = tile.firstElementChild;
    tile.addEventListener("mouseenter", () => gsap.fromTo(icon, { scale: 1, rotation: 0 }, { scale: 1.35, rotation: -10, duration: 0.15, yoyo: true, repeat: 1 }));
  });
}
