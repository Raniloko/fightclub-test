import { useQuery } from "@tanstack/react-query";
import { Reveal } from "./Reveal";
import { listPosts, type Post } from "@/lib/posts.functions";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function News() {
  const { data } = useQuery({ queryKey: ["posts"], queryFn: () => listPosts() });
  const posts = (data ?? []) as Post[];

  if (posts.length === 0) return null;

  return (
    <section id="news" className="bg-white text-[#0a0a0a]">
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="block h-px w-8 bg-[#C9A84C]" />
            <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#C9A84C]">
              Aktuelles
            </span>
          </div>
          <h2 className="mt-4 font-display text-5xl md:text-7xl">
            <span className="fc-headline-underline">NEUIGKEITEN & BEITRÄGE</span>
          </h2>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-black/70 md:text-[17px]">
            News aus dem Gym — für Groß und Klein. Events, Erfolge und Infos rund um unser
            Training.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <Reveal key={p.id}>
              <article className="flex h-full flex-col border border-black/10 bg-white transition-colors hover:border-[#00B4DC]">
                {p.image_url && (
                  <img
                    src={p.image_url}
                    alt={p.title}
                    loading="lazy"
                    className="h-56 w-full object-cover"
                  />
                )}
                <div className="flex flex-1 flex-col p-6">
                  <time
                    dateTime={p.published_at}
                    className="text-[10px] font-medium uppercase tracking-[0.25em] text-black/45"
                  >
                    {formatDate(p.published_at)}
                  </time>
                  <h3 className="mt-3 font-display text-2xl leading-tight">{p.title}</h3>
                  <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-black/75">
                    {p.body}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
