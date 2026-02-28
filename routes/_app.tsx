import { define } from "../utils.ts";

export default define.page(function App({ Component, url }) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="google" content="notranslate" />
        <title>Pustaka</title>
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Pustaka" />
        <meta property="og:url" content={url.href} />
        <meta name="color-scheme" content="light dark" />
        <meta name="theme-color" content="oklch(var(--accent))" />
        <meta name="twitter:card" content="summary_large_image" />
        <script
          type="module"
          // deno-lint-ignore react-no-danger
          dangerouslySetInnerHTML={{
            __html: `const isDarkMode = localStorage.theme === "dark" || (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.dataset.theme = isDarkMode ? "dark" : "light";`,
          }}
        />
      </head>
      <body>
        <Component />
      </body>
    </html>
  );
});
