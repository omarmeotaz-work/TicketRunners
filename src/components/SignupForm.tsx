import React from "react";
import { Button } from "@/components/ui/button";

interface SignupFormProps {
  onClose: () => void;
  onSwitchToLogin: () => void;
  onSignupSuccess: (user: string) => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({
  onClose,
  onSwitchToLogin,
  onSignupSuccess,
}) => {
  const handleSignup = () => {
    // TODO: Implement signup logic
    const fakeUserId = "user_123";
    onSignupSuccess(fakeUserId);
    onClose();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Sign Up</h2>
      {/* Replace with real form fields */}
      <Button onClick={handleSignup}>Create Account</Button>
      <p>
        Already have an account?{" "}
        <button className="underline" onClick={onSwitchToLogin}>
          Log in
        </button>
      </p>
    </div>
  );
};
