import { useState, useEffect } from "react";
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
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AuthModals } from "./AuthModals";

const getInitialTheme = (): boolean => {
  if (typeof window === "undefined") return true;
  const stored = localStorage.getItem("theme");
  if (stored === "light") return false;
  if (stored === "dark") return true;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(getInitialTheme);
  const [language, setLanguage] = useState("EN");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isTagSelectionOpen, setIsTagSelectionOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
    }
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
    toast({
      title: `Switched to ${isDarkMode ? "Light" : "Dark"} Mode`,
      description: "Theme changed successfully!",
    });
  };

  const toggleLanguage = () => {
    setLanguage(language === "EN" ? "AR" : "EN");
    toast({
      title: `Language changed to ${language === "EN" ? "Arabic" : "English"}`,
      description: `Interface language updated!`,
    });
  };

  const handleRegister = () => {
    setIsSignupOpen(true);
  };

  const handleLogin = () => {
    setIsLoginOpen(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  const handleProfile = () => {
    window.location.href = "/profile";
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleSignupSuccess = () => {
    setIsTagSelectionOpen(true);
  };

  return (
    <header
      className="
    sticky top-0 z-50 w-full
    border-b border-slate-800
    bg-slate-900/95 text-slate-100
    backdrop-blur-lg
  "
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <a href="/" className="flex items-center space-x-2">
              <img
                src="/lovable-uploads/3a125e95-6619-4a87-943a-17a2b9109d94.png"
                alt="Ticket Runners Logo"
                className="w-48 h-48"
              />
            </a>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search events..."
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-300"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2 ">
            {/* Theme Toggle */}
            <Button variant="header" size="icon" onClick={toggleTheme}>
              {isDarkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            {/* Language Toggle */}
            <Button variant="header" size="icon" onClick={toggleLanguage}>
              <span className="text-xs ml-1">{language}</span>
            </Button>

            {/* Auth Buttons */}
            {!isLoggedIn ? (
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search events..."
                  className="w-full h-10 pl-10 pr-4 rounded-xl border border-border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-300"
                />
              </div>

              {/* Mobile Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={toggleTheme}>
                    {isDarkMode ? (
                      <Sun className="h-4 w-4 mr-2" />
                    ) : (
                      <Moon className="h-4 w-4 mr-2" />
                    )}
                    {isDarkMode ? "Light" : "Dark"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={toggleLanguage}>
                    <Globe className="h-4 w-4 mr-2" />
                    {language}
                  </Button>
                </div>

                <div className="flex items-center space-x-2">
                  {!isLoggedIn ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRegister}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Register
                      </Button>
                      <Button
                        variant="gradient"
                        size="sm"
                        onClick={handleLogin}
                      >
                        <LogIn className="h-4 w-4 mr-2" />
                        Login
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
                        Profile
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
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
        isLoginOpen={isLoginOpen}
        isSignupOpen={isSignupOpen}
        isTagSelectionOpen={isTagSelectionOpen}
        onLoginClose={() => setIsLoginOpen(false)}
        onSignupClose={() => {
          setIsSignupOpen(false);
          setIsTagSelectionOpen(true);
        }}
        onTagSelectionClose={() => setIsTagSelectionOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </header>
  );
}
