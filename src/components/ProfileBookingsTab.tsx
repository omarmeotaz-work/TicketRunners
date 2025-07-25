import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QrCode, CalendarPlus, Calendar, Clock, MapPin } from "lucide-react";

export const ProfileBookingsTab = (props: any) => {
  const { t, bookings, handleAddCalendar, handleViewDetails, formatDate } =
    props;
  return (
    <TabsContent value="bookings" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-primary" />
            {t("profilepage.myBookings.title")}
          </CardTitle>
          <CardDescription>
            {t("profilepage.myBookings.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {bookings.map((booking: any) => {
            const b = booking;
            return (
              <div
                key={b.id}
                className="border border-border rounded-lg p-4 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {b.eventTitle}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span className="font-medium">
                          {t("profilepage.myBookings.date")}:{" "}
                        </span>
                        {formatDate(b.date)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">
                          {t("profilepage.myBookings.time")}:{" "}
                        </span>
                        {b.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span className="font-medium">
                          {t("profilepage.myBookings.location")}:{" "}
                        </span>
                        {b.location}
                      </div>
                    </div>
                  </div>
                  <div className="self-start sm:self-auto">
                    <Badge
                      variant={
                        b.status === "confirmed" ? "default" : "secondary"
                      }
                      className="text-xs"
                    >
                      {t(`profilepage.myBookings.status.${b.status}`)}
                    </Badge>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-0 items-start sm:items-center">
                  <div className="text-sm">
                    <span className="text-muted-foreground">
                      {t("profilepage.myBookings.quantity")}{" "}
                    </span>
                    <span className="font-medium">{b.quantity}</span>
                    <span className="text-muted-foreground ml-4">
                      {t("profilepage.myBookings.total")}{" "}
                    </span>
                    <span className="font-medium">
                      {b.ticketPrice * b.quantity} EGP
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {b.qrEnabled && (
                      <Button variant="outline" size="sm">
                        <QrCode className="h-4 w-4 mr-2" />
                        {t("profilepage.myBookings.qr")}
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddCalendar(b)}
                    >
                      <CalendarPlus className="h-4 w-4 mr-2" />
                      {t("profilepage.myBookings.addToCalendar")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(b.id)}
                    >
                      {t("profilepage.myBookings.viewDetails")}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </TabsContent>
  );
};
