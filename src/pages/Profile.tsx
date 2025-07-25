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
  Heart,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { InvoicePreview } from "@/components/invoicePreview";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Toast } from "@/components/ui/toast";
import { format, isBefore, parseISO } from "date-fns";
import { ProfileTabsNav } from "@/components/ProfileTabsNav";
import { ProfileTabsContent } from "@/components/ProfileTabsContent";
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
    id: "AB12345",
    name: "Ahmed Mohamed Hassan",
    phone: "+20 123 456 7890",
    email: "ahmed.mohamed@example.com",
    emergencyContact: "01100777223",
    emergencyContactName: "ahmed",
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
  const [emergencyContactName, setEmergencyContactName] = useState(
    userInfo.emergencyContactName || ""
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
  const dependants = [
    {
      id: 1,
      eventTitle: "Cairo Jazz Festival 2024",
      date: "2024-02-15",
      time: "20:00",
      location: "Cairo Opera House",
      ticketPrice: 250,
      quantity: 2,
      qrEnabled: true,
      status: "pending",
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
      status: "claimed",
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
    isVirtual: true, // distinguish between physical and virtual
  };

  const [addedToWallet, setAddedToWallet] = useState(false);
  const now = new Date();
  const expiry = parseISO(nfcCard.expiryDate);
  const isExpired = isBefore(expiry, now);
  // ③ whenever the tab changes, push the new hash to the URL (nice for reload / share)
  const navigate = useNavigate();

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [mockOtp, setMockOtp] = useState("");

  // Trigger when user updates phone
  const handlePhoneSave = () => {
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setMockOtp(generatedOtp);
    console.log("OTP sent (mock):", generatedOtp);
    setShowOtpModal(true);
  };

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
  const handleRenewTemporaryAccess = () => {
    toast({
      title: "Temporary Access Renewal",
      description: "Your request to renew temporary access has been submitted.",
      variant: "default", // You can use "destructive" or "success" if your UI supports it
      duration: 4000, // Optional: time in ms the toast is shown
    });
  };

  const handleSave = () => {
    if (newPassword && !passwordOtpVerified) {
      toast({
        title: "Please verify your new password before saving.",
        variant: "destructive",
      });
      return;
    }
    localStorage.setItem("userProfile", JSON.stringify(profile));
    alert("Profile saved locally.");
  };

  const handleAddToWallet = () => {
    // Add any actual logic here (e.g. Apple/Google Wallet API)
    setAddedToWallet(true);
  };

  const [phone, setPhone] = useState(userInfo.phone);
  const [email, setEmail] = useState(userInfo.email);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [showPhoneOtpModal, setShowPhoneOtpModal] = useState(false);
  const [showEmailOtpModal, setShowEmailOtpModal] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState("");
  const [enteredPhoneOtp, setEnteredPhoneOtp] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [enteredEmailOtp, setEnteredEmailOtp] = useState("");

  const handleSendPhoneOtp = () => {
    const generated = Math.floor(100000 + Math.random() * 900000).toString();
    setPhoneOtp(generated);
    setShowPhoneOtpModal(true);
    toast({ title: "OTP sent (mock)", description: generated });
  };
  const handleVerifyPhoneOtp = () => {
    if (enteredPhoneOtp === phoneOtp) {
      setPhoneVerified(true);
      setShowPhoneOtpModal(false);
      toast({ title: "Phone verified!" });
    } else {
      toast({ title: "Incorrect OTP", variant: "destructive" });
    }
  };
  const handleSendEmailOtp = () => {
    const generated = Math.floor(100000 + Math.random() * 900000).toString();
    setEmailOtp(generated);
    setShowEmailOtpModal(true);
    toast({ title: "Verification code sent (mock)", description: generated });
  };
  const handleVerifyEmailOtp = () => {
    if (enteredEmailOtp === emailOtp) {
      setEmailVerified(true);
      setShowEmailOtpModal(false);
      toast({ title: "Email verified!" });
    } else {
      toast({ title: "Incorrect code", variant: "destructive" });
    }
  };

  // Add state for password OTP verification
  const [showPasswordOtpModal, setShowPasswordOtpModal] = useState(false);
  const [passwordOtp, setPasswordOtp] = useState("");
  const [enteredPasswordOtp, setEnteredPasswordOtp] = useState("");
  const [passwordOtpVerified, setPasswordOtpVerified] = useState(false);

  const handleSendPasswordOtp = () => {
    const generated = Math.floor(100000 + Math.random() * 900000).toString();
    setPasswordOtp(generated);
    setShowPasswordOtpModal(true);
    toast({ title: "Verification code sent (mock)", description: generated });
  };
  const handleVerifyPasswordOtp = () => {
    if (enteredPasswordOtp === passwordOtp) {
      setPasswordOtpVerified(true);
      setShowPasswordOtpModal(false);
      toast({ title: "Password change verified!" });
    } else {
      toast({ title: "Incorrect code", variant: "destructive" });
    }
  };

  // Add state for password fields
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Add state for notification preferences
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifySMS, setNotifySMS] = useState(true);

  // Add state for NFC card status
  const [nfcCardStatus, setNfcCardStatus] = useState(nfcCard.status);

  // NFC Card button handlers
  const handleBuyNewCard = () => {
    // Navigate to the dedicated NFC card payment page
    navigate("/nfc-card-payment");
  };
  const handleDeactivateCard = () => {
    setNfcCardStatus("Inactive");
    toast({
      title: "NFC Card Deactivated",
      description: "Your NFC card is now inactive.",
    });
  };

  // Mock favorite events (replace with localStorage or API as needed)
  const [favoriteEvents, setFavoriteEvents] = useState(() => {
    const stored = localStorage.getItem("favoriteEvents");
    return stored
      ? JSON.parse(stored)
      : [
          {
            id: 101,
            eventTitle_en: "Cairo Jazz Festival 2025",
            eventTitle_ar: "مهرجان القاهرة للجاز 2025",
            date: "2025-07-15",
            time: "19:00",
            location_en: "El Sawy Culturewheel",
            location_ar: "ساقية الصاوي",
            image: "/public/event1.jpg",
          },
          {
            id: 102,
            eventTitle_en: "Art Expo 2025",
            eventTitle_ar: "معرض الفن 2025",
            date: "2025-08-10",
            time: "17:00",
            location_en: "Cairo Exhibition Center",
            location_ar: "مركز القاهرة للمعارض",
            image: "/public/event2.jpg",
          },
        ];
  });

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
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <ProfileTabsNav
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              t={t as (key: string, defaultValue?: string) => string}
            />
            <ProfileTabsContent
              t={t as (key: string, defaultValue?: string) => string}
              bookings={bookings}
              dependants={dependants}
              visits={visits}
              billingHistory={billingHistory}
              favoriteEvents={favoriteEvents}
              openFeedbackId={openFeedbackId}
              setOpenFeedbackId={setOpenFeedbackId}
              feedbackText={feedbackText}
              setFeedbackText={setFeedbackText}
              handleSubmitFeedback={handleSubmitFeedback}
              handleAddCalendar={handleAddCalendar}
              handleViewDetails={handleViewDetails}
              userInfo={userInfo}
              nfcCard={nfcCard}
              nfcCardStatus={nfcCardStatus}
              hasActiveNfcCard={hasActiveNfcCard}
              showCardDetails={showCardDetails}
              setShowCardDetails={setShowCardDetails}
              handleBuyNewCard={handleBuyNewCard}
              handleDeactivateCard={handleDeactivateCard}
              handleAddToWallet={handleAddToWallet}
              addedToWallet={addedToWallet}
              expiry={expiry}
              isExpired={isExpired}
              handleRenewTemporaryAccess={handleRenewTemporaryAccess}
              profileImage={profileImage}
              setProfileImage={setProfileImage}
              phone={phone}
              setPhone={setPhone}
              phoneVerified={phoneVerified}
              setPhoneVerified={setPhoneVerified}
              handleSendPhoneOtp={handleSendPhoneOtp}
              email={email}
              setEmail={setEmail}
              emailVerified={emailVerified}
              setEmailVerified={setEmailVerified}
              handleSendEmailOtp={handleSendEmailOtp}
              oldPassword={oldPassword}
              setOldPassword={setOldPassword}
              newPassword={newPassword}
              setNewPassword={setNewPassword}
              notifyEmail={notifyEmail}
              setNotifyEmail={setNotifyEmail}
              notifySMS={notifySMS}
              setNotifySMS={setNotifySMS}
            />
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Profile;
