import { useState, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { EventCard } from "@/components/EventCard";
import { EventFilters } from "@/components/EventFilters";
import {
  trendingEvents,
  upcomingEvents,
  recommendedEvents,
} from "@/components/EventSection";

/* -------------------------------------------------------------------------- */
/*                               Filter Types                                 */
/* -------------------------------------------------------------------------- */
type Filters = { category: string; location: string; tags: string[] };

const defaultFilters: Filters = { category: "All", location: "All", tags: [] };

const AllEvents = () => {
  /* -------------------------------- Routing -------------------------------- */
  const [searchParams] = useSearchParams();
  const section = searchParams.get("section") ?? "all";

  /* ------------------------------- Base list ------------------------------- */
  const baseEvents = useMemo(() => {
    switch (section) {
      case "trending":
        return trendingEvents;
      case "upcoming":
        return upcomingEvents;
      case "recommended":
        return recommendedEvents;
      default:
        return [...trendingEvents, ...upcomingEvents, ...recommendedEvents];
    }
  }, [section]);

  /* --------------------------- Filter state & UI --------------------------- */
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  const handleFilterChange = useCallback((f: Filters) => setFilters(f), []);

  const filteredEvents = useMemo(() => {
    let list = baseEvents;
    if (filters.category !== "All") {
      list = list.filter((e) => e.category === filters.category);
    }
    if (filters.location !== "All") {
      list = list.filter((e) => e.location === filters.location);
    }
    if (filters.tags.length) {
      list = list.filter((e) =>
        filters.tags.some((t) =>
          e.category.toLowerCase().includes(t.toLowerCase())
        )
      );
    }
    return list;
  }, [baseEvents, filters]);

  /* ------------------------------ Page title ------------------------------ */
  const title = (() => {
    switch (section) {
      case "trending":
        return "Trending Events";
      case "upcoming":
        return "Upcoming Events";
      case "recommended":
        return "Events You May Like";
      default:
        return "All Events";
    }
  })();

  /* -------------------------------- Render -------------------------------- */
  return (
    <div className="min-h-screen bg-gradient-dark">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Page heading */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            {title}
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover amazing events happening around you
          </p>
        </div>

        {/* Filters */}
        <div className="mb-12">
          <EventFilters onFilterChange={handleFilterChange} />
        </div>

        {/* Grid */}
        {filteredEvents.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event, i) => (
              <div
                key={event.id}
                className="animate-fade-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <EventCard {...event} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center">
            No events match your criteria.
          </p>
        )}
      </main>
    </div>
  );
};

export default AllEvents;
