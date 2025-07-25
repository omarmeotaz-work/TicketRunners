import React from "react";
import i18n from "@/lib/i18n";
import { TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Calendar, Clock, MapPin, History } from "lucide-react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export const ProfileVisitsTab = (props: any) => {
  const {
    t,
    visits,
    openFeedbackId,
    setOpenFeedbackId,
    feedbackText,
    setFeedbackText,
    handleSubmitFeedback,
    formatDate,
  } = props;
  const isRTL = i18n.language && i18n.language.startsWith("ar");
  return (
    <TabsContent
      value="visits"
      className="space-y-6"
      dir={isRTL ? "rtl" : undefined}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            {t("profilepage.visits.title")}
          </CardTitle>
          <CardDescription>
            {t("profilepage.visits.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {visits.map((v: any) => (
            <div
              key={v.id}
              className="border border-border rounded-lg p-4 space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-foreground">
                    {t("profilepage.visits.eventTitle", v.eventTitle)}
                  </h3>
                  <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 text-sm text-muted-foreground mt-1">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">
                        {t("profilepage.visits.date")}:
                      </span>
                      {formatDate(v.date)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">
                        {t("profilepage.visits.enteredAt")}:
                      </span>
                      {v.entranceTime}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span className="font-medium">
                        {t("profilepage.visits.location")}:
                      </span>
                      {v.location}
                    </div>
                  </div>
                </div>
              </div>
              {v.dependents.length > 0 && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {t("profilepage.visits.dependents")}:{" "}
                    {v.dependents.join(isRTL ? "، " : ", ")}
                  </span>
                </div>
              )}
              <div className="pt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setOpenFeedbackId(v.id)}
                >
                  {t("profilepage.visits.feedback.button")}
                </Button>
              </div>
            </div>
          ))}
          <Dialog
            open={!!openFeedbackId}
            onOpenChange={() => setOpenFeedbackId(null)}
          >
            <DialogContent>
              <DialogHeader>
                {t("profilepage.visits.feedback.title", "Provide Feedback")}
              </DialogHeader>
              <div className="space-y-4">
                <Textarea
                  placeholder={t(
                    "profilepage.visits.feedback.placeholder",
                    "Write your feedback here..."
                  )}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                />
                <Button onClick={handleSubmitFeedback}>
                  {t("profilepage.visits.feedback.submit", "Submit Feedback")}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </TabsContent>
  );
};
