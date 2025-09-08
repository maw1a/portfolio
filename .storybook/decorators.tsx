import type { Preview } from "@storybook/nextjs";
import { geistMono, geistSans } from "../src/utils/fonts";
import { cn } from "../src/utils/helpers/cn";
import type { ExtractSingle } from "../src/utils/helpers/types";

type Decorator = ExtractSingle<Exclude<Preview["decorators"], undefined>>;

export const GoogleFontsDecorator: Decorator = (Story) => (
	<main className={cn(geistSans.variable, geistMono.variable, "root")}>
		<Story />
	</main>
);
