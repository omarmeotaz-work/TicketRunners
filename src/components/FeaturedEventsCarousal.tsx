import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

interface FeaturedEvent {
  id: string;
  title: string;
  date: string;
  image: string;
  venue: string;
  organizer: string;
  bookNowLink?: string;
}

interface FeaturedCarouselProps {
  events: FeaturedEvent[];
}

export const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({
  events,
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const sliderRef = useRef<HTMLDivElement>(null);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const [sliderInstanceRef, slider] = useKeenSlider<HTMLDivElement>({
    rtl: isRTL,
    loop: true,
    slides: {
      perView: 1.2,
      spacing: 16,
    },
    breakpoints: {
      "(min-width: 768px)": {
        slides: { perView: 1, spacing: 24 },
      },
      "(min-width: 1024px)": {
        slides: { perView: 1, spacing: 32 },
      },
    },
  });

  // Auto-slide every 4 seconds
  useEffect(() => {
    if (!slider) return;

    timer.current = setInterval(() => {
      slider.current?.next();
    }, 4000);

    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [slider]);

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">{t("hero.featured_title")}</h2>

      <div
        dir={isRTL ? "rtl" : "ltr"}
        ref={sliderInstanceRef}
        className="keen-slider"
      >
        {events.map((event) => (
          <div
            key={event.id}
            className="keen-slider__slide"
            onClick={() => {
              window.location.href = `/event/${event.id}`;
            }}
          >
            <div className="bg-card rounded-xl shadow-md overflow-hidden flex flex-col h-full">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex flex-col justify-between flex-1 space-y-2">
                <div>
                  <h3 className="text-lg font-semibold">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">{event.date}</p>
                  <p className="text-sm text-muted-foreground">{event.venue}</p>
                  <p className="text-sm text-muted-foreground italic">
                    {t("hero.organized_by")}: {event.organizer}
                  </p>
                </div>
                <div className="flex gap-2 pt-2 mt-auto">
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `/event/${event.id}`;
                    }}
                  >
                    {t("hero.featured_button")}
                  </Button>

                  <Button
                    variant="default"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `/booking/${event.id}`;
                    }}
                  >
                    {t("hero.book_now")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
