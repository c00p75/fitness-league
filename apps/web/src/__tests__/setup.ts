import "@testing-library/jest-dom";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Reset handlers after each test
afterEach(() => {
  cleanup();
});