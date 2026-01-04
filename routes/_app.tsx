import { define } from "../utils.ts";

export default define.page(function App({ Component, state, url }) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="google" content="notranslate" />
        {state.title ? <title>{state.title}</title> : null}
        {state.description
          ? <meta name="description" content={state.description} />
          : null}
        {state.title
          ? <meta property="og:title" content={state.title} />
          : null}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url.href} />
        {state.ogImage
          ? <meta property="og:image" content={state.ogImage} />
          : null}
        {state.noIndex ? <meta name="robots" content="noindex" /> : null}
        <meta name="color-scheme" content="light dark" />
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
      </head>
      <body>
        <Component />
      </body>
    </html>
  );
});
