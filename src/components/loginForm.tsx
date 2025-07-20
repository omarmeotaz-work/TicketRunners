import React from "react";
import { Button } from "@/components/ui/button";

interface LoginFormProps {
  onClose: () => void;
  onSwitchToSignup: () => void;
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onClose,
  onSwitchToSignup,
  onSuccess,
}) => {
  const handleLogin = () => {
    // TODO: Implement login logic
    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Login</h2>
      {/* Replace with real form fields */}
      <Button onClick={handleLogin}>Login</Button>
      <p>
        Don’t have an account?{" "}
        <button className="underline" onClick={onSwitchToSignup}>
          Sign up
        </button>
      </p>
    </div>
  );
};
