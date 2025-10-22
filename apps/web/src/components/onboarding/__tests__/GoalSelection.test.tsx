import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { GoalSelection } from "../GoalSelection";

describe("GoalSelection", () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all fitness goals", () => {
    render(
      <GoalSelection
        value="build_strength"
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText("Build Strength")).toBeInTheDocument();
    expect(screen.getByText("Lose Weight")).toBeInTheDocument();
    expect(screen.getByText("Gain Muscle")).toBeInTheDocument();
    expect(screen.getByText("Improve Endurance")).toBeInTheDocument();
    expect(screen.getByText("General Fitness")).toBeInTheDocument();
    expect(screen.getByText("Flexibility")).toBeInTheDocument();
    expect(screen.getByText("Sport Specific")).toBeInTheDocument();
  });

  it("calls onChange when goal is selected", () => {
    render(
      <GoalSelection
        value="build_strength"
        onChange={mockOnChange}
      />
    );

    const loseWeightCard = screen.getByText("Lose Weight").closest("div");
    fireEvent.click(loseWeightCard!);

    expect(mockOnChange).toHaveBeenCalledWith("lose_weight");
  });

  it("shows selected goal with correct styling", () => {
    render(
      <GoalSelection
        value="build_strength"
        onChange={mockOnChange}
      />
    );

    const buildStrengthCard = screen.getByText("Build Strength").closest("div");
    expect(buildStrengthCard).toHaveClass("ring-2", "ring-fitness-primary");
  });

  it("displays error message when provided", () => {
    render(
      <GoalSelection
        value=""
        onChange={mockOnChange}
        error="Please select a fitness goal"
      />
    );

    expect(screen.getByText("Please select a fitness goal")).toBeInTheDocument();
  });
});