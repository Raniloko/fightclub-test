type Props = {
  eyebrow?: string;
  title: string;
};

export function PageHeader({ eyebrow, title }: Props) {
  return (
    <section className="bg-[#0a0a0a] pt-32 pb-14 text-white md:pt-40 md:pb-20">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        {eyebrow && (
          <div className="flex items-center gap-3">
            <span className="block h-px w-8 bg-[#C9A84C]" />
            <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#C9A84C]">
              {eyebrow}
            </span>
          </div>
        )}
        <h1 className="mt-4 font-display text-5xl uppercase leading-[0.95] md:text-7xl">
          <span className="fc-headline-underline">{title}</span>
        </h1>
      </div>
    </section>
  );
}
