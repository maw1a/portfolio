import "../src/app/globals.css";
import type { Preview } from "@storybook/nextjs";
import { GoogleFontsDecorator } from "./decorators";

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
	},
	decorators: [GoogleFontsDecorator],
};

export default preview;
