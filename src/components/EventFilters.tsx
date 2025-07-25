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
import { Filter } from "lucide-react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface EventFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
}

interface FilterOptions {
  category: string;
  date: string;
  location: string;
  tags: string[];
  startDate?: Date | null;
  endDate?: Date | null;
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
  const { t, i18n } = useTranslation();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

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
      startDate: null,
      endDate: null,
    };
    setStartDate(null);
    setEndDate(null);
    setFilters(cleared);
    onFilterChange(cleared);
  };

  const hasActiveFilters =
    filters.category !== "All" ||
    filters.date !== "All" ||
    filters.location !== "All" ||
    filters.tags.length > 0 ||
    !!filters.startDate ||
    !!filters.endDate;

  return (
    <div className={clsx("bg-card border border-border rounded-xl p-6 mb-8")}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2 flex-row">
          <Filter className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">
            {t("filters.title")}
          </h3>
        </div>
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearFilters}>
            {t("filters.clearAll")}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            {t("filters.category")}
          </label>
          <Select
            value={filters.category}
            onValueChange={(value) => updateFilters({ category: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("filters.category")} />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {t(`categories.${category}`, category)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            {t("filters.date")}
          </label>
          <Select
            value={filters.date}
            onValueChange={(value) => updateFilters({ date: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("filters.date")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">{t("filters.allDates")}</SelectItem>
              <SelectItem value="today">{t("filters.today")}</SelectItem>
              <SelectItem value="tomorrow">{t("filters.tomorrow")}</SelectItem>
              <SelectItem value="this-week">{t("filters.thisWeek")}</SelectItem>
              <SelectItem value="this-month">
                {t("filters.thisMonth")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            {t("filters.location")}
          </label>
          <Select
            value={filters.location}
            onValueChange={(value) => updateFilters({ location: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("filters.location")} />
            </SelectTrigger>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {t(`locations.${location}`, location)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {i18n.dir() === "rtl" ? (
          <>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                {t("filters.endDate")}
              </label>
              <DatePicker
                selected={endDate}
                onChange={(date: Date | null) => {
                  setEndDate(date);
                  updateFilters({ endDate: date });
                }}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                maxDate={new Date(new Date().getFullYear(), 11, 31)}
                className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
                placeholderText={t("filters.endDate")}
                calendarStartDay={1}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                {t("filters.startDate")}
              </label>
              <DatePicker
                selected={startDate}
                onChange={(date: Date | null) => {
                  setStartDate(date);
                  updateFilters({ startDate: date });
                }}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                maxDate={new Date(new Date().getFullYear(), 11, 31)}
                className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
                placeholderText={t("filters.startDate")}
                calendarStartDay={1}
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                {t("filters.startDate")}
              </label>
              <DatePicker
                selected={startDate}
                onChange={(date: Date | null) => {
                  setStartDate(date);
                  updateFilters({ startDate: date });
                }}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                maxDate={new Date(new Date().getFullYear(), 11, 31)}
                className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
                placeholderText={t("filters.startDate")}
                calendarStartDay={1}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                {t("filters.endDate")}
              </label>
              <DatePicker
                selected={endDate}
                onChange={(date: Date | null) => {
                  setEndDate(date);
                  updateFilters({ endDate: date });
                }}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                maxDate={new Date(new Date().getFullYear(), 11, 31)}
                className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
                placeholderText={t("filters.endDate")}
                calendarStartDay={1}
              />
            </div>
          </>
        )}
      </div>

      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">
          {t("filters.tags")}
        </label>
        <div className="flex flex-wrap gap-2 justify-start">
          {availableTags.map((tag) => (
            <Badge
              key={tag}
              variant={filters.tags.includes(tag) ? "default" : "secondary"}
              className={clsx(
                "cursor-pointer transition-all duration-200",
                filters.tags.includes(tag)
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-primary/20"
              )}
              onClick={() => handleTagToggle(tag)}
            >
              {t(`tags.${tag}`, tag)}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
