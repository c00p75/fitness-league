import { useState, useEffect } from "react";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      
      // Store token for tRPC requests
      if (user) {
        user.getIdToken().then((token) => {
          localStorage.setItem("firebase-auth-token", token);
        });
      } else {
        localStorage.removeItem("firebase-auth-token");
      }
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("firebase-auth-token");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return {
    user,
    loading,
    logout,
    isAuthenticated: !!user,
  };
}
