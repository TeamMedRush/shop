import { ComponentChildren, createContext } from "preact";
import { useContext, useMemo, useState } from "preact/hooks";

import type {
  UserProfileUpdateInput,
  UserRegistrationInput,
} from "@api/app";
import {
  loadCachedSession,
  logoutUser,
  normalizeApiError,
  registerUser,
  saveCachedSession,
  signInUser,
  updateUserProfile,
} from "@api/app";
import type {
  ApiError,
  AuthSession,
  SessionActionResult,
  User,
} from "@interfaces/app";

interface UserSignInInput {
  email: string;
  password: string;
}

interface AuthContextValue {
  session: AuthSession<User> | null;
  busy: boolean;
  error: ApiError | null;
  signIn: (
    input: UserSignInInput,
  ) => Promise<SessionActionResult<AuthSession<User>>>;
  register: (
    input: UserRegistrationInput,
  ) => Promise<SessionActionResult<AuthSession<User>>>;
  updateProfile: (
    input: UserProfileUpdateInput,
  ) => Promise<SessionActionResult<User>>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ComponentChildren }) {
  const [session, setSession] = useState<AuthSession<User> | null>(() =>
    loadCachedSession()
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  async function signIn(
    input: UserSignInInput,
  ): Promise<SessionActionResult<AuthSession<User>>> {
    setBusy(true);
    setError(null);

    try {
      const nextSession = await signInUser(input);
      setSession(nextSession);
      return { ok: true, data: nextSession };
    } catch (caught) {
      const nextError = normalizeApiError(caught);
      setError(nextError);
      return { ok: false, error: nextError };
    } finally {
      setBusy(false);
    }
  }

  async function register(
    input: UserRegistrationInput,
  ): Promise<SessionActionResult<AuthSession<User>>> {
    setBusy(true);
    setError(null);

    try {
      const nextSession = await registerUser(input);
      setSession(nextSession);
      return { ok: true, data: nextSession };
    } catch (caught) {
      const nextError = normalizeApiError(caught);
      setError(nextError);
      return { ok: false, error: nextError };
    } finally {
      setBusy(false);
    }
  }

  async function updateProfile(
    input: UserProfileUpdateInput,
  ): Promise<SessionActionResult<User>> {
    if (!session) {
      const nextError = {
        code: "not_authenticated",
        message: "You need to be signed in to update your customer profile.",
      } as ApiError;

      setError(nextError);
      return { ok: false, error: nextError };
    }

    setBusy(true);
    setError(null);

    try {
      const profile = await updateUserProfile(session.token, input);
      const nextSession: AuthSession<User> = {
        ...session,
        profile,
        source: "cached",
      };

      setSession(nextSession);
      saveCachedSession(nextSession);
      return { ok: true, data: profile };
    } catch (caught) {
      const nextError = normalizeApiError(caught);
      setError(nextError);
      return { ok: false, error: nextError };
    } finally {
      setBusy(false);
    }
  }

  function logout() {
    logoutUser();
    setSession(null);
  }

  function clearError() {
    setError(null);
  }

  const contextValue = useMemo<AuthContextValue>(() => ({
    session,
    busy,
    error,
    signIn,
    register,
    updateProfile,
    logout,
    clearError,
  }), [busy, error, session]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
