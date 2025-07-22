import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface CardExpiredModalProps {
  open: boolean;
  onClose: () => void;
}

export const CardExpiredModal = ({ open, onClose }: CardExpiredModalProps) => {
  const navigate = useNavigate();

  const handleRenewClick = () => {
    onClose(); // Close the modal
    navigate("/profile#nfc"); // Navigate to renewal page
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Access Card Expired</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground mb-4">
          Your access card has expired. Please renew your card now.
        </p>
        <Button onClick={handleRenewClick}>Renew Now</Button>
      </DialogContent>
    </Dialog>
  );
};
