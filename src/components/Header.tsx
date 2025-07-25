import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Search,
  User,
  UserPlus,
  LogIn,
  LogOut,
  Sun,
  Moon,
  Globe,
  Menu,
  X,
  Calendar,
  Clock,
  MapPin,
  Smartphone,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Home, Ticket } from "lucide-react";
import { Link } from "react-router-dom";
import { AuthModals } from "./AuthModals";
import i18n from "@/lib/i18n";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/Contexts/AuthContext";
import AsyncSelect from "react-select/async";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { mockEvents } from "@/Data/MockEvents";
import { EventPreviewCard } from "@/components/EventPreviewCard";
import useClickAway from "react-use/lib/useClickAway";

const getInitialTheme = (): boolean => {
  if (typeof window === "undefined") return true;
  const stored = localStorage.getItem("theme");
  if (stored === "light") return false;
  if (stored === "dark") return true;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

export function Header() {
  const { user, openLogin, openSignup, logout } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === "undefined") return true;
    const stored = localStorage.getItem("theme");
    if (stored === "light") return false;
    if (stored === "dark") return true;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const [language, setLanguage] = useState("EN");
  const searchWrapperRef = useRef(null);
  useClickAway(searchWrapperRef, () => {
    setIsSearchFocused(false);
  });

  const loadOptions = async (
    inputValue: string
  ): Promise<Array<Record<string, unknown>>> => {
    if (!inputValue) return [];

    const response = await axios.get(`/api/events/search`, {
      params: { query: inputValue },
    });

    return response.data.events.map((event: Record<string, unknown>) => ({
      label: event.name,
      value: event.id,
      image: event.cover_image,
      date: event.date,
      location: event.location,
    }));
  };

  const formatOptionLabel = (
    option: Record<string, unknown>
  ): React.ReactNode => (
    <div className="flex gap-2 items-center">
      <img
        src={option.image as string}
        alt={option.title as string}
        className="w-12 h-12 object-cover rounded"
      />
      <div className="flex flex-col">
        <span className="text-sm font-medium">{option.title as string}</span>
        <div className="flex items-center text-xs text-muted-foreground gap-1">
          <Calendar className="w-3 h-3" />
          <span>{option.date as string}</span>
          <Clock className="w-3 h-3 ml-2" />
          <span>{option.time as string}</span>
        </div>
        <div className="flex items-center text-xs text-muted-foreground gap-1">
          <MapPin className="w-3 h-3" />
          <span>{option.location as string}</span>
        </div>
      </div>
    </div>
  );

  const handleChange = (selected: Record<string, unknown> | null) => {
    if (selected?.value) {
      navigate(`/events/${selected.value}`);
    }
  };

  useEffect(() => {
    const html = document.documentElement;

    if (isDarkMode) {
      html.classList.add("dark");
      html.classList.remove("light");
    } else {
      html.classList.add("light");
      html.classList.remove("dark");
    }

    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  useEffect(() => {
    const storedLang = localStorage.getItem("appLanguage");
    if (storedLang) {
      setLanguage(storedLang);
      i18n.changeLanguage(storedLang === "EN" ? "en" : "ar");
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
    toast({
      title: t("themeSwitched", { theme: isDarkMode ? t("light") : t("dark") }),
      description: t("themeChangedSuccess"),
    });
  };

  const toggleLanguage = () => {
    const newLang = language === "EN" ? "ar" : "EN";
    setLanguage(newLang);
    i18n.changeLanguage(newLang === "EN" ? "en" : "ar");
    localStorage.setItem("appLanguage", newLang); // persist choice

    toast({
      title: t("languageChanged", {
        lang: newLang === "ar" ? t("arabic") : t("english"),
      }),
      description: t("interfaceLanguageUpdated"),
    });
  };

  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add("dark");
      html.classList.remove("light");
    } else {
      html.classList.add("light");
      html.classList.remove("dark");
    }
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  useEffect(() => {
    const storedLang = localStorage.getItem("appLanguage");
    if (storedLang) {
      setLanguage(storedLang);
      i18n.changeLanguage(storedLang === "EN" ? "en" : "ar");
    }
  }, []);

  const handleLogin = () => {
    openLogin();
  };

  const handleRegister = () => {
    openSignup();
  };

  const handleLogout = () => {
    logout();
    toast({
      title: t("logout"),
      description: t("logoutSuccess"),
    });
  };

  const handleProfile = () => {
    window.location.href = "/profile";
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-transparent backdrop-blur-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 sm:space-x-8 flex-shrink-0">
            <a href="/" className="block">
              <img
                src="/uploads/3a125e95-6619-4a87-943a-17a2b9109d94.png"
                alt="Ticket Runners Logo"
                className="h-32 w-auto sm:h-32 md:h-40"
              />
            </a>
          </div>

          {/* Search (hidden on mobile) */}
          <div
            className="hidden md:flex flex-col flex-1 min-w-0 max-w-lg mx-4 gap-2 relative z-10"
            ref={searchWrapperRef}
          >
            {/* Search Input */}
            <AsyncSelect
              cacheOptions
              loadOptions={loadOptions}
              defaultOptions
              onChange={handleChange}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              formatOptionLabel={formatOptionLabel}
              placeholder={t("searchEvents")}
              classNamePrefix="react-select"
              styles={{
                control: (base) => ({
                  ...base,
                  backgroundColor: "hsl(var(--input))",
                  borderColor: "hsl(var(--border))",
                  color: "var(--search-text)",
                }),
                input: (base) => ({
                  ...base,
                  color: "var(--search-text)",
                }),
                singleValue: (base) => ({
                  ...base,
                  color: "var(--search-text)",
                }),
                placeholder: (base) => ({
                  ...base,
                  color: "var(--search-placeholder)",
                }),
                option: (base, { isFocused }) => ({
                  ...base,
                  backgroundColor: isFocused
                    ? "hsl(var(--muted))"
                    : "transparent",
                  color: "white",
                }),
                menu: (base) => ({
                  ...base,
                  backgroundColor: "hsl(var(--popover))",
                }),
              }}
            />

            {/* Preview Below Input */}
            {isSearchFocused && mockEvents[0] && (
              <div className="absolute top-full left-0 w-full mt-2 bg-card border border-border rounded-xl shadow-lg z-20">
                <EventPreviewCard {...mockEvents[0]} />
              </div>
            )}
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-x-2 ltr:flex-row rtl:flex-row-reverse">
            <Button variant="header" size="icon" onClick={toggleTheme}>
              {isDarkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            <Button variant="header" size="icon" onClick={toggleLanguage}>
              <span className="text-xs ml-1">{language}</span>
            </Button>
            {!user ? (
              <>
                <Button variant="header" size="icon" onClick={handleRegister}>
                  <UserPlus className="h-4 w-4" />
                </Button>
                <Button variant="header" size="icon" onClick={handleLogin}>
                  <LogIn className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="header" size="icon" onClick={handleProfile}>
                  <User className="h-4 w-4" />
                </Button>
                <Button variant="header" size="icon" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="header"
            size="icon"
            className="md:hidden hover-scale text-muted-foreground hover:text-foreground [&]:bg-secondary/20 hover:[&]:bg-secondary/40"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border bg-card animate-fade-in">
            <div className="space-y-4">
              {/* Mobile Search */}
              <div className="relative">
                <AsyncSelect
                  cacheOptions
                  loadOptions={loadOptions}
                  defaultOptions
                  onChange={handleChange}
                  formatOptionLabel={formatOptionLabel}
                  placeholder={t("searchEvents")}
                  classNamePrefix="react-select"
                  styles={{
                    control: (base) => ({
                      ...base,
                      backgroundColor: "hsl(var(--input))",
                      borderColor: "hsl(var(--border))",
                      color: "var(--search-text)",
                    }),
                    input: (base) => ({
                      ...base,
                      color: "var(--search-text)",
                    }),
                    singleValue: (base) => ({
                      ...base,
                      color: "var(--search-text)",
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: "hsl(0, 0%, 70%)", // muted placeholder
                    }),
                    option: (base, { isFocused }) => ({
                      ...base,
                      backgroundColor: isFocused
                        ? "hsl(var(--muted))"
                        : "transparent",
                      color: "white",
                    }),
                    menu: (base) => ({
                      ...base,
                      backgroundColor: "hsl(var(--popover))",
                    }),
                  }}
                />
              </div>
              {/* Mobile Navigation Bar */}
              <nav className="flex justify-between items-center gap-2 pt-2 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 flex flex-col items-center text-xs text-muted-foreground"
                  onClick={() => (window.location.href = "/")}
                >
                  <Home className="h-5 w-5" />
                  {t("home")}{" "}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 flex flex-col items-center text-xs text-muted-foreground"
                  onClick={() => (window.location.href = "/profile")}
                >
                  <Ticket className="h-5 w-5" />
                  {t("bookings")}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 flex flex-col items-center text-xs text-muted-foreground"
                  onClick={() => (window.location.href = "/events")}
                >
                  <Calendar className="h-5 w-5" />
                  {t("events")}
                </Button>
              </nav>

              {/* Mobile Actions */}
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={toggleTheme}>
                    {isDarkMode ? (
                      <Sun className="h-4 w-4 mr-2" />
                    ) : (
                      <Moon className="h-4 w-4 mr-2" />
                    )}
                    {isDarkMode ? "Light" : "Dark"}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={toggleLanguage}>
                    <Globe className="h-4 w-4 mr-2" />
                    {language}
                  </Button>
                </div>
                <div className="flex flex-col space-y-2">
                  {!isLoggedIn ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRegister}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        {t("register")}
                      </Button>
                      <Button
                        variant="gradient"
                        size="sm"
                        onClick={handleLogin}
                      >
                        <LogIn className="h-4 w-4 mr-2" />
                        {t("login")}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleProfile}
                      >
                        <User className="h-4 w-4 mr-2" />
                        {t("profile")}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        {t("logout")}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <AuthModals
        onLoginSuccess={() => {
          /* handle success if needed */
        }}
      />
    </header>
  );
}
