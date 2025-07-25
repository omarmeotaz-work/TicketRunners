// components/ShareModal.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Copy, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  shareUrl: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  open,
  onClose,
  shareUrl,
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    toast({ description: t("share.copied") });
  };

  const openWindow = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=600");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm p-6">
        <DialogHeader>
          <DialogTitle>{t("share.title")}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={(e) => {
              e.stopPropagation();
              openWindow(
                `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  shareUrl
                )}`
              );
            }}
          >
            <Facebook className="h-4 w-4" />
            {t("share.facebook")}
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={(e) => {
              e.stopPropagation();
              openWindow(
                `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  shareUrl
                )}`
              );
            }}
          >
            <Twitter className="h-4 w-4" />
            {t("share.twitter")}
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={(e) => {
              e.stopPropagation();
              handleCopy();
            }}
          >
            <Copy className="h-4 w-4" />
            {t("share.copyLink")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
