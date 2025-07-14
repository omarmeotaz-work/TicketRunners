import React, { useReducer, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import {
  EventSection,
  trendingEvents,
  upcomingEvents,
  recommendedEvents,
} from "@/components/EventSection";
import {
  TrendingUp,
  Calendar,
  Heart,
  Mail,
  Info,
  Sparkles,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Aggregate once to avoid recreating the array on every render
const allEvents = [...trendingEvents, ...upcomingEvents, ...recommendedEvents];

/* -------------------------------------------------------------------------- */
/*                                Types & State                               */
/* -------------------------------------------------------------------------- */

type Filters = {
  category: string;
  location: string;
  tags: string[];
};

interface State {
  filters: Filters;
  showTrendingOnly: boolean;
}

// Actions the reducer can handle
// "SHOW_ALL" is included for future extensibility
// in case you add a button to reset filters
// ------------------------------------------------

type Action =
  | { type: "SET_FILTERS"; payload: Filters }
  | { type: "SHOW_TRENDING" }
  | { type: "SHOW_ALL" };

const initialState: State = {
  filters: { category: "All", location: "All", tags: [] },
  showTrendingOnly: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_FILTERS":
      return { ...state, filters: action.payload, showTrendingOnly: false };
    case "SHOW_TRENDING":
      return { ...state, showTrendingOnly: true };
    case "SHOW_ALL":
      return { ...state, showTrendingOnly: false };
    default:
      return state;
  }
}

/* -------------------------------------------------------------------------- */
/*                                   Component                                */
/* -------------------------------------------------------------------------- */

const Index = () => {
  const { toast } = useToast();
  const [state, dispatch] = useReducer(reducer, initialState);

  /* --------------------------- Memoized Selectors -------------------------- */

  // 1️⃣  Apply filters only when the filter set changes
  const filteredEvents = useMemo(() => {
    let filtered = allEvents;
    const { category, location, tags } = state.filters;

    if (category !== "All") {
      filtered = filtered.filter((e) => e.category === category);
    }
    if (location !== "All") {
      filtered = filtered.filter((e) => e.location === location);
    }
    if (tags.length) {
      filtered = filtered.filter((e) =>
        tags.some((tag) => e.category.toLowerCase().includes(tag.toLowerCase()))
      );
    }

    return filtered;
  }, [state.filters]);

  // 2️⃣  Derive the event buckets from the already‑filtered list
  const currentDisplayedEvents = useMemo(() => {
    if (state.showTrendingOnly) {
      return {
        trending: trendingEvents,
        upcoming: [],
        recommended: [],
        filtered: trendingEvents,
      } as const;
    }

    return {
      trending: filteredEvents.filter((e) =>
        trendingEvents.some((t) => t.id === e.id)
      ),
      upcoming: filteredEvents.filter((e) =>
        upcomingEvents.some((u) => u.id === e.id)
      ),
      recommended: filteredEvents.filter((e) =>
        recommendedEvents.some((r) => r.id === e.id)
      ),
      filtered: filteredEvents,
    } as const;
  }, [state.showTrendingOnly, filteredEvents]);

  /* -------------------------- Event Handlers (memo) ------------------------ */

  const handleNavigation = (page: string) => {
    window.location.href = `/${page.toLowerCase().replace(" ", "")}`;
  };

  const handleShowTrending = useCallback(() => {
    dispatch({ type: "SHOW_TRENDING" });
  }, []);

  const handleFilterChange = useCallback((filters: Filters) => {
    dispatch({ type: "SET_FILTERS", payload: filters });
  }, []);

  /* -------------------------------- Render -------------------------------- */

  return (
    <div className="min-h-screen bg-gradient-dark">
      <main>
        {/* Hero Section */}
        <HeroSection onShowTrending={handleShowTrending} />

        {/* Trending Events Section */}
        <div id="trending-section">
          <EventSection
            title="Trending Events"
            subtitle="Most popular events this week"
            icon={TrendingUp}
            events={currentDisplayedEvents.trending}
          />
        </div>

        {/* Upcoming Events Section */}
        {!state.showTrendingOnly &&
          currentDisplayedEvents.upcoming.length > 0 && (
            <div className="bg-card/20">
              <EventSection
                title="Upcoming Events"
                subtitle="Don't miss these amazing upcoming events"
                icon={Calendar}
                events={currentDisplayedEvents.upcoming}
              />
            </div>
          )}

        {/* Events That May Interest You Section */}
        {currentDisplayedEvents.filtered.length > 0 && (
          <div className="bg-card/20">
            <EventSection
              title="Events That May Interest You"
              subtitle="Personalized recommendations just for you"
              icon={Sparkles}
              events={currentDisplayedEvents.filtered.slice(0, 6)}
            />
          </div>
        )}

        {/* CTA Section */}
        <section className="py-20 bg-gradient-card">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
                Ready to Discover Amazing Events?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of event‑goers and never miss out on the best
                experiences in Egypt.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="gradient"
                  size="hero"
                  onClick={() => handleNavigation("contact")}
                  className="group"
                >
                  <Mail className="h-5 w-5 mr-2 transition-transform group-hover:scale-110" />
                  Contact Us
                </Button>
                <Button
                  variant="outline"
                  size="hero"
                  onClick={() => handleNavigation("about")}
                  className="group"
                >
                  <Info className="h-5 w-5 mr-2 transition-transform group-hover:scale-110" />
                  About Us
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

// src/types/index.ts
export interface EventMetrics {
  id: string;
  title: string;
  date: string;
  venue: string;
  location: string;
  ticketsSold: number;
  ticketsLeft: number;
  freeTickets: number;
}

export interface Organizer {
  id: string;
  name: string;
  logoUrl: string;
  bio: string;
  events: EventMetrics[];
}

export default Index;
