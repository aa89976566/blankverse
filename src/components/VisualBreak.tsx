import Image from "next/image";
import { Reveal } from "./Reveal";

type VisualBreakProps = {
  src: string;
  alt: string;
  tall?: boolean;
};

export function VisualBreak({ src, alt, tall = false }: VisualBreakProps) {
  return (
    <Reveal className="container my-6 md:my-10">
      <div
        className={`media-frame relative w-full ${
          tall ? "aspect-[4/5] md:aspect-[16/9]" : "aspect-[16/10]"
        }`}
      >
        <Image src={src} alt={alt} fill sizes="100vw" className="object-cover" />
      </div>
    </Reveal>
  );
}

export function DualVisual({
  left,
  right,
}: {
  left: { src: string; alt: string };
  right: { src: string; alt: string };
}) {
  return (
    <Reveal className="container my-8 grid gap-3 md:my-12 md:grid-cols-2 md:gap-4">
      <div className="media-frame relative aspect-[4/5]">
        <Image src={left.src} alt={left.alt} fill sizes="50vw" className="object-cover" />
      </div>
      <div className="media-frame relative aspect-[4/5]">
        <Image src={right.src} alt={right.alt} fill sizes="50vw" className="object-cover" />
      </div>
    </Reveal>
  );
}
