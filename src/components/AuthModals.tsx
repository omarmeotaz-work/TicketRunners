import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/Contexts/AuthContext";
import { ProfileCompletionModal } from "./ui/profileCompletionModal";
import { CardExpiredModal } from "./ExpiredCardModals";

interface AuthModalsProps {
  onLoginSuccess?: () => void;
}

export const AuthModals: React.FC<AuthModalsProps> = ({ onLoginSuccess }) => {
  const { isLoginOpen, isSignupOpen, closeLogin, closeSignup, login } =
    useAuth();

  const { toast } = useToast();
  const { t } = useTranslation();
  const [isSignup, setIsSignup] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [showCardExpiredModal, setShowCardExpiredModal] = useState(false);

  const checkCardExpiration = () => {
    const isExpired = true; // Replace this with real check
    if (isExpired) {
      setShowCardExpiredModal(true);
    }
  };

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setIsSignup(isSignupOpen);
  }, [isSignupOpen, isLoginOpen]);

  useEffect(() => {
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
    });
    setErrors({});
  }, [isSignup]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.email) newErrors.email = t("auth.errors.email_required");
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = t("auth.errors.email_invalid");

    if (!form.password) newErrors.password = t("auth.errors.password_required");
    else if (form.password.length < 6)
      newErrors.password = t("auth.errors.password_min");

    if (isSignup) {
      if (!form.firstName)
        newErrors.firstName = t("auth.errors.first_name_required");
      else if (form.firstName.length < 3)
        newErrors.firstName = t("auth.errors.first_name_min");

      if (!form.lastName)
        newErrors.lastName = t("auth.errors.last_name_required");
      else if (form.lastName.length < 3)
        newErrors.lastName = t("auth.errors.last_name_min");

      if (!form.phone) newErrors.phone = t("auth.errors.phone_required");
      else if (!/^\+?\d{10,15}$/.test(form.phone))
        newErrors.phone = t("auth.errors.phone_invalid");

      if (!form.confirmPassword)
        newErrors.confirmPassword = t("auth.errors.confirm_password_required");
      else if (form.password !== form.confirmPassword)
        newErrors.confirmPassword = t("auth.errors.confirm_password_mismatch");
      if (isSignup && !otpVerified) {
        newErrors.phone = t("auth.errors.phone_not_verified");
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendOtp = async () => {
    if (!form.phone || !/^\+?\d{10,15}$/.test(form.phone)) {
      setErrors((prev) => ({ ...prev, phone: t("auth.errors.phone_invalid") }));
      return;
    }
    setOtpSent(true);
    setOtpError("");
    toast({ title: t("auth.otp_sent"), description: form.phone });
    // await api.sendOtp(form.phone);
  };

  const verifyOtp = async () => {
    // Simulated OTP verification
    if (otp === "123456") {
      setOtpVerified(true);
      setOtpError("");
      toast({ title: t("auth.otp_verified") });
    } else {
      setOtpError(t("auth.errors.otp_invalid"));
    }
  };

  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleSuccessfulSignup = () => {
    const token = "fake-token-" + Date.now();
    localStorage.setItem("auth_token", token);
    login(token);
    closeSignup();
    setShowProfileModal(true); // trigger profile modal
  };

  const handleSubmit = () => {
    if (!validate()) return;

    // Replace with actual backend call
    localStorage.setItem("auth_token", "fake-token-" + Date.now());
    toast({
      title: isSignup ? t("auth.sign_up") : t("auth.sign_in"),
      description: `${t("auth.welcome")}, ${form.email}`,
    });

    if (isSignup) {
      handleSuccessfulSignup();
    } else {
      const token = "fake-token-" + Date.now();
      localStorage.setItem("auth_token", token);
      login(token);
      onLoginSuccess?.();
      checkCardExpiration();
      closeLogin();
    }
  };

  const renderField = (
    key: keyof typeof form,
    label: string,
    type: "text" | "email" | "password" = "text"
  ) => (
    <div className="space-y-1">
      <Input
        type={type}
        value={form[key] ?? ""}
        placeholder={t(`auth.placeholders.${key}`, label)}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        autoComplete="off"
      />
      {errors[key] && <p className="text-sm text-red-500">{errors[key]}</p>}
    </div>
  );

  const handleClose = () => {
    setIsSignup(false);
    closeLogin();
    closeSignup();
  };

  return (
    <Dialog open={isLoginOpen || isSignupOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">
            {isSignup ? t("auth.sign_up") : t("auth.sign_in")}
          </DialogTitle>
        </DialogHeader>

        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          {isSignup && (
            <>
              {renderField("firstName", t("auth.first_name"))}
              {renderField("lastName", t("auth.last_name"))}
              {renderField("phone", t("auth.phone_number"))}

              {!otpVerified && (
                <div className="flex gap-2">
                  <Button type="button" size="sm" onClick={sendOtp}>
                    {otpSent ? t("auth.resend_otp") : t("auth.verify")}
                  </Button>
                </div>
              )}

              {otpSent && !otpVerified && (
                <div className="space-y-1 mt-2">
                  <Input
                    type="text"
                    value={otp}
                    placeholder={t("auth.placeholders.otp")}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  {otpError && (
                    <p className="text-sm text-red-500">{otpError}</p>
                  )}
                  <Button type="button" size="sm" onClick={verifyOtp}>
                    {t("auth.verify_otp")}
                  </Button>
                </div>
              )}
            </>
          )}
          {renderField("email", t("auth.email"), "email")}
          {renderField("password", t("auth.password"), "password")}
          {isSignup &&
            renderField(
              "confirmPassword",
              t("auth.confirm_password"),
              "password"
            )}

          <Button className="w-full mt-4" type="submit">
            {t("auth.continue")}
          </Button>
        </form>

        <div className="text-sm text-center mt-2">
          {isSignup ? (
            <>
              {t("auth.already_account")}{" "}
              <button
                className="underline text-primary"
                onClick={() => setIsSignup(false)}
              >
                {t("auth.sign_in")}
              </button>
            </>
          ) : (
            <>
              {t("auth.no_account")}{" "}
              <button
                className="underline text-primary"
                onClick={() => setIsSignup(true)}
              >
                {t("auth.sign_up")}
              </button>
            </>
          )}
        </div>
      </DialogContent>
      <ProfileCompletionModal
        open={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
      <CardExpiredModal
        open={showCardExpiredModal}
        onClose={() => setShowCardExpiredModal(false)}
      />
    </Dialog>
  );
};
