import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Reveal } from "./Reveal";
import { listPosts, type Post } from "@/lib/posts.functions";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronLeft, ChevronRight } from "lucide-react";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function PostCard({ post, onClick }: { post: Post; onClick: () => void }) {
  return (
    <article
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
      className="group relative flex h-full w-[85vw] max-w-[340px] flex-shrink-0 cursor-pointer snap-start flex-col overflow-hidden border border-black/10 bg-white transition-all duration-300 hover:border-[#00B4DC] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#00B4DC] md:w-[calc(50%-12px)] md:max-w-none lg:w-[calc(33.333%-16px)]"
    >
      {post.image_url && (
        <div className="relative h-56 w-full flex-shrink-0 overflow-hidden">
          <img
            src={post.image_url}
            alt={post.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <time
          dateTime={post.published_at}
          className="text-[10px] font-medium uppercase tracking-[0.25em] text-black/45"
        >
          {formatDate(post.published_at)}
        </time>
        <h3 className="mt-3 font-display text-xl leading-tight md:text-2xl">{post.title}</h3>
        <p className="mt-3 line-clamp-3 whitespace-pre-line text-[14px] leading-relaxed text-black/75">
          {post.body}
        </p>
        <span className="mt-auto pt-4 text-[12px] font-semibold uppercase tracking-wider text-[#00B4DC]">
          Mehr lesen
        </span>
      </div>
    </article>
  );
}

export function News() {
  const { data } = useQuery({ queryKey: ["posts"], queryFn: () => listPosts() });
  const posts = (data ?? []) as Post[];
  const [selected, setSelected] = useState<Post | null>(null);
  const [open, setOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const isMobile = useIsMobile();

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [posts.length]);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector("article");
    const width = card ? card.getBoundingClientRect().width + 16 : 320;
    el.scrollTo({ left: el.scrollLeft + dir * width, behavior: "smooth" });
  };

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

        <div className="relative mt-12">
          {/* Carousel */}
          <div
            ref={scrollRef}
            className="scrollbar-hide -mx-5 flex touch-pan-y snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-6 md:-mx-2 md:px-0"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {posts.map((p) => (
              <Reveal key={p.id} className="flex-shrink-0 snap-start">
                <PostCard
                  post={p}
                  onClick={() => {
                    setSelected(p);
                    setOpen(true);
                  }}
                />
              </Reveal>
            ))}
          </div>

          {/* Desktop arrows */}
          {!isMobile && canScrollLeft && (
            <button
              onClick={() => scrollBy(-1)}
              aria-label="Zurück scrollen"
              className="absolute -left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white shadow-md transition hover:border-[#00B4DC] hover:text-[#00B4DC]"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          {!isMobile && canScrollRight && (
            <button
              onClick={() => scrollBy(1)}
              aria-label="Weiter scrollen"
              className="absolute -right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white shadow-md transition hover:border-[#00B4DC] hover:text-[#00B4DC]"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}

          {/* Mobile swipe hint */}
          {isMobile && posts.length > 1 && (
            <div className="mt-2 flex items-center justify-center gap-1 text-[11px] text-black/40 md:hidden">
              <ChevronLeft className="h-3 w-3" />
              <span>Swipe für mehr</span>
              <ChevronRight className="h-3 w-3" />
            </div>
          )}
        </div>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side={isMobile ? "bottom" : "right"}
          className="max-h-[90vh] overflow-y-auto border-black/10 bg-white p-0 sm:max-w-xl md:max-w-lg"
        >
          {selected && (
            <>
              {selected.image_url && (
                <div className="relative h-56 w-full flex-shrink-0 sm:h-64">
                  <img
                    src={selected.image_url}
                    alt={selected.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
              )}
              <SheetHeader className="p-6 text-left">
                <time
                  dateTime={selected.published_at}
                  className="text-[10px] font-medium uppercase tracking-[0.25em] text-black/45"
                >
                  {formatDate(selected.published_at)}
                </time>
                <SheetTitle className="mt-2 font-display text-2xl leading-tight md:text-3xl">
                  {selected.title}
                </SheetTitle>
                <SheetDescription asChild>
                  <p className="mt-4 whitespace-pre-line text-[15px] leading-relaxed text-black/80">
                    {selected.body}
                  </p>
                </SheetDescription>
              </SheetHeader>
            </>
          )}
        </SheetContent>
      </Sheet>
    </section>
  );
}
