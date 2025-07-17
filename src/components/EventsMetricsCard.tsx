import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Ticket, Gift } from "lucide-react";
import { EventMetrics } from "../pages/Index";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useTranslation } from "react-i18next";

export default function EventMetricsCard({ e }: { e: EventMetrics }) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleGift = () => {
    const giftId = e.giftTicketIds?.[0] ?? crypto.randomUUID();
    navigate(`/gift/${e.id}/${giftId}`, {
      state: { eventTitle: e.title },
    });
  };

  return (
    <Card className="border-border shadow-sm rounded-xl bg-card overflow-hidden">
      <img
        src={e.imageUrl}
        alt={e.title}
        className="w-full h-36 object-cover"
      />

      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base md:text-lg font-semibold">
          <Ticket className="h-4 w-4 text-primary" />
          {e.title}
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          {new Date(e.date).toLocaleDateString(
            i18n.language === "ar" ? "ar-EG" : "en-US",
            {
              month: "short",
              day: "numeric",
              year: "numeric",
            }
          )}{" "}
          • {e.location}
        </p>
      </CardHeader>

      <CardContent className="grid grid-cols-3 text-center text-sm gap-y-2">
        <div>
          <p className="font-bold text-lg text-primary">{e.ticketsLeft}</p>
          <p className="text-muted-foreground text-xs">
            {t("event.ticketsLeft")}
          </p>
        </div>
        <div>
          <p className="font-bold text-lg text-green-600">{e.ticketsSold}</p>
          <p className="text-muted-foreground text-xs">{t("event.sold")}</p>
        </div>
        <div>
          <p className="font-bold text-lg text-blue-600">{e.freeTickets}</p>
          <p className="text-muted-foreground text-xs">{t("event.giftable")}</p>
        </div>
      </CardContent>

      {e.freeTickets > 0 && (
        <div className="p-3 border-t border-border flex items-center justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleGift}
            className="group hover:bg-primary/90"
          >
            {t("event.giftTicket")}
            <Gift className="h-4 w-4 ml-1 transition-transform group-hover:-rotate-12" />
          </Button>
        </div>
      )}
    </Card>
  );
}
