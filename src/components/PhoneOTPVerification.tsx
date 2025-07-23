import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Smartphone, CheckCircle, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

interface PhoneOTPVerificationProps {
  initialPhone?: string;
  onVerificationSuccess?: (phone: string) => void;
  onPhoneChange?: (phone: string) => void;
}

export const PhoneOTPVerification: React.FC<PhoneOTPVerificationProps> = ({
  initialPhone = "",
  onVerificationSuccess,
  onPhoneChange,
}) => {
  const { t } = useTranslation();
  const [phone, setPhone] = useState(initialPhone);
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handlePhoneChange = (value: string) => {
    setPhone(value);
    onPhoneChange?.(value);
    // Reset verification state when phone changes
    if (value !== initialPhone) {
      setIsOtpSent(false);
      setIsVerified(false);
      setOtp("");
    }
  };

  const handleSendOTP = async () => {
    if (!phone.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call to send OTP
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setIsOtpSent(true);
      setCountdown(60); // 60 seconds countdown
      toast({
        title: "OTP Sent",
        description: `Verification code sent to ${phone}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter the complete 6-digit code",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call to verify OTP
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any 6-digit code
      setIsVerified(true);
      onVerificationSuccess?.(phone);
      toast({
        title: "Phone Verified",
        description: "Your phone number has been successfully verified",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = () => {
    if (countdown === 0) {
      handleSendOTP();
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="phone" className="flex items-center gap-2">
          <Smartphone className="h-4 w-4" />
          Phone Number
          {isVerified && (
            <CheckCircle className="h-4 w-4 text-green-500" />
          )}
        </Label>
        <div className="flex gap-2">
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            placeholder="+20 123 456 7890"
            disabled={isVerified}
            className={isVerified ? "bg-green-50 border-green-200" : ""}
          />
          {!isVerified && (
            <Button
              onClick={handleSendOTP}
              disabled={isLoading || countdown > 0}
              variant="outline"
              className="whitespace-nowrap"
            >
              {isLoading ? (
                "Sending..."
              ) : countdown > 0 ? (
                `Resend (${countdown}s)`
              ) : isOtpSent ? (
                "Resend OTP"
              ) : (
                "Send OTP"
              )}
            </Button>
          )}
        </div>
      </div>

      {isOtpSent && !isVerified && (
        <div className="space-y-4 p-4 bg-muted/20 rounded-lg border">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Enter Verification Code
            </Label>
            <p className="text-sm text-muted-foreground">
              We've sent a 6-digit code to {phone}
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>

            <div className="flex gap-2">
              <Button
                onClick={handleVerifyOTP}
                disabled={isLoading || otp.length !== 6}
                className="min-w-[100px]"
              >
                {isLoading ? "Verifying..." : "Verify"}
              </Button>
              
              {countdown === 0 && (
                <Button
                  onClick={handleResendOTP}
                  variant="ghost"
                  size="sm"
                >
                  Resend Code
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {isVerified && (
        <div className="flex items-center gap-2 text-green-600 text-sm">
          <CheckCircle className="h-4 w-4" />
          Phone number verified successfully
        </div>
      )}
    </div>
  );
};