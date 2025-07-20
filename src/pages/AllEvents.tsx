import { useState, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { EventCard } from "@/components/EventCard";
import { EventFilters } from "@/components/EventFilters";
import {
  trendingEvents,
  upcomingEvents,
  recommendedEvents,
} from "@/components/EventSection";

type Filters = { category: string; location: string; tags: string[] };
const defaultFilters: Filters = { category: "All", location: "All", tags: [] };

const AllEvents = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const section = searchParams.get("section") ?? "all";

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

  const title = (() => {
    switch (section) {
      case "trending":
        return t("eventspage.trending");
      case "upcoming":
        return t("eventspage.upcoming");
      case "recommended":
        return t("eventspage.recommended");
      default:
        return t("eventspage.all");
    }
  })();

  return (
    <div className="min-h-screen bg-gradient-dark">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            {title}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t("eventspage.subtitle")}
          </p>
        </div>

        <div className="mb-12">
          <EventFilters onFilterChange={handleFilterChange} />
        </div>

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
            {t("eventspage.no_matches")}
          </p>
        )}
      </main>
    </div>
  );
};

export default AllEvents;
