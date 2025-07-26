import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Clock,
  Heart,
  Share2,
  Ticket,
  Banknote,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { ShareModal } from "@/components/ShareModal";

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
  isFeatured = false,
  isLiked = false,
}: EventCardProps) {
  const [liked, setLiked] = useState(isLiked);
  const { toast } = useToast();
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const [showShareModal, setShowShareModal] = useState(false);
  const formattedDate = useMemo(() => {
    const locale = i18n.language === "en" ? "en-GB" : i18n.language;
    return new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  }, [i18n.language, date]);

  const formattedTime = new Intl.DateTimeFormat(i18n.language, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));

  // Helper to normalize category for translation
  const normalizedCategory =
    category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

  const eventUrl = `${window.location.origin}/event/${id}`;

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
    setShowShareModal(true);
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
            {t(`tags.${normalizedCategory}`, normalizedCategory)}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-semibold text-card-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-muted-foreground">
            <Calendar className="h-4 w-4 mx-2" />
            <span className="text-sm">
              <strong className="mx-1">{t("eventCard.date")}:</strong>
              {formattedDate}
            </span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-4 w-4 mx-2" />
            <span className="text-sm">
              <strong className="mx-1">{t("eventCard.time")}:</strong>
              {formattedTime}
            </span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mx-2" />
            <span className="text-sm">
              <strong className="mx-1">{t("eventCard.location")}:</strong>
              {location}
            </span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Banknote className="h-4 w-4 mx-2" />
            <span className="text-sm">
              <strong className="mx-1">{t("eventCard.price")}:</strong>
              {price} {t("eventCard.currency")}
            </span>
          </div>
        </div>

        <div className="mt-auto">
          <Button
            variant="gradient"
            className="w-full group/btn"
            onClick={handleBooking}
          >
            <Ticket className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2 transition-transform group-hover/btn:scale-110" />
            {t("eventCard.bookNow")}
          </Button>
        </div>
      </div>
      <ShareModal
        open={showShareModal}
        onClose={() => setShowShareModal(false)}
        shareUrl={eventUrl}
      />
    </div>
  );
}
