import { http, HttpResponse } from "msw";

export const handlers = [
  // Mock tRPC API calls
  http.post("*/api/trpc/*", () => {
    return HttpResponse.json({
      result: {
        data: { success: true },
      },
    });
  }),

  // Mock Firebase Auth
  http.post("*/identitytoolkit.googleapis.com/*", () => {
    return HttpResponse.json({
      kind: "identitytoolkit#SignInWithEmailAndPasswordResponse",
      localId: "test-user-123",
      email: "test@example.com",
      displayName: "Test User",
      idToken: "mock-id-token",
      registered: true,
    });
  }),
];