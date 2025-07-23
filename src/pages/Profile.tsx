import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import {
  User,
  Ticket,
  History,
  CreditCard,
  Smartphone,
  Settings,
  QrCode,
  MapPin,
  Calendar,
  Clock,
  Download,
  Eye,
  EyeOff,
  Users,
  CalendarPlus,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { InvoicePreview } from "@/components/invoicePreview";
import { PhoneOTPVerification } from "@/components/PhoneOTPVerification";
import { EmailVerification } from "@/components/EmailVerification";
const Profile = () => {
  const [showCardDetails, setShowCardDetails] = useState(false);
  // ① read the URL hash (#nfc, #bookings …)
  const { hash } = useLocation();
  const { t } = useTranslation();
  const initialTab = (() => {
    const h = hash.replace("#", "");
    const valid = ["bookings", "visits", "billing", "nfc", "settings"];
    return valid.includes(h) ? h : "bookings";
  })();
  // ② keep Tabs state in React so the URL can update as the user clicks tabs
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // State for verification components
  const [userSettings, setUserSettings] = useState({
    name: "Ahmed Mohamed Hassan",
    phone: "+20 123 456 7890",
    email: "ahmed.mohamed@example.com",
    isPhoneVerified: false,
    isEmailVerified: false,
  });

  // Mock data
  const userInfo = {
    name: "Ahmed Mohamed Hassan",
    phone: "+20 123 456 7890",
    email: "ahmed.mohamed@example.com",
  };

  const bookings = [
    {
      id: 1,
      eventTitle: "Cairo Jazz Festival 2024",
      date: "2024-02-15",
      time: "20:00",
      location: "Cairo Opera House",
      ticketPrice: 250,
      quantity: 2,
      qrEnabled: true,
      status: "confirmed",
    },
    {
      id: 2,
      eventTitle: "Comedy Night with Ahmed Ahmed",
      date: "2024-02-20",
      time: "21:00",
      location: "Al-Azhar Park",
      ticketPrice: 150,
      quantity: 1,
      qrEnabled: false,
      status: "pending",
    },
  ];

  const visits = [
    {
      id: 1,
      eventTitle: "Rock Concert 2023",
      date: "2023-12-15",
      location: "New Capital Arena",
      entranceTime: "19:45",
      dependents: ["Sarah Hassan", "Omar Hassan"],
    },
    {
      id: 2,
      eventTitle: "Art Exhibition Opening",
      date: "2023-11-20",
      location: "Museum of Modern Art",
      entranceTime: "18:30",
      dependents: [],
    },
  ];

  const billingHistory = [
    {
      id: 1,
      date: "2024-01-15",
      eventTitle: "Cairo Jazz Festival 2024",
      amount: 500,
      currency: "EGP",
      status: "paid",
      invoiceId: "INV-2024-001",
    },
    {
      id: 2,
      date: "2024-01-10",
      eventTitle: "Comedy Night",
      amount: 150,
      currency: "EGP",
      status: "paid",
      invoiceId: "INV-2024-002",
    },
  ];

  const nfcCard = {
    status: "Active",
    cardNumber: "**** **** **** 1234",
    issueDate: "2025-07-15",
    expiryDate: "2026-07-15",
  };
  // ③ whenever the tab changes, push the new hash to the URL (nice for reload / share)
  const navigate = useNavigate();
  useEffect(() => {
    navigate(`#${activeTab}`, { replace: true });
  }, [activeTab, navigate]);

  const handleViewDetails = (ticketID: number) => {
    navigate(`/ticket/${ticketID}`);
  };
  const handleAddCalendar = (b: (typeof bookings)[number]) => {
    const start = new Date(`${b.date} ${b.time}`);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
    const fmt = (d: Date) =>
      d
        .toISOString()
        .replace(/[-:]|\.\d{3}/g, "")
        .slice(0, 15);
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Ticket Runners//EN",
      "BEGIN:VEVENT",
      `UID:${b.id}@ticketrunners.com`,
      `DTSTAMP:${fmt(new Date())}`,
      `DTSTART:${fmt(start)}`,
      `DTEND:${fmt(end)}`,
      `SUMMARY:${b.eventTitle}`,
      `LOCATION:${b.location}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${b.eventTitle.replace(/\s+/g, "_")}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: "Calendar file downloaded" });
  };

  // Handlers for verification components
  const handlePhoneVerificationSuccess = (phone: string) => {
    setUserSettings(prev => ({
      ...prev,
      phone,
      isPhoneVerified: true,
    }));
  };

  const handleEmailVerificationSuccess = (email: string) => {
    setUserSettings(prev => ({
      ...prev,
      email,
      isEmailVerified: true,
    }));
  };

  const handlePhoneChange = (phone: string) => {
    setUserSettings(prev => ({
      ...prev,
      phone,
      isPhoneVerified: false,
    }));
  };

  const handleEmailChange = (email: string) => {
    setUserSettings(prev => ({
      ...prev,
      email,
      isEmailVerified: false,
    }));
  };

  const handleSaveSettings = () => {
    // Here you would typically save to your backend
    toast({
      title: "Settings Updated",
      description: "Your profile settings have been saved successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
              {t("profilepage.profileTabs.title")}
            </h1>
            <p className="text-muted-foreground">
              {t("profilepage.profileTabs.description")}
            </p>
          </div>

          <Tabs
            // defaultValue becomes controlled value
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            {" "}
            <div className="overflow-x-auto scrollbar-hide">
              <TabsList className="flex flex-nowrap gap-2 px-2 py-1 min-w-max">
                {[
                  {
                    value: "bookings",
                    labelKey: "profilepage.profileTabs.bookings",
                    icon: Ticket,
                  },
                  {
                    value: "visits",
                    labelKey: "profilepage.profileTabs.visits",
                    icon: History,
                  },
                  {
                    value: "billing",
                    labelKey: "profilepage.profileTabs.billing",
                    icon: CreditCard,
                  },
                  {
                    value: "nfc",
                    labelKey: "profilepage.profileTabs.nfc",
                    icon: Smartphone,
                  },
                  {
                    value: "settings",
                    labelKey: "profilepage.profileTabs.settings",
                    icon: Settings,
                  },
                ].map(({ value, labelKey, icon: Icon }) => (
                  <TabsTrigger
                    key={value}
                    value={value}
                    className="
      flex items-center gap-1 whitespace-nowrap
      shrink-0 px-3 py-2 text-sm
      md:justify-center
    "
                  >
                    <Icon className="h-4 w-4" />
                    {t(labelKey)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            {/* My Bookings */}
            <TabsContent value="bookings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ticket className="h-5 w-5 text-primary" />
                    {t("profilepage.myBookings.title")}
                  </CardTitle>
                  <CardDescription>
                    {t("profilepage.myBookings.description")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="border border-border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {booking.eventTitle}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-1">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span className="font-medium">
                                {t("profilepage.myBookings.date")}:{" "}
                              </span>
                              {booking.date}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span className="font-medium">
                                {t("profilepage.myBookings.time")}:{" "}
                              </span>
                              {booking.time}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span className="font-medium">
                                {t("profilepage.myBookings.location")}:{" "}
                              </span>
                              {booking.location}
                            </div>
                          </div>
                        </div>

                        <div className="self-start sm:self-auto">
                          <Badge
                            variant={
                              booking.status === "confirmed"
                                ? "default"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {t(
                              `profilepage.myBookings.status.${booking.status}`
                            )}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-0 items-start sm:items-center">
                        <div className="text-sm">
                          <span className="text-muted-foreground">
                            {t("profilepage.myBookings.quantity")}{" "}
                          </span>
                          <span className="font-medium">
                            {booking.quantity}
                          </span>
                          <span className="text-muted-foreground ml-4">
                            {t("profilepage.myBookings.total")}{" "}
                          </span>
                          <span className="font-medium">
                            {booking.ticketPrice * booking.quantity} EGP
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {booking.qrEnabled && (
                            <Button variant="outline" size="sm">
                              <QrCode className="h-4 w-4 mr-2" />
                              {t("profilepage.myBookings.qr")}
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddCalendar(booking)}
                          >
                            <CalendarPlus className="h-4 w-4 mr-2" />
                            {t("profilepage.myBookings.addToCalendar")}
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(booking.id)}
                          >
                            {t("profilepage.myBookings.viewDetails")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            {/* My Visits */}
            <TabsContent value="visits" className="space-y-6">
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
                  {visits.map((visit) => (
                    <div
                      key={visit.id}
                      className="border border-border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {visit.eventTitle}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span className="font-medium">
                                {t("profilepage.visits.date")}:
                              </span>
                              {visit.date}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span className="font-medium">
                                {t("profilepage.visits.enteredAt")}:
                              </span>
                              {visit.entranceTime}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span className="font-medium">
                                {t("profilepage.visits.location")}:
                              </span>
                              {visit.location}
                            </div>
                          </div>
                        </div>
                      </div>

                      {visit.dependents.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {t("profilepage.visits.dependents")}:{" "}
                            {visit.dependents.join(", ")}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            {/* Billing History */}
            <TabsContent value="billing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    {t("profilepage.billing.title")}
                  </CardTitle>
                  <CardDescription>
                    {t("profilepage.billing.description")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {billingHistory.map((payment) => (
                    <div
                      key={payment.id}
                      className="border border-border rounded-lg p-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {payment.eventTitle}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span>{payment.date}</span>
                            <span>
                              {t("profilepage.billing.invoice")}:{" "}
                              {payment.invoiceId}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-right sm:text-left">
                          <div className="text-right">
                            <div className="font-semibold text-foreground">
                              {payment.amount} {payment.currency}
                            </div>
                            <Badge variant="default" className="text-xs">
                              {t(
                                `profilepage.billing.status.${payment.status.toLowerCase()}`
                              )}
                            </Badge>
                          </div>
                          <InvoicePreview />
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full sm:w-auto"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            {t("profilepage.billing.download")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            {/* NFC Card */}
            <TabsContent value="nfc" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5 text-primary" />
                    {t("profilepage.nfc.title")}
                  </CardTitle>
                  <CardDescription>
                    {t("profilepage.nfc.description")}
                  </CardDescription>
                </CardHeader>
                <div className="relative mx-auto w-80 h-48 perspective mb-6">
                  <div className="card-3d hover:skew hover:rotate">
                    <div className="bg-gradient-to-br from-primary to-blue-600 text-white p-10 rounded-xl shadow-xl w-full h-full flex flex-col justify-between">
                      <div className="text-sm font-semibold tracking-widest uppercase">
                        {t("profilepage.nfc.cardTitle")}{" "}
                      </div>
                      <div className="text-lg font-mono font-bold">
                        **** **** **** 1234
                      </div>
                      <div className="flex justify-between text-xs">
                        <div>
                          <div>{t("profilepage.nfc.issued")}</div>{" "}
                          <div className="font-semibold">07/2025</div>
                        </div>
                        <div>
                          <div>{t("profilepage.nfc.expires")}</div>{" "}
                          <div className="font-semibold">07/2026</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <CardContent className="space-y-6">
                  <div className="border border-border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-foreground">
                        {t("profilepage.nfc.cardStatus")}
                      </h3>
                      <Badge variant="default">
                        {t(`profilepage.nfc.status.${nfcCard.status}`)}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("profilepage.nfc.cardNumber")}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono">
                            {showCardDetails
                              ? "1234 5678 9012 1234"
                              : nfcCard.cardNumber}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowCardDetails(!showCardDetails)}
                          >
                            {showCardDetails ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("profilepage.nfc.issueDate")}
                        </span>
                        <span>{nfcCard.issueDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("profilepage.nfc.expiryDate")}
                        </span>
                        <span>{nfcCard.expiryDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                    <Button
                      variant="outline"
                      disabled={nfcCard.status !== "Active"}
                    >
                      {t("profilepage.nfc.deactivateCard")}
                    </Button>
                    <Button variant="gradient" className="w-full sm:w-auto">
                      {t("profilepage.nfc.buyNewCard")}
                    </Button>
                  </div>

                  <div className="bg-muted/20 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">
                      {t("profilepage.nfc.cardFeaturesTitle")}
                    </h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• {t("profilepage.nfc.feature1")}</li>
                      <li>• {t("profilepage.nfc.feature2")}</li>
                      <li>• {t("profilepage.nfc.feature3")}</li>
                      <li>• {t("profilepage.nfc.feature4")}</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            {/* Account Settings */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    {t("profilepage.settingsTab.tab")}
                  </CardTitle>
                  <CardDescription>
                    {t("profilepage.settingsTab.description")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">
                        {t("profilepage.settingsTab.fullName")}
                      </Label>
                      <Input 
                        id="fullName" 
                        value={userSettings.name}
                        onChange={(e) => setUserSettings(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <PhoneOTPVerification
                        initialPhone={userSettings.phone}
                        onVerificationSuccess={handlePhoneVerificationSuccess}
                        onPhoneChange={handlePhoneChange}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <EmailVerification
                        initialEmail={userSettings.email}
                        onVerificationSuccess={handleEmailVerificationSuccess}
                        onEmailChange={handleEmailChange}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-semibold">
                      {t("profilepage.settingsTab.changePassword")}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="oldPassword">
                          {t("profilepage.settingsTab.oldPassword")}
                        </Label>
                        <Input
                          id="oldPassword"
                          type="password"
                          placeholder={t(
                            "profilepage.settingsTab.oldPasswordPlaceholder"
                          )}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">
                          {t("profilepage.settingsTab.newPassword")}
                        </Label>
                        <Input
                          id="newPassword"
                          type="password"
                          placeholder={t(
                            "profilepage.settingsTab.newPasswordPlaceholder"
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-semibold">
                      {t("profilepage.settingsTab.notificationPreferences")}
                    </h4>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="rounded border-border"
                        />
                        <span className="text-sm">
                          {t("profilepage.settingsTab.notifyEmail")}
                        </span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="rounded border-border"
                        />
                        <span className="text-sm">
                          {t("profilepage.settingsTab.notifySMS")}
                        </span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          className="rounded border-border"
                        />
                        <span className="text-sm">
                          {t("profilepage.settingsTab.notifyMarketing")}
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button variant="gradient" onClick={handleSaveSettings}>
                      {t("profilepage.settingsTab.saveChanges")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Profile;
