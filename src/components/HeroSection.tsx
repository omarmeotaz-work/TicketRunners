import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Search,
  Sparkles,
  TrendingUp,
  Calendar,
  MapPin,
  Users,
  ArrowRight,
} from "lucide-react";
import { EventFilters } from "@/components/EventFilters";

interface HeroSectionProps {
  onShowTrending?: () => void;
}

export function HeroSection({ onShowTrending }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
  };

  const handleTrendingClick = () => {
    if (onShowTrending) {
      onShowTrending();
      // Smooth scroll to trending section
      const trendingSection = document.getElementById("trending-section");
      if (trendingSection) {
        trendingSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-dark">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,hsl(72,89%,61%,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,hsl(72,89%,61%,0.08),transparent_50%)]" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full animate-float" />
        <div
          className="absolute top-40 right-20 w-24 h-24 bg-primary/15 rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-40 left-1/3 w-20 h-20 bg-primary/10 rounded-full animate-float"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Welcome Badge */}
          <div className="inline-flex items-center space-x-2 bg-card/80 backdrop-blur-sm border border-border rounded-full px-4 py-2 mb-8 animate-fade-in">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">
              Welcome to Ticket Runners
            </span>
            <span className="text-primary text-sm font-semibold">
              Coming soon to Egypt
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-foreground mb-12 animate-slide-up">
            Discover{" "}
            <span className="bg-primary px-2 py-1 rounded text-primary-foreground">
              Amazing
            </span>
            <br />
            Events
          </h1>

          {/* Subtitle */}
          <p
            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            Book tickets for the hottest concerts, festivals, and events in
            Egypt. Secure, fast, and reliable ticket booking experience.
          </p>

          {/* Search Bar */}
          <div
            className="max-w-2xl mx-auto mb-8 animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for events, artists, venues..."
                className="w-full h-14 pl-14 pr-32 rounded-xl border border-border bg-card/80 backdrop-blur-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 text-lg"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                <Button
                  variant="gradient"
                  size="lg"
                  onClick={handleSearch}
                  className="h-10 group"
                >
                  Search
                  <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in"
            style={{ animationDelay: "0.6s" }}
          >
            <Button
              variant="gradient"
              size="hero"
              className="group"
              onClick={() => (window.location.href = "/events")}
            >
              <Sparkles className="h-5 w-5 mr-2 transition-transform group-hover:rotate-12" />
              Explore Events
            </Button>
            <Button
              variant="outline"
              size="hero"
              className="group"
              onClick={handleTrendingClick}
            >
              <TrendingUp className="h-5 w-5 mr-2 transition-transform group-hover:scale-110" />
              Trending Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
