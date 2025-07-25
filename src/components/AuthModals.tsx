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

import { OTPInputContext } from "input-otp";
import ReCAPTCHA from "react-google-recaptcha";
import { OtpInput } from "@/components/ui/input-otp";

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
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [emailOtpVerified, setEmailOtpVerified] = useState(false);
  const [emailOtpError, setEmailOtpError] = useState("");
  const [showPhoneOtpModal, setShowPhoneOtpModal] = useState(false);
  const [enteredPhoneOtp, setEnteredPhoneOtp] = useState("");
  const [showEmailOtpModal, setShowEmailOtpModal] = useState(false);
  const [enteredEmailOtp, setEnteredEmailOtp] = useState("");

  // Add state for login identifier
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginError, setLoginError] = useState("");

  // Add state for captcha
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaError, setCaptchaError] = useState("");
  const recaptchaSiteKey = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";

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

  // Update validation for login (not signup)
  const validateLogin = () => {
    if (!loginIdentifier) {
      setLoginError(t("auth.errors.email_or_phone_required"));
      return false;
    }
    const isEmail = /\S+@\S+\.\S+/.test(loginIdentifier);
    const isPhone = /^\+?\d{10,15}$/.test(loginIdentifier);
    if (!isEmail && !isPhone) {
      setLoginError(t("auth.errors.email_or_phone_invalid"));
      return false;
    }
    setLoginError("");
    return true;
  };

  const sendOtp = async () => {
    if (!form.phone || !/^\+?\d{10,15}$/.test(form.phone)) {
      setErrors((prev) => ({ ...prev, phone: t("auth.errors.phone_invalid") }));
      return;
    }
    setOtpSent(true);
    setOtpError("");
    setShowPhoneOtpModal(true);
    toast({ title: t("auth.otp_sent"), description: form.phone });
    // await api.sendOtp(form.phone);
  };
  const verifyOtp = async () => {
    // Simulated OTP verification
    if (enteredPhoneOtp === "123456") {
      setOtpVerified(true);
      setOtpError("");
      setShowPhoneOtpModal(false);
      toast({ title: t("auth.otp_verified") });
    } else {
      setOtpError(t("auth.errors.otp_invalid"));
    }
  };
  const sendEmailOtp = async () => {
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) {
      setErrors((prev) => ({
        ...prev,
        email: t("auth.errors.email_invalid"),
      }));
      return;
    }
    setEmailOtpSent(true);
    setEmailOtpError("");
    setShowEmailOtpModal(true);
    toast({ title: t("auth.otp_sent"), description: form.email });
    // TODO: await api.sendEmailOtp(form.email);
  };
  const verifyEmailOtp = async () => {
    // Simulate
    if (enteredEmailOtp === "123456") {
      setEmailOtpVerified(true);
      setEmailOtpError("");
      setShowEmailOtpModal(false);
      toast({ title: t("auth.otp_verified") });
    } else {
      setEmailOtpError(t("auth.errors.otp_invalid"));
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
    if (!captchaToken) {
      setCaptchaError(
        t("auth.errors.captcha_required") || "Please complete the captcha."
      );
      return;
    }
    setCaptchaError("");
    if (isSignup) {
      if (!validate()) return;
      // Replace with actual backend call
      localStorage.setItem("auth_token", "fake-token-" + Date.now());
      toast({
        title: t("auth.sign_up"),
        description: `${t("auth.welcome")}, ${form.email}`,
      });
      handleSuccessfulSignup();
    } else {
      if (!validateLogin()) return;
      // Replace with actual backend call
      localStorage.setItem("auth_token", "fake-token-" + Date.now());
      toast({
        title: t("auth.sign_in"),
        description: `${t("auth.welcome")}, ${loginIdentifier}`,
      });
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
    type: "text" | "email" | "password" = "text",
    disabled: boolean = false
  ) => (
    <div className="space-y-1">
      <Input
        type={type}
        value={form[key] ?? ""}
        placeholder={t(`auth.placeholders.${key}`, label)}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        autoComplete="off"
        disabled={disabled}
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

              {/* Phone field + verify */}
              <div className="relative mb-2">
                <Input
                  type="text"
                  value={form.phone}
                  placeholder={t(
                    "auth.placeholders.phone",
                    t("auth.phone_number")
                  )}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  autoComplete="off"
                  disabled={otpVerified}
                  className="pr-24"
                />
                {!otpVerified && (
                  <Button
                    type="button"
                    size="sm"
                    onClick={sendOtp}
                    className="absolute top-1/2 right-2 h-7 px-3"
                    style={{ minWidth: 70, transform: "translateY(-50%)" }}
                  >
                    {otpSent ? t("auth.resend_otp") : t("auth.verify")}
                  </Button>
                )}
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone}</p>
                )}
              </div>
              {/* OTP Modal for phone */}
              {showPhoneOtpModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                  <div className="bg-white rounded-lg p-6 max-w-xs w-full">
                    <h2 className="text-lg font-semibold mb-4">
                      {t("auth.enter_otp")}
                    </h2>
                    <OtpInput
                      value={enteredPhoneOtp}
                      onChange={setEnteredPhoneOtp}
                      autoFocus
                    />
                    {otpError && (
                      <p className="text-sm text-red-500">{otpError}</p>
                    )}
                    <Button className="w-full mt-2" onClick={verifyOtp}>
                      {t("auth.verify_otp")}
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full mt-2"
                      onClick={() => setShowPhoneOtpModal(false)}
                    >
                      {t("auth.cancel")}
                    </Button>
                  </div>
                </div>
              )}

              {/* Email field + verify */}
              <div className="relative mb-2">
                <Input
                  type="email"
                  value={form.email}
                  placeholder={t("auth.placeholders.email", t("auth.email"))}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  autoComplete="off"
                  disabled={emailOtpVerified}
                  className="pr-24"
                />
                {!emailOtpVerified && (
                  <Button
                    type="button"
                    size="sm"
                    onClick={sendEmailOtp}
                    className="absolute top-1/2 right-2 h-7 px-3"
                    style={{ minWidth: 70, transform: "translateY(-50%)" }}
                  >
                    {emailOtpSent ? t("auth.resend_otp") : t("auth.verify")}
                  </Button>
                )}
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>
              {/* OTP Modal for email */}
              {showEmailOtpModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                  <div className="bg-white rounded-lg p-6 max-w-xs w-full">
                    <h2 className="text-lg font-semibold mb-4">
                      {t("auth.enter_otp")}
                    </h2>
                    <OtpInput
                      value={enteredEmailOtp}
                      onChange={setEnteredEmailOtp}
                      autoFocus
                    />
                    {emailOtpError && (
                      <p className="text-sm text-red-500">{emailOtpError}</p>
                    )}
                    <Button className="w-full mt-2" onClick={verifyEmailOtp}>
                      {t("auth.verify_otp")}
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full mt-2"
                      onClick={() => setShowEmailOtpModal(false)}
                    >
                      {t("auth.cancel")}
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}

          {!isSignup && (
            <div className="space-y-1">
              <Input
                type="text"
                value={loginIdentifier}
                placeholder={t(
                  "auth.placeholders.email_or_phone",
                  "Email or Mobile Number"
                )}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                autoComplete="off"
              />
              {loginError && (
                <p className="text-sm text-red-500">{loginError}</p>
              )}
            </div>
          )}

          {renderField("password", t("auth.password"), "password")}

          {isSignup &&
            renderField(
              "confirmPassword",
              t("auth.confirm_password"),
              "password"
            )}

          <ReCAPTCHA
            sitekey={recaptchaSiteKey}
            onChange={(token) => setCaptchaToken(token || "")}
            className="my-2"
          />
          {captchaError && (
            <p className="text-sm text-red-500">{captchaError}</p>
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
