import { Calendar, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

interface EventPreviewCardProps {
  image: string;
  title: string;
  date: string;
  time: string;
  location: string;
  genre: string;
}

export const EventPreviewCard = ({
  image,
  title,
  date,
  time,
  location,
  genre,
}: EventPreviewCardProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex gap-4 items-center border p-3 rounded-lg bg-card shadow-md">
      <img
        src={image}
        alt={title}
        className="w-20 h-20 object-cover rounded-md"
      />
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <div className="text-sm text-muted-foreground mt-1 space-y-1">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
        </div>
        <div className="mt-2">
          <Badge>{t(`tags.${genre}`, genre)}</Badge>
        </div>
      </div>
    </div>
  );
};
