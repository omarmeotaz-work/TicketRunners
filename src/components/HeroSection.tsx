import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, ArrowRight } from "lucide-react";

interface FeaturedEvent {
  id: string;
  title: string;
  date: string;
  venue: string;
  image: string;
}

interface HeroSectionProps {
  onShowTrending?: () => void;
  featuredEvent: FeaturedEvent | null;
}

export function HeroSection({
  onShowTrending,
  featuredEvent,
}: HeroSectionProps) {
  const handleTrendingClick = () => {
    if (onShowTrending) {
      onShowTrending();
      const trendingSection = document.getElementById("trending-section");
      if (trendingSection)
        trendingSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-gradient-dark">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,hsl(72,89%,61%,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,hsl(72,89%,61%,0.08),transparent_50%)]" />
      </div>

      {/* Floating Orbs */}
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
        <div className="grid md:grid-cols-2 gap-10 items-center gap-y-12">
          {/* Left Column */}
          <div className="text-center md:text-left max-w-xl mx-auto md:mx-0">
            {/* Welcome Badge */}
            <div className="inline-flex items-center space-x-2 bg-card/80 backdrop-blur-sm border border-border rounded-full px-4 py-2 mb-2 animate-fade-in">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                Welcome to Ticket Runners
              </span>
              <span className="text-primary text-sm font-semibold">
                Coming soon to Egypt
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-foreground mb-4 animate-slide-up">
              <div>Discover</div>
              <div className="mt-4">
                <span className="bg-primary px-2 py-1 rounded text-primary-foreground">
                  Amazing
                </span>
              </div>
              <div className="mt-4">Events</div>
            </h1>

            {/* Subtitle */}
            <p
              className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              Book tickets for the hottest concerts, festivals, and events in
              Egypt. Secure, fast, and reliable ticket booking experience.
            </p>

            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start animate-fade-in"
              style={{ animationDelay: "0.4s" }}
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

          {/* Right Column: Featured Event */}
          {featuredEvent && (
            <div className="w-full max-w-md mx-auto md:mx-0 animate-fade-in">
              <h2 className="text-xl font-semibold text-foreground mb-2 text-center md:text-left">
                Today's Featured Event
              </h2>

              {/* Entire card is now clickable */}
              <Link
                to={`/event/${featuredEvent.id}`}
                className="block group rounded-xl overflow-hidden border border-border bg-card/80 backdrop-blur-sm shadow-xl transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl"
              >
                <img
                  src={featuredEvent.image}
                  alt={featuredEvent.title}
                  className="w-full h-60 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="p-4 sm:p-6">
                  <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-2 group-hover:text-primary">
                    {featuredEvent.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {featuredEvent.date} – {featuredEvent.venue}
                  </p>
                  <Button
                    variant="gradient"
                    size="lg"
                    className="w-full pointer-events-none p-2"
                  >
                    View Event
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
