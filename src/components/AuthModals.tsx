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

interface AuthModalsProps {
  onLoginSuccess?: () => void;
}

export const AuthModals: React.FC<AuthModalsProps> = ({ onLoginSuccess }) => {
  const { isLoginOpen, isSignupOpen, closeLogin, closeSignup, login } =
    useAuth();

  const { toast } = useToast();
  const { t } = useTranslation();
  const [isSignup, setIsSignup] = useState(false);

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
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
      const token = "fake-token-" + Date.now(); // or from API response
      localStorage.setItem("auth_token", token);
      login(token);
      closeSignup();
    } else {
      const token = "fake-token-" + Date.now();
      localStorage.setItem("auth_token", token);
      login(token);
      onLoginSuccess?.();
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
    </Dialog>
  );
};
