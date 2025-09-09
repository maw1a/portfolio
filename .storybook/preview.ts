import "../src/app/globals.css";
import type { Preview } from "@storybook/nextjs";
import { GoogleFontsDecorator } from "./decorators";
import maw1a from "./themes/maw1a";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      docs: {
        theme: maw1a,
      },
    },
  },
  decorators: [GoogleFontsDecorator],
};

export default preview;
