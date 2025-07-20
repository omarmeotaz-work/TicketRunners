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
import { Footer } from "./components/Footer";
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
import ForgetPassword from "./pages/ForgetPassword";
import MerchantPage from "./pages/MerchantPage";
import { AuthModals } from "./components/AuthModals";
import { useTranslation } from "react-i18next";
import { AuthProvider } from "./Contexts/AuthContext";
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
  const { i18n } = useTranslation();

  //direction switch for arabic
  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <ScrollToTop />

              <Routes>
                <Route element={<MainLayout />}>
                  <Route index element={<Index />} />
                  <Route path="event/:id" element={<EventDetail />} />
                  <Route path="booking/:id" element={<Booking />} />
                  <Route path="/forgot-password" element={<ForgetPassword />} />
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
                  <Route path="merchant" element={<MerchantPage />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
