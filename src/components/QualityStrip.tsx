const POINTS = [
  { icon: "💧", title: "Water resistant", copy: "Splashes and spills wipe off the laminated top." },
  { icon: "🛡️", title: "Scratch resistant", copy: "Handles everyday scuffs on lids and bottles." },
  { icon: "✨", title: "Laminated", copy: "Colours stay sharp instead of fading out." },
  { icon: "🧼", title: "Easy to clean", copy: "A damp cloth is all it takes." },
];

export function QualityStrip() {
  return (
    <section className="border-y-4 border-ink bg-paper px-5 py-16">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-10 text-5xl sm:text-6xl">
          MADE TO STICK.
          <br />
          <span className="text-accent">BUILT TO LAST.</span>
        </h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {POINTS.map((p) => (
            <div key={p.title} className="border-4 border-ink bg-white p-5 hard-shadow">
              <span aria-hidden="true" className="mb-3 block text-2xl">
                {p.icon}
              </span>
              <h3 className="mb-2 text-xl">{p.title}</h3>
              <p className="text-xs font-medium text-muted-foreground">{p.copy}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 max-w-xl font-mono text-[11px] font-bold tracking-tight uppercase text-muted-foreground">
          Minimal residue. Any small remaining residue can usually be cleaned with a damp cloth.
        </p>
      </div>
    </section>
  );
}
