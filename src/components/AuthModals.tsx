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

interface AuthModalsProps {
  isLoginOpen: boolean;
  isSignupOpen: boolean;
  onLoginClose: () => void;
  onSignupClose: () => void;
  onLoginSuccess?: () => void;
}

export const AuthModals: React.FC<AuthModalsProps> = ({
  isLoginOpen,
  isSignupOpen,
  onLoginClose,
  onSignupClose,
  onLoginSuccess,
}) => {
  const { toast } = useToast();
  const [showInterestDialog, setShowInterestDialog] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const interestOptions = [
    "Music",
    "Sports",
    "Tech",
    "Fashion",
    "Food",
    "Travel",
    "Fitness",
    "Art",
    "Gaming",
  ];

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
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
    });
    setErrors({});
  }, [isLoginOpen, isSignupOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.email) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Invalid email address.";

    if (!form.password) newErrors.password = "Password is required.";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";

    if (isSignupOpen) {
      if (!form.firstName) newErrors.firstName = "First name is required.";
      else if (form.firstName.length < 3)
        newErrors.firstName = "First name must be at least 3 characters.";

      if (!form.lastName) newErrors.lastName = "Last name is required.";
      else if (form.lastName.length < 3)
        newErrors.lastName = "Last name must be at least 3 characters.";

      if (!form.phone) newErrors.phone = "Phone number is required.";
      else if (!/^\+?\d{10,15}$/.test(form.phone))
        newErrors.phone = "Phone number must be valid (10–15 digits).";

      if (!form.confirmPassword)
        newErrors.confirmPassword = "Confirm your password.";
      else if (form.password !== form.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    // Simulate token storage
    localStorage.setItem("auth_token", "fake-token-" + Date.now());
    toast({
      title: isLoginOpen ? "Signed in" : "Signed up",
      description: `Welcome, ${form.email}`,
    });

    if (isLoginOpen) {
      onLoginSuccess?.();
      onLoginClose();
    } else {
      onSignupClose();
      setShowInterestDialog(true); // <-- Open interests dialog after signup
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
        placeholder={label}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
      />
      {errors[key] && <p className="text-sm text-red-500">{errors[key]}</p>}
    </div>
  );

  return (
    <>
      {/* Login Dialog */}
      <Dialog open={isLoginOpen} onOpenChange={onLoginClose}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Sign In</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {renderField("email", "Email", "email")}
            {renderField("password", "Password", "password")}
            <Button className="w-full" onClick={handleSubmit}>
              Sign In
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Signup Dialog */}
      <Dialog open={isSignupOpen} onOpenChange={onSignupClose}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Sign Up</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {renderField("firstName", "First Name")}
            {renderField("lastName", "Last Name")}
            {renderField("email", "Email", "email")}
            {renderField("phone", "Phone Number")}
            {renderField("password", "Password", "password")}
            {renderField("confirmPassword", "Confirm Password", "password")}
            <Button className="w-full" onClick={handleSubmit}>
              Sign Up
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={showInterestDialog}
        onOpenChange={() => setShowInterestDialog(false)}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Select Your Interests (Optional)</DialogTitle>
          </DialogHeader>
          <div className="flex flex-wrap gap-2">
            {interestOptions.map((tag) => (
              <Button
                key={tag}
                variant={
                  selectedInterests.includes(tag) ? "default" : "outline"
                }
                onClick={() =>
                  setSelectedInterests((prev) =>
                    prev.includes(tag)
                      ? prev.filter((t) => t !== tag)
                      : [...prev, tag]
                  )
                }
              >
                {tag}
              </Button>
            ))}
          </div>
          <Button
            className="w-full mt-4"
            onClick={() => {
              // Persist to backend if needed here
              setShowInterestDialog(false);
              toast({
                title: "Welcome!",
                description: "You're all set.",
              });
            }}
          >
            Continue
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};
