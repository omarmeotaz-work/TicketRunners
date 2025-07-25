import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  QrCode,
  CalendarPlus,
  Users,
  Calendar,
  Clock,
  MapPin,
  Heart,
  History,
  CreditCard,
  Smartphone,
  Eye,
  EyeOff,
  Download,
  Settings,
  Ticket,
} from "lucide-react";
import { InvoicePreview } from "@/components/invoicePreview";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import i18n from "@/lib/i18n";
import { OtpInput } from "@/components/ui/input-otp";
import { ProfileBookingsTab } from "./ProfileBookingsTab";
import { ProfileDependantsTab } from "./ProfileDependantsTab";
import { ProfileVisitsTab } from "./ProfileVisitsTab";
import { ProfileBillingTab } from "./ProfileBillingTab";
import { ProfileNfcTab } from "./ProfileNfcTab";
import { ProfileFavoritesTab } from "./ProfileFavoritesTab";
import { ProfileSettingsTab } from "./ProfileSettingsTab";

// Define the props interface based on Profile.tsx state/handlers
export interface ProfileTabsContentProps {
  t: (key: string, defaultValue?: string) => string;
  bookings: unknown[];
  dependants: unknown[];
  visits: unknown[];
  billingHistory: unknown[];
  favoriteEvents: unknown[];
  openFeedbackId: number | null;
  setOpenFeedbackId: (id: number | null) => void;
  feedbackText: string;
  setFeedbackText: (text: string) => void;
  handleSubmitFeedback: () => void;
  handleAddCalendar: (b: unknown) => void;
  handleViewDetails: (id: number) => void;
  userInfo: unknown;
  nfcCard: unknown;
  nfcCardStatus: string;
  hasActiveNfcCard: boolean;
  showCardDetails: boolean;
  setShowCardDetails: (show: boolean) => void;
  handleBuyNewCard: () => void;
  handleDeactivateCard: () => void;
  handleAddToWallet: () => void;
  addedToWallet: boolean;
  expiry: Date;
  isExpired: boolean;
  handleRenewTemporaryAccess: () => void;
  profileImage: string;
  setProfileImage: (img: string) => void;
  phone: string;
  setPhone: (phone: string) => void;
  phoneVerified: boolean;
  setPhoneVerified: (v: boolean) => void;
  handleSendPhoneOtp: () => void;
  email: string;
  setEmail: (email: string) => void;
  emailVerified: boolean;
  setEmailVerified: (v: boolean) => void;
  handleSendEmailOtp: () => void;
  oldPassword: string;
  setOldPassword: (v: string) => void;
  newPassword: string;
  setNewPassword: (v: string) => void;
  notifyEmail: boolean;
  setNotifyEmail: (v: boolean) => void;
  notifySMS: boolean;
  setNotifySMS: (v: boolean) => void;
  // ...add more as needed
}

export const ProfileTabsContent: React.FC<ProfileTabsContentProps> = (
  props
) => {
  const {
    t,
    bookings,
    dependants,
    visits,
    billingHistory,
    favoriteEvents,
    openFeedbackId,
    setOpenFeedbackId,
    feedbackText,
    setFeedbackText,
    handleSubmitFeedback,
    handleAddCalendar,
    handleViewDetails,
    userInfo,
    nfcCard,
    nfcCardStatus,
    hasActiveNfcCard,
    showCardDetails,
    setShowCardDetails,
    handleBuyNewCard,
    handleDeactivateCard,
    handleAddToWallet,
    addedToWallet,
    expiry,
    isExpired,
    handleRenewTemporaryAccess,
    profileImage,
    setProfileImage,
    phone,
    setPhone,
    phoneVerified,
    setPhoneVerified,
    handleSendPhoneOtp,
    email,
    setEmail,
    emailVerified,
    setEmailVerified,
    handleSendEmailOtp,
    oldPassword,
    setOldPassword,
    newPassword,
    setNewPassword,
    notifyEmail,
    setNotifyEmail,
    notifySMS,
    setNotifySMS,
  } = props;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const firstName = (userInfo as any).name.split(" ")[0];
  const [showCountdown, setShowCountdown] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>("");

  // Add state for settings fields
  const [bloodType, setBloodType] = useState((userInfo as any).bloodType || "");
  const [emergencyContact, setEmergencyContact] = useState(
    (userInfo as any).emergencyContact || ""
  );
  const [emergencyContactName, setEmergencyContactName] = useState(
    (userInfo as any).emergencyContactName || ""
  );
  const [passwordOtp, setPasswordOtp] = useState("");
  const [passwordOtpSent, setPasswordOtpSent] = useState(false);
  const [passwordOtpVerified, setPasswordOtpVerified] = useState(false);
  const [passwordOtpError, setPasswordOtpError] = useState("");
  // Notification preferences
  // const [notifyEmail, setNotifyEmail] = useState(true);
  // const [notifySMS, setNotifySMS] = useState(false);
  const [notificationWarning, setNotificationWarning] = useState("");
  // NFC card deactivation state
  const [isCardDeactivated, setIsCardDeactivated] = useState(false);

  // Add modal state for each verification
  const [showPhoneOtpModal, setShowPhoneOtpModal] = useState(false);
  const [showEmailOtpModal, setShowEmailOtpModal] = useState(false);
  const [showPasswordOtpModal, setShowPasswordOtpModal] = useState(false);

  // Simulate sending OTP
  const handleSendPasswordOtp = () => {
    setPasswordOtpSent(true);
    setPasswordOtpError("");
    setPasswordOtp("123456"); // Simulated OTP
  };
  // Simulate verifying OTP
  const handleVerifyPasswordOtp = () => {
    if (passwordOtp === "123456") {
      setPasswordOtpVerified(true);
      setPasswordOtpError("");
    } else {
      setPasswordOtpError(
        t("profilepage.settingsTab.otpInvalid", "Invalid OTP")
      );
    }
  };
  // Simulate save
  const handleSettingsSave = () => {
    // Save logic here (API call, etc.)
    // Reset OTP state
    setPasswordOtpSent(false);
    setPasswordOtpVerified(false);
    setPasswordOtp("");
    setOldPassword("");
    setNewPassword("");
  };

  // Helper to calculate time left (localized)
  const calculateTimeLeft = () => {
    if (!expiry) return "";
    const now = new Date();
    const diff = expiry.getTime() - now.getTime();
    if (diff <= 0) return "";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    // Use t for timer format, e.g. t('wallet.timer', {days, hours, minutes, seconds})
    return t("wallet.timer", {
      days,
      hours: hours.toString().padStart(2, "0"),
      minutes: minutes.toString().padStart(2, "0"),
      seconds: seconds.toString().padStart(2, "0"),
    } as any);
  };

  // Helper for localized date
  const formatDate = (date: Date | string) => {
    if (!date) return "";
    const d = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat(i18n.language, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(d);
  };

  useEffect(() => {
    if (!showCountdown) return;
    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => {
      const left = calculateTimeLeft();
      setTimeLeft(left);
      if (!left) setShowCountdown(false);
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCountdown, expiry]);

  const isRTL = i18n.language && i18n.language.startsWith("ar");
  return (
    <div dir={isRTL ? "rtl" : undefined}>
      {/* My Bookings */}
      <ProfileBookingsTab {...props} formatDate={formatDate} />
      {/* Dependent Tickets Section */}
      <ProfileDependantsTab {...props} formatDate={formatDate} />
      {/* My Visits */}
      <ProfileVisitsTab {...props} formatDate={formatDate} />
      {/* Billing History */}
      <ProfileBillingTab {...props} formatDate={formatDate} />
      {/* NFC Card */}
      <ProfileNfcTab
        {...props}
        formatDate={formatDate}
        isCardDeactivated={isCardDeactivated}
        setIsCardDeactivated={setIsCardDeactivated}
        showCountdown={showCountdown}
        setShowCountdown={setShowCountdown}
        timeLeft={timeLeft}
      />
      {/* Favorite Events */}
      <ProfileFavoritesTab {...props} />
      {/* Account Settings */}
      <ProfileSettingsTab {...props} />
    </div>
  );
};
