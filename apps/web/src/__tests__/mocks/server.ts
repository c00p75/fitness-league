import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

// Mock Firebase Auth
export const mockFirebaseAuth = {
  currentUser: null,
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn(),
};

// Mock Firebase Firestore
export const mockFirestore = {
  collection: vi.fn(),
  doc: vi.fn(),
  get: vi.fn(),
  set: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
};

// Mock Firebase Storage
export const mockStorage = {
  ref: vi.fn(),
  uploadBytes: vi.fn(),
  getDownloadURL: vi.fn(),
};

// Create MSW server
export const server = setupServer(
  // Mock tRPC endpoints
  http.post("*/api/trpc/*", () => {
    return HttpResponse.json({ success: true });
  }),
  
  // Mock Firebase Auth endpoints
  http.post("*/identitytoolkit.googleapis.com/*", () => {
    return HttpResponse.json({
      kind: "identitytoolkit#SignInWithEmailAndPasswordResponse",
      localId: "test-user-123",
      email: "test@example.com",
      displayName: "Test User",
      idToken: "mock-id-token",
      registered: true,
    });
  })
);