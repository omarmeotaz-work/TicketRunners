import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Clock,
  Star,
  Heart,
  Share2,
  Users,
  Ticket,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

interface EventCardProps {
  id: string;
  title: string;
  image: string;
  date: string;
  time: string;
  location: string;
  price: number;
  originalPrice?: number;
  category: string;
  rating: number;
  attendees: number;
  isFeatured?: boolean;
  isLiked?: boolean;
}

export function EventCard({
  id,
  title,
  image,
  date,
  time,
  location,
  price,
  originalPrice,
  category,
  rating,
  attendees,
  isFeatured = false,
  isLiked = false,
}: EventCardProps) {
  const [liked, setLiked] = useState(isLiked);
  const { toast } = useToast();
  const { t } = useTranslation();
  const { i18n } = useTranslation();

  const formattedDate = new Intl.DateTimeFormat(i18n.language, {
    dateStyle: "long",
  }).format(new Date(date));

  const formattedTime = new Intl.DateTimeFormat(i18n.language, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
    toast({
      title: liked
        ? t("eventCard.removedFromFavorites")
        : t("eventCard.addedToFavorites"),
      description: t("eventCard.favoriteDescription", {
        title,
        action: liked ? t("eventCard.removed") : t("eventCard.added"),
      }),
    });
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${t("eventCard.sharePrefix")}: ${title}`);
    toast({
      title: t("eventCard.linkCopied"),
      description: t("eventCard.linkCopiedDescription"),
    });
  };

  const handleBooking = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `/booking/${id}`;
  };

  const handleCardClick = () => {
    window.location.href = `/event/${id}`;
  };

  return (
    <div
      className="group card-elevated overflow-hidden hover-scale cursor-pointer h-full flex flex-col"
      onClick={handleCardClick}
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Actions */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <Button
            variant="icon"
            size="icon"
            className="bg-background/80 backdrop-blur-sm hover:bg-background"
            onClick={handleLike}
          >
            <Heart
              className={`h-4 w-4 ${liked ? "fill-red-500 text-red-500" : ""}`}
            />
          </Button>
          <Button
            variant="icon"
            size="icon"
            className="bg-background/80 backdrop-blur-sm hover:bg-background"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col space-y-2">
          {isFeatured && (
            <Badge className="bg-gradient-primary text-primary-foreground border-0">
              {t("eventCard.featured")}
            </Badge>
          )}
          <Badge
            variant="secondary"
            className="bg-background/80 backdrop-blur-sm"
          >
            {t(`categories.${category}`, category)}
          </Badge>
        </div>

        {/* Price */}
        <div className="absolute bottom-4 right-4">
          <div className="bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2">
            <div className="flex items-center space-x-2">
              {originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {originalPrice} EGP
                </span>
              )}
              <span className="text-lg font-bold text-primary">
                {price} EGP
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-semibold text-card-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="text-sm">
              <strong className="mr-1">{t("eventCard.date")}:</strong>
              {formattedDate}
            </span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-4 w-4 mr-2" />
            <span className="text-sm">
              <strong className="mr-1">{t("eventCard.time")}:</strong>
              {formattedTime}
            </span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="text-sm">
              <strong className="mr-1">{t("eventCard.location")}:</strong>
              {location}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
              <span className="text-sm font-medium">{rating}</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <Users className="h-4 w-4 mr-1" />
              <span className="text-sm">{attendees}</span>
            </div>
          </div>
        </div>

        <div className="mt-auto">
          <Button
            variant="gradient"
            className="w-full group/btn"
            onClick={handleBooking}
          >
            <Ticket className="h-4 w-4 mr-2 transition-transform group-hover/btn:scale-110" />
            {t("eventCard.bookNow")}
          </Button>
        </div>
      </div>
    </div>
  );
}
