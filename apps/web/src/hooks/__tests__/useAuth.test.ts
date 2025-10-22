import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAuth } from "../useAuth";

// Mock Firebase Auth
vi.mock("../../lib/firebase", () => ({
  auth: {
    currentUser: null,
    onAuthStateChanged: vi.fn(),
  },
}));

vi.mock("firebase/auth", () => ({
  onAuthStateChanged: vi.fn(),
  signOut: vi.fn(),
}));

describe("useAuth", () => {
  it("should initialize with no user", () => {
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.loading).toBe(true);
  });

  it("should handle logout", async () => {
    const mockSignOut = vi.fn().mockResolvedValue(undefined);
    vi.mocked(require("firebase/auth").signOut).mockImplementation(mockSignOut);

    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.logout();
    });

    expect(mockSignOut).toHaveBeenCalled();
  });
});