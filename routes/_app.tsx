import { asset } from "fresh/runtime";
import { define } from "../utils.ts";

export default define.page(function App({ Component, state, url }) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="google" content="notranslate" />
        {state.meta?.title && (
          <>
            <title>{state.meta.title}</title>
            <meta property="og:title" content={state.meta.title} />
          </>
        )}
        {state.meta?.description && (
          <>
            <meta name="description" content={state.meta.description} />
            <meta property="og:description" content={state.meta.description} />
          </>
        )}
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Pustaka" />
        <meta property="og:url" content={url.href} />
        {state.meta?.ogImage
          ? <meta property="og:image" content={state.meta.ogImage} />
          : null}
        {state.noIndex ? <meta name="robots" content="noindex" /> : null}
        <meta name="color-scheme" content="light dark" />
        <meta name="theme-color" content="oklch(var(--accent))" />
        <meta name="twitter:card" content="summary_large_image" />
        <link
          rel="preload"
          href={asset("/fonts/quran/lpmq.woff")}
          as="font"
          type="font/woff"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href={asset("/fonts/quran/surah-names/v1/surah-names.woff2")}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <script
          type="module"
          // deno-lint-ignore react-no-danger
          dangerouslySetInnerHTML={{
            __html: `
              const isDarkMode = localStorage.theme === "dark"
                || (!("theme" in localStorage)
                  && window.matchMedia("(prefers-color-scheme: dark)").matches);
              document.documentElement.dataset.theme = isDarkMode ? "dark" : "light";`,
                        }}
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.1/src/duotone/style.css"
        />
      </head>
      <body>
        <Component />
      </body>
    </html>
  );
});
