export function Marquee({ items }: { items: string[] }) {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden border-y-2 border-ink bg-ink py-3 text-paper">
      <div className="marquee-track flex w-max gap-8 whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center gap-8">
            <span className="display text-lg font-bold sm:text-xl">{item}</span>
            <span className="inline-block h-2 w-2 bg-vermillion" />
          </span>
        ))}
      </div>
    </div>
  );
}
