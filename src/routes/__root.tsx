import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { CookieBanner } from "../components/site/CookieBanner";


function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({

    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Fight Club Hanau — Kampfsport-Akademie" },
      {
        name: "description",
        content:
          "Fight Club Hanau: MMA, K1, Boxen, Thaiboxen, Self-Defense und Kindertraining. Kampfsport-Akademie in der Geleitstraße 66 in 63456 Hanau.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Fight Club Hanau" },
      { property: "og:title", content: "Fight Club Hanau — Kampfsport-Akademie" },
      { name: "twitter:title", content: "Fight Club Hanau — Kampfsport-Akademie" },
      {
        property: "og:description",
        content:
          "Fight Club Hanau: MMA, K1, Boxen, Thaiboxen, Self-Defense und Kindertraining. Kampfsport-Akademie in der Geleitstraße 66 in 63456 Hanau.",
      },
      {
        name: "twitter:description",
        content:
          "Fight Club Hanau: MMA, K1, Boxen, Thaiboxen, Self-Defense und Kindertraining. Kampfsport-Akademie in der Geleitstraße 66 in 63456 Hanau.",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "google-site-verification", content: "B6kswCfvMpUIGWTyDzThv80L5Y8eI9ivi6V9CCs_05Y" },
      { name: "google", content: "notranslate" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/favicon.ico" },
      { rel: "preload", as: "image", href: "/logo.png", fetchPriority: "high" } as any,
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;800;900&family=Inter:wght@400;500;600&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",

        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Fight Club Hanau",
          url: "https://www.fightclub-hanau.de",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Fight Club MMA Akademie Hanau",
          url: "https://www.fightclub-hanau.de",
          logo: "https://www.fightclub-hanau.de/favicon.ico",
        }),
      },
      {
        src: "https://www.googletagmanager.com/gtag/js?id=G-42WPB0Q120",
        async: true,
      },
      {
        children:
          "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',functionality_storage:'granted',security_storage:'granted',wait_for_update:500});try{var c=JSON.parse(localStorage.getItem('fc-consent-v1'));if(c&&c.analytics){gtag('consent','update',{analytics_storage:'granted'});}}catch(e){}gtag('js',new Date());gtag('config','G-42WPB0Q120',{anonymize_ip:true});",
      },
    ],

  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const introBootstrap =
    "(function(){try{var p=location.pathname;if(p!=='/'&&p!=='')return;if(!sessionStorage.getItem('introSeen')){document.documentElement.classList.add('fc-intro-pending');}}catch(e){}})();";

  return (
    <html lang="de" translate="no" className="notranslate">
      <head>
        {/* Runs before body paint so the curtain covers the page instantly on reload */}
        <script dangerouslySetInnerHTML={{ __html: introBootstrap }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}


function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <CookieBanner />
    </QueryClientProvider>
  );
}
