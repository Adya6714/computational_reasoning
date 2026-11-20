import type { ReactNode } from "react";

export function Panel({
  id,
  children,
  className = "",
  center = false,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  center?: boolean;
}) {
  return (
    <section
      id={id}
      className={`panel ${className}`}
      style={center ? { justifyContent: "center" } : undefined}
    >
      <div className="inner">{children}</div>
    </section>
  );
}

export function Kicker({ children }: { children: ReactNode }) {
  return <div className="kicker">{children}</div>;
}
