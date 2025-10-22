import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";
import path from "path";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|ts|tsx|mdx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  viteFinal: async (config) => {
    return mergeConfig(config, {
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "../src"),
          "@fitness-league/shared": path.resolve(__dirname, "../../../packages/shared/src"),
          "@fitness-league/ui": path.resolve(__dirname, "../../../packages/ui/src"),
          "@fitness-league/env": path.resolve(__dirname, "../../../packages/env/src"),
        },
      },
    });
  },
};

export default config;