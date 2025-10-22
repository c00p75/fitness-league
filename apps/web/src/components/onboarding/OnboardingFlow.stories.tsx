import type { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { OnboardingPage } from "../../pages/onboarding/OnboardingPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const meta: Meta<typeof OnboardingPage> = {
  title: "Pages/Onboarding",
  component: OnboardingPage,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Story />
        </BrowserRouter>
      </QueryClientProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Step1: Story = {
  parameters: {
    docs: {
      description: {
        story: "First step of onboarding - fitness goal selection.",
      },
    },
  },
};

export const Step2: Story = {
  parameters: {
    docs: {
      description: {
        story: "Second step of onboarding - experience level selection.",
      },
    },
  },
};

export const Step3: Story = {
  parameters: {
    docs: {
      description: {
        story: "Third step of onboarding - biometrics collection.",
      },
    },
  },
};

export const Step4: Story = {
  parameters: {
    docs: {
      description: {
        story: "Fourth step of onboarding - workout preferences.",
      },
    },
  },
};

export const Complete: Story = {
  parameters: {
    docs: {
      description: {
        story: "Final step of onboarding - completion screen.",
      },
    },
  },
};