import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
	stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
	addons: [],
	framework: {
		name: "@storybook/nextjs",
		options: {},
	},
	staticDirs: [
		"../public",
		{
			from: "../public/fonts",
			to: "public/fonts",
		},
	],
};
export default config;
