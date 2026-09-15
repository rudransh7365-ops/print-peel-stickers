import { useEffect, useState } from "react";

export function LoadingScreen() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHidden(true), 900);
    return () => clearTimeout(t);
  }, []);

  if (hidden) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[200] grid place-items-center bg-ink transition-opacity duration-500"
      style={{ opacity: hidden ? 0 : 1 }}
    >
      <p className="display animate-drop-in text-5xl text-white sm:text-7xl">
        PRINT<span className="text-accent">&amp;</span>PEEL
      </p>
    </div>
  );
}
