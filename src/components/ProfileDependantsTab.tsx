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
import { Users, Calendar, Clock, MapPin } from "lucide-react";

export const ProfileDependantsTab = (props: any) => {
  const { t, dependants, handleViewDetails, formatDate } = props;
  return (
    <TabsContent value="dependants" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            {t("profilepage.dependentBookings.title")}
          </CardTitle>
          <CardDescription>
            {t("profilepage.dependentBookings.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {dependants.map((tkt: any) => (
            <div
              key={tkt.id}
              className="border border-border rounded-lg p-4 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                <div>
                  <h3 className="font-semibold text-foreground">
                    {tkt.eventTitle}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-1">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">
                        {t("profilepage.myBookings.date")}:
                      </span>{" "}
                      {formatDate(tkt.date)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">
                        {t("profilepage.myBookings.time")}:
                      </span>{" "}
                      {tkt.time}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span className="font-medium">
                        {t("profilepage.myBookings.location")}:
                      </span>{" "}
                      {tkt.location}
                    </div>
                  </div>
                </div>
                <div className="self-start sm:self-auto">
                  <Badge
                    variant={tkt.status === "claimed" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {t(`profilepage.dependentBookings.status.${tkt.status}`)}
                  </Badge>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-0 items-start sm:items-center">
                <div className="text-sm">
                  <span className="text-muted-foreground">
                    {t("profilepage.myBookings.quantity")}{" "}
                  </span>
                  <span className="font-medium">{tkt.quantity}</span>
                  <span className="text-muted-foreground ml-4">
                    {t("profilepage.myBookings.total")}{" "}
                  </span>
                  <span className="font-medium">
                    {tkt.ticketPrice * tkt.quantity} EGP
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {tkt.status === "pending" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(tkt.id)}
                    >
                      {t("profilepage.myBookings.viewDetails")}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </TabsContent>
  );
};
