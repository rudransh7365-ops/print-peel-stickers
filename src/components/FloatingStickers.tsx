import { useEffect, useRef, useState } from "react";
import { PRODUCTS } from "@/data/products";

type Spot = {
  id: string;
  className: string;
  size: string;
  depth: number;
  anim: string;
  delay: string;
};

/** Positions are tuned to sit in the hero's empty space and never cover text/buttons. */
const SPOTS: Spot[] = [
  {
    id: "ronaldo-chibi-sticker-1",
    className: "top-2 right-[-14px] sm:right-6 lg:right-24",
    size: "w-24 sm:w-32 lg:w-40",
    depth: 22,
    anim: "animate-float-slow",
    delay: "0ms",
  },
  {
    id: "gojo-run-sticker-1",
    className: "top-40 right-4 sm:top-52 sm:right-40 lg:right-[22rem]",
    size: "w-20 sm:w-24 lg:w-32",
    depth: 34,
    anim: "animate-float-fast",
    delay: "120ms",
  },
  {
    id: "hibiscus-bloom-sticker-1",
    className: "bottom-6 left-[-18px] sm:bottom-10 sm:left-2 lg:left-8",
    size: "w-20 sm:w-24 lg:w-28",
    depth: 16,
    anim: "animate-float-slow",
    delay: "240ms",
  },
  {
    id: "limited-edition-sticker-1",
    className: "bottom-32 right-[-10px] sm:bottom-16 sm:right-10 lg:right-16",
    size: "w-24 sm:w-28 lg:w-36",
    depth: 28,
    anim: "animate-float-fast",
    delay: "360ms",
  },
  {
    id: "rengoku-flame-sticker-1",
    className: "hidden lg:block top-16 left-8",
    size: "w-28",
    depth: 20,
    anim: "animate-float-slow",
    delay: "480ms",
  },
];

export function FloatingStickers() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const frame = useRef<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onMove = (e: MouseEvent) => {
      if (frame.current) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = null;
        setMouse({
          x: e.clientX / window.innerWidth - 0.5,
          y: e.clientY / window.innerHeight - 0.5,
        });
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {SPOTS.map((spot) => {
        const product = PRODUCTS.find((p) => p.id === spot.id);
        if (!product) return null;
        return (
          <div
            key={spot.id}
            className={`absolute ${spot.className} ${spot.size}`}
            style={{
              transform: `translate3d(${mouse.x * spot.depth}px, ${mouse.y * spot.depth}px, 0)`,
              transition: "transform 300ms ease-out",
            }}
          >
            <div
              className="animate-drop-in"
              style={{ animationDelay: spot.delay }}
            >
              <div className={spot.anim}>
                <img
                  src={product.images[0]}
                  alt=""
                  className="sticker pointer-events-auto w-full drop-shadow-lg"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
