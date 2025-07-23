import { Button } from "@/components/ui/button";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

export function Footer() {
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleNavigation = (key: string) => {
    const routes: Record<string, string> = {
      aboutUs: "/about",
      contactUs: "/contact",
      howItWorks: "/howitworks",
      nearbyMerchants: "/nearbymerchants",
      faqs: "/faqs",
      terms: "/terms",
      privacy: "/privacypolicy",
      refund: "/refundpolicy",
    };
    const path = routes[key];
    if (path) window.location.href = path;
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <a href="/" className="block w-fit">
              <img
                src="/src/assets/ticket-logo.png"
                alt="Ticket Runners Logo"
                className="w-48 h-auto"
              />
            </a>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t("footer.tagline")}
            </p>
            <div className="flex space-x-3">
              <Button variant="icon" size="icon" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">
              {t("footer.quickLinks")}
            </h3>
            <div className="space-y-2">
              {["aboutUs", "contactUs", "howItWorks", "nearbyMerchants"].map(
                (key) => (
                  <button
                    key={key}
                    onClick={() => handleNavigation(key)}
                    className="block text-muted-foreground hover:text-primary transition-colors duration-300 text-sm nav-link"
                  >
                    {t(`footer.${key}`)}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">
              {t("footer.legal")}
            </h3>
            <div className="space-y-2">
              {["faqs", "terms", "privacy", "refund"].map((key) => (
                <button
                  key={key}
                  onClick={() => handleNavigation(key)}
                  className="block text-muted-foreground hover:text-primary transition-colors duration-300 text-sm nav-link"
                >
                  {t(`footer.${key}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">
              {t("footer.contact")}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-sm">+20 122 652 1747</span>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-sm">support@ticketrunners.com</span>
              </div>
              <div className="flex items-start space-x-3 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <span className="text-sm">{t("footer.location")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-muted-foreground text-sm">
              © {currentYear} TicketRunners | {t("footer.trustSlogan")}
            </div>

            <div className="text-muted-foreground text-center">
              {t("footer.poweredBy")}{" "}
              <a
                href="https://flokisystems.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors duration-300"
              >
                Floki Systems
              </a>
            </div>

            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>{t("footer.techSupport")}:</span>
              <a
                href="tel:+201226521747"
                className="text-primary hover:text-primary/80 transition-colors duration-300 flex items-center space-x-1"
              >
                <Phone className="h-3 w-3" />
                <span>+20 122 652 1747</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
