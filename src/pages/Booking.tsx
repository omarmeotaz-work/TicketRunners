import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Ticket,
  User,
  Phone,
  Users,
  Plus,
  Minus,
  Calendar,
  MapPin,
  Clock,
  CreditCard,
  Store,
} from "lucide-react";

const Booking = () => {
  const { t } = useTranslation();
  const ticketTiers = [
    { key: "regular", label: t("booking.regular"), price: 250 },
    { key: "gold", label: t("booking.gold"), price: 400 },
    { key: "platinum", label: t("booking.platinum"), price: 600 },
  ] as const;
  type TierKey = (typeof ticketTiers)[number]["key"];
  const [quantities, setQuantities] = useState<Record<TierKey, number>>({
    regular: 0,
    gold: 0,
    platinum: 0,
  });
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [dependents, setDependents] = useState([
    { name: "", mobile: "", socialMedia: "" },
  ]);
  const [customerInfo, setCustomerInfo] = useState({ name: "", mobile: "" });
  const totalTickets = Object.values(quantities).reduce((s, n) => s + n, 0);
  const totalTicketPrice = ticketTiers.reduce(
    (sum, t) => sum + t.price * quantities[t.key],
    0
  );
  const vatAmount = totalTicketPrice * 0.14;
  const cardCost = 50;
  const totalAmount = totalTicketPrice + vatAmount + cardCost;

  const eventData = {
    title: "Cairo Jazz Festival 2024",
    date: "2024-02-15",
    time: "20:00",
    location: "Cairo Opera House",
    price: 250,
  };

  const changeQty = (tier: TierKey, delta: number) =>
    setQuantities((prev) => ({
      ...prev,
      [tier]: Math.max(0, prev[tier] + delta),
    }));

  const updateDependent = (index: number, field: string, value: string) => {
    const updated = [...dependents];
    updated[index] = { ...updated[index], [field]: value };
    setDependents(updated);
  };

  useEffect(() => {
    const need = Math.max(0, totalTickets - 1);
    setDependents((d) =>
      d.length === need
        ? d
        : need > d.length
        ? [
            ...d,
            ...Array.from({ length: need - d.length }, () => ({
              name: "",
              mobile: "",
              socialMedia: "",
            })),
          ]
        : d.slice(0, need)
    );
  }, [totalTickets]);

  const handlePayment = () => {
    toast({
      title: t("booking.paymentSuccessTitle"),
      description: t("booking.paymentSuccessDescription"),
    });

    navigate("/payment-confirmation", {
      state: {
        eventTitle: eventData.title,
        totalAmount,
        transactionId: crypto.randomUUID(),
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
              {t("booking.title")}
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Booking Form */}
            <div className="space-y-6">
              {/* Event Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ticket className="h-5 w-5 text-primary" />
                    {t("booking.eventDetails")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <h3 className="font-semibold text-lg">{eventData.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {eventData.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {eventData.time}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {eventData.location}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Ticket Quantity */}
              <Card>
                <CardHeader>
                  <CardTitle>{t("booking.ticketQuantities")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {ticketTiers.map((tier) => (
                    <div
                      key={tier.key}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">
                          {t(`booking.tiers.${tier.key}`)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {tier.price} EGP {t("booking.perTicket")}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => changeQty(tier.key, -1)}
                          disabled={quantities[tier.key] === 0}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="font-semibold text-lg w-8 text-center">
                          {quantities[tier.key]}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => changeQty(tier.key, 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-between pt-2">
                    <span className="font-medium">{t("booking.subtotal")}</span>
                    <span>{totalTicketPrice} EGP</span>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Information */}

              {/* Dependents Information */}
              {dependents.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      {t("booking.dependentsInfo")}
                    </CardTitle>
                    <CardDescription>
                      {t("booking.dependentsOptional")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {dependents.map((dependent, index) => (
                      <div
                        key={index}
                        className="border border-border rounded-lg p-4 space-y-3"
                      >
                        <h4 className="font-medium">
                          {t("booking.dependent") + ` ${index + 1}`}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="space-y-2">
                            <Label>{t("booking.name")}</Label>
                            <Input
                              value={dependent.name}
                              onChange={(e) =>
                                updateDependent(index, "name", e.target.value)
                              }
                              placeholder={t("booking.namePlaceholder")}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    {t("booking.priceBreakdown")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>
                        {t("booking.ticketPrice", { count: totalTickets })}
                      </span>
                      <span>{totalTicketPrice} EGP</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>{t("booking.vat")}</span>
                      <span>{vatAmount.toFixed(2)} EGP</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>{t("booking.cardCost")}</span>
                      <span>{cardCost} EGP</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>{t("booking.totalAmount")}</span>
                      <span>{totalAmount.toFixed(2)} EGP</span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4">
                    <Button
                      variant="gradient"
                      size="lg"
                      className="w-full pt-1 pb-1"
                      onClick={handlePayment}
                    >
                      <CreditCard className="h-5 w-5 mr-2" />
                      {t("booking.completePayment")}
                    </Button>

                    <div className="bg-primary/10 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <Store className="h-4 w-4 text-primary mt-1" />
                        <div className="text-sm">
                          <p className="font-medium">
                            {t("booking.firstPurchaseNotice")}
                          </p>
                          <p className="text-muted-foreground">
                            {t("booking.nfcInstruction")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Methods */}
              <Card>
                <CardHeader>
                  <CardTitle>{t("booking.paymentMethods")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="payment"
                        id="card"
                        defaultChecked
                      />
                      <label htmlFor="card" className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        {t("booking.creditDebit")}
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Booking;
