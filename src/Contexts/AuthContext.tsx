import { createContext, useContext, useState } from "react";

type AuthContextType = {
  isLoginOpen: boolean;
  isSignupOpen: boolean;
  openLogin: () => void;
  openSignup: () => void;
  closeLogin: () => void;
  closeSignup: () => void;
  login: (token: string) => void;
  logout: () => void;
  user: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const login = (token: string) => {
    localStorage.setItem("accessToken", token);
    setUser(token);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  const openLogin = () => setIsLoginOpen(true);
  const openSignup = () => setIsSignupOpen(true);
  const closeLogin = () => setIsLoginOpen(false);
  const closeSignup = () => setIsSignupOpen(false);

  return (
    <AuthContext.Provider
      value={{
        isLoginOpen,
        isSignupOpen,
        openLogin,
        openSignup,
        closeLogin,
        closeSignup,
        login,
        logout,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
