import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Clock,
  Star,
  Users,
  Ticket,
  Share2,
  Heart,
  CalendarPlus,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useTranslation } from "react-i18next";

interface EventImage {
  url: string;
  isPrimary?: boolean;
}

interface Organizer {
  id: string;
  name: string;
  logoUrl: string;
}

interface EventData {
  id: string | undefined;
  title: string;
  videoUrl?: string;
  images: EventImage[];
  date: string;
  time: string;
  location: string;
  price: number;
  originalPrice?: number;
  category: string;
  rating: number;
  attendees: number;
  description: string;
  isFeatured?: boolean;
  organizer: Organizer;
}

const EventDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  // Mock event and organizer; replace with API call later
  const event: EventData = React.useMemo(
    () => ({
      id,
      title: t("eventDetail.title"),
      videoUrl:
        "https://player.vimeo.com/external/567774747.sd.mp4?s=6c1bc8f5e6f485d6d6c2a9f2bbfc408b7222b2fd&profile_id=164&oauth2_token_id=57447761",
      images: [
        { url: "/event1.jpg", isPrimary: true },
        { url: "/event2.jpg" },
        { url: "/event3.jpg" },
      ],
      date: t("eventDetail.date"),
      time: t("eventDetail.time"),
      location: t("eventDetail.location"),
      price: 150,
      originalPrice: 200,
      category: t("eventDetail.category"),
      rating: 4.8,
      attendees: 1250,
      description: t("eventDetail.description"),
      isFeatured: true,
      organizer: {
        id: "org-12",
        name: t("eventDetail.organizer.name"),
        logoUrl:
          "data:image/png;base64,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",
      },
    }),
    [id, t]
  );

  const mediaItems = useMemo(() => {
    const items: { type: "video" | "image"; url: string }[] = [];
    if (event.videoUrl) items.push({ type: "video", url: event.videoUrl });
    const images = [...event.images];
    if (!event.videoUrl)
      images.sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0));
    images.forEach(({ url }) => items.push({ type: "image", url }));
    return items;
  }, [event]);

  const handleBooking = () => navigate(`/booking/${id}`);
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: t("eventDetail.shareToast.title"),
      description: t("eventDetail.shareToast.description"),
    });
  };

  const handleAddToCalendar = () => {
    // 1. Build ICS content
    const startDate = new Date(`${event.date} ${event.time}`);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // assume 2‑hour event
    const format = (d: Date) =>
      d
        .toISOString()
        .replace(/[-:]|\.\d{3}/g, "")
        .slice(0, 15);

    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Ticket Runners//EN",
      "BEGIN:VEVENT",
      `UID:${event.id}@ticketrunners.com`,
      `DTSTAMP:${format(new Date())}`,
      `DTSTART:${format(startDate)}`,
      `DTEND:${format(endDate)}`,
      `SUMMARY:${event.title}`,
      `LOCATION:${event.location}`,
      `DESCRIPTION:${event.description}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    // 2. Trigger download
    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${event.title.replace(/\s+/g, "_")}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({ title: t("eventDetail.calendarToast") });
  };

  const goToOrganizer = () => navigate(`/ViewOrganizers/${event.organizer.id}`);
  return (
    <div className="min-h-screen bg-gradient-dark">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Media Carousel */}
          <div className="relative rounded-xl overflow-hidden mb-8">
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              spaceBetween={16}
              slidesPerView={1}
              loop={mediaItems.length > 1}
              className="h-96 w-full"
            >
              {mediaItems.map((media, idx) => (
                <SwiperSlide
                  key={idx}
                  className="flex items-center justify-center h-full"
                >
                  {media.type === "video" ? (
                    <video
                      src={media.url}
                      controls
                      playsInline
                      preload="none"
                      poster="/video-placeholder.jpg"
                      className="w-full h-full object-contain aspect-video"
                    />
                  ) : (
                    <img
                      src={media.url}
                      alt={`${event.title} media ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "/image-fallback.jpg";
                      }}
                    />
                  )}
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Overlay Buttons */}
            <div className="absolute top-4 right-4 flex space-x-2 z-10">
              <Button
                variant="icon"
                size="icon"
                className="bg-background/80 backdrop-blur-sm"
                onClick={handleShare}
                aria-label={t("ariaLabels.share")}
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                variant="icon"
                size="icon"
                className="bg-background/80 backdrop-blur-sm"
                onClick={handleAddToCalendar}
                aria-label={t("ariaLabels.addToCalendar")}
              >
                <CalendarPlus className="h-4 w-4" />
              </Button>
              <Button
                variant="icon"
                size="icon"
                className="bg-background/80 backdrop-blur-sm"
                aria-label={t("ariaLabels.addToFavorites")}
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col space-y-2 z-10">
              {event.isFeatured && (
                <Badge className="bg-gradient-primary text-primary-foreground border-0">
                  {t("badges.featured")}
                </Badge>
              )}
              <Badge
                variant="secondary"
                className="bg-background/80 backdrop-blur-sm"
              >
                {event.category}
              </Badge>
            </div>
          </div>

          {/* Event Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2">
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                {event.title}
              </h1>

              {/* Meta */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-5 w-5 mr-3" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Clock className="h-5 w-5 mr-3" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-5 w-5 mr-3" />
                  <span>{event.location}</span>
                </div>
              </div>

              {/* Rating & Attendees */}
              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-2" />
                  <span className="font-medium">{event.rating}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Users className="h-5 w-5 mr-2" />
                  <span>
                    {t("eventDetail.attendees", { count: event.attendees })}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  {t("eventDetail.aboutEvent")}
                </h2>
                <p className="text-muted-foreground">{event.description}</p>
              </div>
            </div>

            {/* Right Column – Booking Card & Organizer */}
            <div className="lg:col-span-1">
              <div className="card-elevated p-6 sticky top-24 flex flex-col gap-6">
                {/* Pricing */}
                <div>
                  <div className="flex items-center space-x-2">
                    {event.originalPrice && (
                      <span className="text-lg text-muted-foreground line-through">
                        {event.originalPrice} {t("currency.egp")}
                      </span>
                    )}
                    <span className="text-3xl font-bold text-primary">
                      {event.price} {t("currency.egp")}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t("eventDetail.perTicket")}
                  </p>
                </div>

                {/* Book Button */}
                <Button
                  variant="gradient"
                  className="w-full group/btn"
                  onClick={handleBooking}
                >
                  <Ticket className="h-4 w-4 mr-2 transition-transform group-hover/btn:scale-110" />
                  {t("buttons.bookNow")}
                </Button>

                {/* Organizer Card */}
                <p className="text-xl font-bold text-ring">
                  {t("eventDetail.organizers")}
                </p>
                <div
                  onClick={goToOrganizer}
                  className="flex items-center gap-3 cursor-pointer p-3 bg-secondary rounded-lg hover-scale"
                >
                  <img
                    src={event.organizer.logoUrl}
                    alt={event.organizer.name}
                    className="w-10 h-10 rounded-md object-cover"
                  />
                  <span className="font-medium text-foreground/90 group-hover:text-primary transition-colors">
                    {event.organizer.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventDetail;
