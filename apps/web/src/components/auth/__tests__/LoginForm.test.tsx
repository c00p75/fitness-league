import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LoginPage } from "../../../pages/auth/LoginPage";

// Mock Firebase Auth
vi.mock("../../../lib/firebase", () => ({
  auth: {},
}));

vi.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: vi.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe("LoginForm", () => {
  it("renders login form elements", () => {
    render(<LoginPage />, { wrapper: createWrapper() });
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("shows validation errors for invalid input", async () => {
    render(<LoginPage />, { wrapper: createWrapper() });
    
    const submitButton = screen.getByRole("button", { name: /sign in/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
      expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
    });
  });

  it("submits form with valid data", async () => {
    const mockSignIn = vi.fn().mockResolvedValue({});
    vi.mocked(require("firebase/auth").signInWithEmailAndPassword).mockImplementation(mockSignIn);

    render(<LoginPage />, { wrapper: createWrapper() });
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith(
        expect.anything(),
        "test@example.com",
        "password123"
      );
    });
  });
});