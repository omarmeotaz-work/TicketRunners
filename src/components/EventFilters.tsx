import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, MapPin, Filter } from "lucide-react";

interface EventFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
}

interface FilterOptions {
  category: string;
  date: string;
  location: string;
  tags: string[];
}

const categories = [
  "All",
  "Music",
  "Comedy",
  "Sports",
  "Theater",
  "Art",
  "Food",
  "Cultural",
  "EDM",
  "Classical",
  "Jazz",
  "Workshop",
];
const locations = [
  "All",
  "Cairo Opera House",
  "Al-Azhar Park",
  "Museum of Modern Art",
  "Sayed Darwish Theatre",
  "New Capital",
  "Zamalek District",
  "Downtown Cairo",
  "Nile Corniche",
];
const availableTags = [
  "Music",
  "Comedy",
  "Sports",
  "Theater",
  "Art",
  "Food",
  "Technology",
  "Fashion",
  "Photography",
  "Dance",
  "Literature",
  "Film",
  "Business",
];

export function EventFilters({ onFilterChange }: EventFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    category: "All",
    date: "All",
    location: "All",
    tags: [],
  });

  const updateFilters = (newFilters: Partial<FilterOptions>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFilterChange(updated);
  };

  const handleTagToggle = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter((t) => t !== tag)
      : [...filters.tags, tag];
    updateFilters({ tags: newTags });
  };

  const clearFilters = () => {
    const cleared = {
      category: "All",
      date: "All",
      location: "All",
      tags: [],
    };
    setFilters(cleared);
    onFilterChange(cleared);
  };

  const hasActiveFilters =
    filters.category !== "All" ||
    filters.date !== "All" ||
    filters.location !== "All" ||
    filters.tags.length > 0;

  return (
    <div className="bg-card backdrop-blur-sm border border-border rounded-xl p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">
            Filter Events
          </h3>
        </div>
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Category
          </label>
          <Select
            value={filters.category}
            onValueChange={(value) => updateFilters({ category: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Date
          </label>
          <Select
            value={filters.date}
            onValueChange={(value) => updateFilters({ date: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Dates</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="tomorrow">Tomorrow</SelectItem>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Location
          </label>
          <Select
            value={filters.location}
            onValueChange={(value) => updateFilters({ location: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">
          Interest Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {availableTags.map((tag) => (
            <Badge
              key={tag}
              variant={filters.tags.includes(tag) ? "default" : "secondary"}
              className={`cursor-pointer transition-all duration-200 ${
                filters.tags.includes(tag)
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-primary/20"
              }`}
              onClick={() => handleTagToggle(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
