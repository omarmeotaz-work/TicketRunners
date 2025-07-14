import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Ticket } from "lucide-react";
import { EventMetrics } from "../pages/Index";

export default function EventMetricsCard({ e }: { e: EventMetrics }) {
  return (
    <Card className="border-border">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Ticket className="h-4 w-4 text-primary" />
          {e.title}
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          {new Date(e.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}{" "}
          • {e.location}
        </p>
      </CardHeader>

      <CardContent className="grid grid-cols-3 text-center text-sm gap-y-1">
        <div>
          <p className="font-semibold">{e.ticketsLeft}</p>
          <p className="text-muted-foreground">Tickets Left</p>
        </div>
        <div>
          <p className="font-semibold">{e.ticketsSold}</p>
          <p className="text-muted-foreground">Sold Tickets</p>
        </div>
        <div>
          <p className="font-semibold">{e.freeTickets}</p>
          <p className="text-muted-foreground">Gift ticket</p>
        </div>
      </CardContent>
    </Card>
  );
}
