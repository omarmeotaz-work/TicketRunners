import React, { useMemo, useState } from "react";
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
  ParkingCircle,
  Accessibility,
  Wifi,
  Baby,
  Leaf,
  Utensils,
  ShowerHead,
  Music,
  Sun,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ShareModal } from "@/components/ShareModal";

interface EventImage {
  url: string;
  isPrimary?: boolean;
}

interface Organizer {
  id: string;
  name: string;
  logoUrl: string;
}
interface Facility {
  name: string;
  icon: string; // Icon key to map to a Lucide icon
}

interface EventData {
  id: string | undefined;
  title: string;
  videoUrl?: string;
  images: EventImage[];
  layoutImageUrl?: string;
  date: string;
  time: string;
  location: string;
  price: number;
  originalPrice?: number;
  category: string;
  rating: number;
  attendees: number;
  description: string;
  venueInfo: string;
  facilities?: Facility[];
  isFeatured?: boolean;
  organizer: Organizer;
}

const EventDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [showTerms, setShowTerms] = useState(true);
  const locale = i18n.language === "ar" ? "ar-EG" : i18n.language || "en-US";
  const [showLayout, setShowLayout] = useState(false);

  const [showShareModal, setShowShareModal] = useState(false);

  const handleShare = () => {
    setShowShareModal(true);
  };

  // Mock event and organizer; replace with API call later
  const event: EventData = React.useMemo(
    () => ({
      id,
      title: t("eventDetail.title"),
      videoUrl: "/SampleVideo.mp4",
      images: [
        { url: "/event1.jpg", isPrimary: true },
        { url: "/event2.jpg" },
        { url: "/event3.jpg" },
      ],
      date: "2025-03-15", // ISO format; do not localize
      time: t("eventDetail.time"),
      location: t("eventDetail.location"),
      price: 150,
      originalPrice: 200,
      category: t("eventDetail.category"),
      rating: 4.8,
      attendees: 1250,
      description: t("eventDetail.description"),
      venueInfo: t("eventDetail.venueInfo"),
      facilities: [
        { name: "Parking", icon: "parking" },
        { name: "Wheelchair Access", icon: "accessibility" },
        { name: "Wi-Fi", icon: "wifi" },
        { name: "Food", icon: "food" },
      ],
      layoutImageUrl: "/layoutPlaceholder.png",
      isFeatured: true,
      organizer: {
        id: "org-12",
        name: t("eventDetail.organizer.name"),
        logoUrl: "/placeholderLogo.png",
      },
    }),
    [id, t]
  );
  const facilityIcons: Record<string, JSX.Element> = {
    parking: <ParkingCircle className="w-5 h-5 text-primary" />,
    accessibility: <Accessibility className="w-5 h-5 text-primary" />,
    wifi: <Wifi className="w-5 h-5 text-primary" />,
    baby: <Baby className="w-5 h-5 text-primary" />,
    greenArea: <Leaf className="w-5 h-5 text-primary" />,
    food: <Utensils className="w-5 h-5 text-primary" />,
    showers: <ShowerHead className="w-5 h-5 text-primary" />,
    music: <Music className="w-5 h-5 text-primary" />,
    outdoor: <Sun className="w-5 h-5 text-primary" />,
  };

  const mediaItems = useMemo(() => {
    const items: { type: "video" | "image"; url: string }[] = [];
    if (event.videoUrl) items.push({ type: "video", url: event.videoUrl });
    const images = [...event.images];
    if (!event.videoUrl)
      images.sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0));
    images.forEach(({ url }) => items.push({ type: "image", url }));
    return items;
  }, [event]);

  const date = new Date(event.date);
  const formattedDate =
    isNaN(date.getTime()) || !event.date
      ? t("common.invalidDate") // fallback text
      : new Intl.DateTimeFormat(locale, {
          day: "numeric",
          month: "long",
          year: "numeric",
        }).format(date);

  const handleBooking = () => navigate(`/booking/${id}`);

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
      <Dialog open={showTerms} onOpenChange={setShowTerms}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Terms and Conditions</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm max-h-[60vh] overflow-y-auto">
            <p>{t("eventDetail.termsContent")}</p>
            <ul className="list-disc pl-4">
              {(
                t("eventDetail.termsBullets", {
                  returnObjects: true,
                }) as string[]
              ).map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={() => setShowTerms(false)}>Accept</Button>
          </div>
        </DialogContent>
      </Dialog>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Media Carousel */}
          <div className="relative rounded-xl overflow-hidden mb-8" dir="ltr">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              navigation
              pagination={{ clickable: true }}
              spaceBetween={16}
              slidesPerView={1}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
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
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="none"
                      poster="/video-placeholder.jpg"
                      className="w-full h-full object-cover aspect-video"
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
                  <Calendar className="h-5 w-5 mx-3" />
                  <div dir={locale.startsWith("ar") ? "rtl" : "ltr"}>
                    {formattedDate}
                  </div>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Clock className="h-5 w-5 mx-3" />
                  <span>{event.time}</span>
                </div>

                <div className="flex items-center text-muted-foreground">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                      event?.location
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <MapPin className="h-5 w-5 mx-3" />
                    {event?.location}
                  </a>
                </div>
                <p className="mx-4 text-sm text-muted-foreground">
                  {t("eventDetail.gateOpen")} {event.time}
                </p>
                <p className="mx-4 text-sm text-muted-foreground">
                  {t("eventDetail.gateClose")} {event.time}
                </p>
              </div>

              {/* Description */}
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  {t("eventDetail.aboutEvent")}
                </h2>
                <p className="text-muted-foreground">{event.description}</p>
              </div>
              <div
                className="pt-6 space-y-2 relative"
                dir={locale.startsWith("ar") ? "rtl" : "ltr"}
              >
                <h3 className="text-lg font-semibold">
                  {t("eventDetail.venueInfoTitle")}
                </h3>
                <p className="text-muted-foreground">{event.venueInfo}</p>
                {event.layoutImageUrl && (
                  <div
                    className="mt-4 flex w-full"
                    dir={locale.startsWith("ar") ? "rtl" : "ltr"}
                  >
                    <Button
                      variant="gradient"
                      onClick={() => setShowLayout(true)}
                      className={
                        locale.startsWith("ar") ? "ml-auto" : "mr-auto"
                      }
                    >
                      {t("eventDetail.showLayout")}
                    </Button>
                  </div>
                )}
                <Dialog open={showLayout} onOpenChange={setShowLayout}>
                  <DialogContent className="max-w-3xl p-0 overflow-hidden">
                    <img
                      src={event.layoutImageUrl}
                      alt="Venue Layout"
                      className="w-full h-auto object-contain"
                    />
                  </DialogContent>
                </Dialog>
              </div>
              {event.facilities && event.facilities.length > 0 && (
                <div className="pt-6">
                  <h3 className="text-lg font-semibold mb-2">
                    {t("eventDetail.facilitiesTitle")}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {event.facilities.map((facility) => (
                      <div
                        key={facility.name}
                        className="flex items-center gap-2"
                      >
                        {facilityIcons[facility.icon] || null}
                        <span className="text-sm text-muted-foreground">
                          {t(`eventDetail.facilities.${facility.name}`)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column – Booking Card & Organizer */}
            <div className="lg:col-span-1">
              <div className="card-elevated p-6 sticky top-24 flex flex-col gap-6">
                {/* Pricing */}
                <div>
                  <div
                    className={`flex items-center space-x-2 ${
                      locale.startsWith("ar") ? "space-x-reverse" : ""
                    }`}
                  >
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
                  <Ticket className="h-4 w-4 mx-2 transition-transform group-hover/btn:scale-110" />
                  {t("buttons.book_now")}
                </Button>

                {/* Organizer Card */}
                <p className="text-xl font-bold text-ring">
                  {t("eventDetail.organizers")}
                </p>
                <div
                  onClick={goToOrganizer}
                  className="mx-auto group flex items-center gap-3 cursor-pointer p-3 bg-secondary rounded-lg hover-scale"
                >
                  <div className="flex flex-col items-center">
                    <img
                      src={event.organizer.logoUrl}
                      alt={event.organizer.name}
                      className="w-10 h-10 rounded-md object-cover"
                    />
                    <span className="mx-auto text-muted-foreground mt-1">
                      {event.organizer.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <section className="mt-8">
              <h2 className="text-xl font-semibold mb-2">
                {t("eventDetail.termsTitle")}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("eventDetail.termsContent")}
              </p>
            </section>
          </div>
        </div>
      </main>
      <ShareModal
        open={showShareModal}
        onClose={() => setShowShareModal(false)}
        shareUrl={""}
      />
    </div>
  );
};

export default EventDetail;
