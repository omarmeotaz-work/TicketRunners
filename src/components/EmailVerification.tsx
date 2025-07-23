import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Mail, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface EmailVerificationProps {
  initialEmail?: string;
  onVerificationSuccess?: (email: string) => void;
  onEmailChange?: (email: string) => void;
}

export const EmailVerification: React.FC<EmailVerificationProps> = ({
  initialEmail = "",
  onVerificationSuccess,
  onEmailChange,
}) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState(initialEmail);
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const checkVerificationStatus = useCallback(async () => {
    if (isCheckingStatus) return;
    
    setIsCheckingStatus(true);
    try {
      // Simulate API call to check verification status
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // For demo purposes, randomly verify after some time
      const shouldVerify = Math.random() > 0.7; // 30% chance each check
      if (shouldVerify) {
        setIsVerified(true);
        onVerificationSuccess?.(email);
        toast({
          title: "Email Verified",
          description: "Your email address has been successfully verified",
        });
      }
    } catch (error) {
      console.error("Error checking verification status:", error);
    } finally {
      setIsCheckingStatus(false);
    }
  }, [isCheckingStatus, email, onVerificationSuccess]);

  // Simulate checking verification status periodically
  useEffect(() => {
    let statusChecker: NodeJS.Timeout;
    if (isVerificationSent && !isVerified) {
      statusChecker = setInterval(() => {
        checkVerificationStatus();
      }, 5000); // Check every 5 seconds
    }
    return () => clearInterval(statusChecker);
  }, [isVerificationSent, isVerified, checkVerificationStatus]);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    onEmailChange?.(value);
    // Reset verification state when email changes
    if (value !== initialEmail) {
      setIsVerificationSent(false);
      setIsVerified(false);
    }
  };

  const handleSendVerification = async () => {
    if (!email.trim() || !isValidEmail(email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call to send verification email
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setIsVerificationSent(true);
      setCountdown(60); // 60 seconds countdown
      toast({
        title: "Verification Email Sent",
        description: `Please check your inbox at ${email}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send verification email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualCheck = () => {
    checkVerificationStatus();
  };

  const handleResendVerification = () => {
    if (countdown === 0) {
      handleSendVerification();
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Email Address
          {isVerified && (
            <CheckCircle className="h-4 w-4 text-green-500" />
          )}
        </Label>
        <div className="flex gap-2">
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
            placeholder="user@example.com"
            disabled={isVerified}
            className={isVerified ? "bg-green-50 border-green-200" : ""}
          />
          {!isVerified && (
            <Button
              onClick={handleSendVerification}
              disabled={isLoading || countdown > 0}
              variant="outline"
              className="whitespace-nowrap"
            >
              {isLoading ? (
                "Sending..."
              ) : countdown > 0 ? (
                `Resend (${countdown}s)`
              ) : isVerificationSent ? (
                "Resend Email"
              ) : (
                "Send Verification"
              )}
            </Button>
          )}
        </div>
      </div>

      {isVerificationSent && !isVerified && (
        <div className="space-y-4 p-4 bg-muted/20 rounded-lg border">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Verification Pending
            </Label>
            <p className="text-sm text-muted-foreground">
              We've sent a verification link to <strong>{email}</strong>. 
              Please check your inbox and click the link to verify your email address.
            </p>
          </div>

          <div className="flex items-center gap-2 text-amber-600 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>Don't forget to check your spam folder</span>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleManualCheck}
              disabled={isCheckingStatus}
              variant="outline"
              size="sm"
            >
              {isCheckingStatus ? "Checking..." : "Check Status"}
            </Button>
            
            {countdown === 0 && (
              <Button
                onClick={handleResendVerification}
                variant="ghost"
                size="sm"
              >
                Resend Email
              </Button>
            )}
          </div>

          <div className="text-xs text-muted-foreground">
            {isCheckingStatus && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                Automatically checking verification status...
              </div>
            )}
          </div>
        </div>
      )}

      {isVerified && (
        <div className="flex items-center gap-2 text-green-600 text-sm">
          <CheckCircle className="h-4 w-4" />
          Email address verified successfully
        </div>
      )}
    </div>
  );
};