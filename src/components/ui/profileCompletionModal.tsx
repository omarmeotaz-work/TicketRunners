import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";

interface Props {
  open: boolean;
  onClose: () => void;
}

export const ProfileCompletionModal: React.FC<Props> = ({ open, onClose }) => {
  const { t } = useTranslation();
  const { toast } = useToast();

  const [image, setImage] = useState<File | null>(null);
  const [bloodType, setBloodType] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");

  const handleSubmit = () => {
    if (!image) {
      toast({ title: t("profileSetup.errors.image_required") });
      return;
    }

    // Submit logic here (blood type and emergency contact info are optional)
    toast({ title: t("profileSetup.submitted") });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-center">
            {t("profileSetup.complete_profile")}
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground mb-3">
          {t("profileSetup.image_disclaimer")}
        </p>

        <div className="space-y-3">
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />

          <Select onValueChange={setBloodType}>
            <SelectTrigger>
              <SelectValue placeholder={t("profileSetup.select_blood_type")} />
            </SelectTrigger>
            <SelectContent>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                (type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>

          <Input
            type="text"
            placeholder={t("profileSetup.emergency_contact_name")}
            value={emergencyContactName}
            onChange={(e) => setEmergencyContactName(e.target.value)}
          />

          <Input
            type="text"
            placeholder={t("profileSetup.emergency_contact")}
            value={emergencyContact}
            onChange={(e) => setEmergencyContact(e.target.value)}
          />

          <Button onClick={handleSubmit} className="w-full">
            {t("profileSetup.submit")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
