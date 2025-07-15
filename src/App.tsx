import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Index from "@/pages/Index";
import EventDetail from "@/pages/EventDetail";
import Booking from "@/pages/Booking";
import AllEvents from "@/pages/AllEvents";
import Profile from "@/pages/Profile";
import ContactUs from "@/pages/ContactUs";
import AboutUs from "@/pages/AboutUs";
import NotFound from "@/pages/NotFound";
import TicketDetails from "./pages/TicketDetail";
import TransferTicketPage from "./pages/TransferTicketPage";
import TransferTicketsPage from "./pages/TransferTicketsPage";
import OrganizersPage from "./pages/OrganizersPage";
import GiftTicketPage from "./pages/GiftTicketPage";
import ViewOrganizersPage from "./pages/ViewOrganizersPage";
import { ScrollToTop } from "./components/ScrollToTop";
import PaymentConfirmation from "./pages/PaymentConfirmation";
/* -------------------------------------------------------------------------- */
/*                              Theme Context                                 */
/* -------------------------------------------------------------------------- */

interface ThemeCtx {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeCtx | undefined>(undefined);

const getInitialTheme = () => {
  if (typeof window === "undefined") return true;
  const stored = localStorage.getItem("theme");
  if (stored === "light") return false;
  if (stored === "dark") return true;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState<boolean>(getInitialTheme);

  /* Apply theme class & persist */
  useEffect(() => {
    const html = document.documentElement;
    if (isDark) html.classList.remove("light");
    else html.classList.add("light");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = useCallback(() => setIsDark((d) => !d), []);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};

/* -------------------------------------------------------------------------- */
/*                              Auth Context                                  */
/* -------------------------------------------------------------------------- */

interface AuthCtx {
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthCtx | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return Boolean(localStorage.getItem("accessToken"));
  });

  const login = (token: string) => {
    localStorage.setItem("accessToken", token);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

/* -------------------------------------------------------------------------- */
/*                                MainLayout                                  */
/* -------------------------------------------------------------------------- */

const MainLayout = () => (
  <>
    <Header />
    <Outlet />
    <Footer />
  </>
);

/* -------------------------------------------------------------------------- */
/*                                   App                                      */
/* -------------------------------------------------------------------------- */

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                <Route element={<MainLayout />}>
                  <Route index element={<Index />} />
                  <Route path="event/:id" element={<EventDetail />} />
                  <Route path="booking/:id" element={<Booking />} />
                  <Route path="ticket/:id" element={<TicketDetails />} />
                  <Route
                    path="/transfer/:bookingId/:ticketIndex"
                    element={<TransferTicketPage />}
                  />
                  <Route
                    path="/transfer-tickets"
                    element={<TransferTicketsPage />}
                  />

                  <Route path="events" element={<AllEvents />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="organizers" element={<OrganizersPage />} />
                  <Route
                    path="/ViewOrganizers/:id"
                    element={<ViewOrganizersPage />}
                  />
                  <Route
                    path="gift/:eventId/:giftId"
                    element={<GiftTicketPage />}
                  />
                  <Route
                    path="payment-confirmation"
                    element={<PaymentConfirmation />}
                  />
                  <Route path="contact" element={<ContactUs />} />
                  <Route path="about" element={<AboutUs />} />
                </Route>
                {/* Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
