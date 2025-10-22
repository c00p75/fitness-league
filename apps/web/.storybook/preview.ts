import type { Preview } from "@storybook/react";
import "../src/index.css";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      default: "dark",
      values: [
        {
          name: "dark",
          value: "#050505",
        },
        {
          name: "light",
          value: "#ffffff",
        },
      ],
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-fitness-background text-white">
        <Story />
      </div>
    ),
  ],
};

export default preview;