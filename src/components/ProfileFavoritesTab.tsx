import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Heart, Calendar, MapPin } from "lucide-react";
import i18n from "@/lib/i18n";

export const ProfileFavoritesTab = (props: any) => {
  const { t, favoriteEvents } = props;
  return (
    <TabsContent value="favorites" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            {t("profilepage.favorites.title", "Favorite Events")}
          </CardTitle>
          <CardDescription>
            {t(
              "profilepage.favorites.description",
              "Events you have marked as favorites."
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {favoriteEvents.length === 0 ? (
            <p className="text-muted-foreground">
              {t("profilepage.favorites.empty", "No favorite events yet.")}
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(favoriteEvents as any[]).map((event) => (
                <div
                  key={event.id}
                  className="border border-border rounded-lg p-4 flex gap-4 items-center"
                >
                  <img
                    src={event.image}
                    alt={
                      i18n.language.startsWith("ar")
                        ? event.eventTitle_ar
                        : event.eventTitle_en
                    }
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {i18n.language.startsWith("ar")
                        ? event.eventTitle_ar
                        : event.eventTitle_en}
                    </h3>
                    <div className="text-sm text-muted-foreground">
                      <div>
                        <Calendar className="inline h-4 w-4 mr-1" />
                        <span
                          dir={i18n.language.startsWith("ar") ? "rtl" : "ltr"}
                        >
                          {new Intl.DateTimeFormat(i18n.language, {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }).format(new Date(event.date))}{" "}
                          {event.time}
                        </span>
                      </div>
                      <div>
                        <MapPin className="inline h-4 w-4 mr-1" />
                        <span
                          dir={i18n.language.startsWith("ar") ? "rtl" : "ltr"}
                        >
                          {i18n.language.startsWith("ar")
                            ? event.location_ar
                            : event.location_en}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
};
