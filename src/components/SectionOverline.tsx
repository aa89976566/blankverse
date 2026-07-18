import { Reveal } from "./Reveal";

type SectionOverlineProps = {
  title: string;
  id?: string;
  children: React.ReactNode;
  className?: string;
};

export function SectionOverline({
  title,
  id,
  children,
  className = "",
}: SectionOverlineProps) {
  return (
    <section id={id} className={`container py-16 md:py-24 ${className}`.trim()}>
      <Reveal>
        <div className="section-rule grid gap-8 md:grid-cols-12 md:gap-6">
          <h2 className="overline md:col-span-3">{title}</h2>
          <div className="md:col-span-8 md:col-start-5">{children}</div>
        </div>
      </Reveal>
    </section>
  );
}
