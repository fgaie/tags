import daisyUi from "daisyui";
import aspectRatio from "@tailwindcss/aspect-ratio";
import containerQueries from "@tailwindcss/container-queries";
import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],

  theme: {
    extend: {},
  },

  supports: {
    masonry: "grid-template-rows:masonry",
    nomasonry: "not(grid-template-rows:masonry)",
  },

  plugins: [typography, forms, containerQueries, aspectRatio, daisyUi],

  daisyui: {
    themes: ["light", "dark", "wireframe", "black"],
  },
} satisfies Config;
