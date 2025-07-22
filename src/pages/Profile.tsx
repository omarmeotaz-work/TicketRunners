import { useEffect, useRef, useState } from "react";
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
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Toast } from "@/components/ui/toast";
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
  const [openFeedbackId, setOpenFeedbackId] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [rating, setRating] = useState<number | null>(null);

  // Mock data
  const userInfo = {
    id: "12345",
    name: "Ahmed Mohamed Hassan",
    phone: "+20 123 456 7890",
    email: "ahmed.mohamed@example.com",
    emergencyContact: "01100777223",
    bloodType: "A",
    profileImage: "/public/Portrait_Placeholder.png",
    CardActive: true,
  };
  const firstName = userInfo.name.split(" ")[0];

  const hasActiveNfcCard = userInfo?.CardActive ?? false;

  const [profile, setProfile] = useState(() => {
    const stored = localStorage.getItem("userProfile");
    return stored ? JSON.parse(stored) : userInfo;
  });
  const [profileImage, setProfileImage] = useState<string>(() => {
    return localStorage.getItem("profileImage") || userInfo.profileImage;
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [bloodType, setBloodType] = useState(userInfo.bloodType || "");
  const [emergencyContact, setEmergencyContact] = useState(
    userInfo.emergencyContact || ""
  );

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
      status: "Wallet",
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
      status: "Card",
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
  const handleSubmitFeedback = () => {
    if (!openFeedbackId) return;
    // TODO: Submit feedback to API
    console.log({
      visitId: openFeedbackId,
      feedback: feedbackText,
      rating,
    });
    setOpenFeedbackId(null);
    setFeedbackText("");
    setRating(0);
  };

  const handleFieldChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    localStorage.setItem("userProfile", JSON.stringify(profile));
    alert("Profile saved locally.");
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      <div className="mx-10 flex gap-2 items-center">
        <img
          src={userInfo.profileImage}
          alt="Profile Preview"
          className="w-24 h-24 rounded-full object-cover border"
        />
        <CardTitle> {t("profilepage.settingsTab.ID")}</CardTitle>
        <CardTitle> {userInfo.id}</CardTitle>
      </div>
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
                      <div className="pt-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setOpenFeedbackId(visit.id)}
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
                        {t("profilepage.visits.feedback.title")}
                      </DialogHeader>

                      <div className="space-y-4">
                        <Textarea
                          placeholder={t(
                            "profilepage.visits.feedback.placeholder"
                          )}
                          value={feedbackText}
                          onChange={(e) => setFeedbackText(e.target.value)}
                        />

                        <Button onClick={handleSubmitFeedback}>
                          {t("profilepage.visits.feedback.submit")}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
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
            <div className="relative">
              <div
                className={
                  hasActiveNfcCard
                    ? ""
                    : "blur-xs pointer-events-none select-none"
                }
              >
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
                    <div className="relative w-auto h-96 overflow-hidden rounded-xl bg-transparent mx-auto">
                      <div className="relative w-full h-full flex items-center justify-center">
                        {/* Hover Target - Wrap images in group */}
                        <div className="relative group w-44 h-auto flex items-center justify-center">
                          {/* Front Image */}
                          <div className="transition-opacity duration-500 ease-in-out group-hover:opacity-0 z-10">
                            <img
                              src="/public/NFC CARD Front -1.png"
                              alt="NFC Front"
                              className="shadow-2xl w-44 rounded-lg"
                            />
                          </div>

                          {/* Back Image + Overlays */}
                          <div className="absolute transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100 z-20 flex items-center justify-center">
                            <img
                              src="/public/NFC CARD Back-1.png"
                              alt="NFC Card Back"
                              className="shadow-2xl w-44 rounded-lg"
                            />

                            {/* Name */}
                            <div className="absolute top-[83%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                              <span className="text-black text-xs font-bold drop-shadow-md">
                                {firstName}
                              </span>
                            </div>

                            {/* ID */}
                            <div className="absolute top-[93%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                              <span className="text-white text-xs font-bold drop-shadow-md">
                                {userInfo.id}
                              </span>
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
                                onClick={() =>
                                  setShowCardDetails(!showCardDetails)
                                }
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
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              {t("profilepage.nfc.walletexpiryDate")}
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
                        <Button
                          variant="default"
                          className="block sm:hidden w-full"
                          onClick={() => {
                            // TODO: Add-to-wallet logic
                            toast({ title: "Wallet integration coming soon" });
                          }}
                        >
                          {t("profilepage.nfc.addToWallet")}
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
              </div>
              {!hasActiveNfcCard && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm z-10 text-center p-4">
                  <p className="text-foreground ">
                    {t("profilepage.nfc.notice")}
                  </p>
                </div>
              )}
            </div>
            {/* Account Settings */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    {t("profilepage.settingsTab.tab")}
                  </CardTitle>
                  <CardDescription className="mb-2">
                    {t("profilepage.settingsTab.description")}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">
                        {t("profilepage.settingsTab.fullName")}
                      </Label>
                      <Input id="fullName" defaultValue={userInfo.name} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        {t("profilepage.settingsTab.phone")}
                      </Label>
                      <Input id="phone" defaultValue={userInfo.phone} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        {t("profilepage.settingsTab.email")}
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        defaultValue={userInfo.email}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profileImage">
                        {t("profilepage.settingsTab.profileImage")}
                      </Label>
                      <div className="flex items-center space-x-2">
                        {/* Preview current or selected image */}
                        {profileImage && (
                          <img
                            src={userInfo.profileImage}
                            alt="Profile Preview"
                            className="w-24 h-24 rounded-full object-cover border"
                          />
                        )}

                        <Input
                          id="profileImage"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                const base64 = reader.result?.toString() || "";
                                setProfileImage(base64); // base64 string
                                localStorage.setItem(
                                  "userProfileImage",
                                  base64
                                );
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bloodType">
                        {t("profilepage.settingsTab.bloodType")}
                      </Label>
                      <select
                        id="bloodType"
                        className="w-full rounded-md border border-input bg-input px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        value={bloodType}
                        onChange={(e) => setBloodType(e.target.value)}
                      >
                        <option value="">
                          {t("profilepage.settingsTab.selectOption")}
                        </option>
                        <option value="A+">A+</option>
                        <option value="A-">A−</option>
                        <option value="B+">B+</option>
                        <option value="B-">B−</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB−</option>
                        <option value="O+">O+</option>
                        <option value="O-">O−</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact">
                        {t("profilepage.settingsTab.emergencyContact")}
                      </Label>
                      <Input
                        id="emergencyContact"
                        type="tel"
                        value={emergencyContact}
                        onChange={(e) => setEmergencyContact(e.target.value)}
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
                    <Button variant="gradient" onClick={handleSave}>
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
