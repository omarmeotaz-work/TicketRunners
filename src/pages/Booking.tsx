import { useEffect, useRef, useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import i18n from "@/lib/i18n";

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
  const [showTerms, setShowTerms] = useState(false);

  const onConfirmPayment = () => {
    setShowTerms(true);
  };

  const onAcceptTerms = () => {
    setShowTerms(false);
    proceedWithPayment();
  };
  const proceedWithPayment = () => {
    const newBooking = {
      id,
      title: eventData.title,
      date: eventData.date,
      time: eventData.time,
      timestamp: new Date().toISOString(),
    };

    const stored = localStorage.getItem("bookedEvents");
    const existing = stored ? JSON.parse(stored) : [];
    localStorage.setItem(
      "bookedEvents",
      JSON.stringify([...existing, newBooking])
    );

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

  const [dependents, setDependents] = useState<
    {
      name: string;
      mobile: string;
      socialMedia: string;
      assignedTicketNumber: number;
      ticketType: string;
      assigned?: boolean;
      child?: boolean;
    }[]
  >([]);

  const [customerInfo, setCustomerInfo] = useState({ name: "", mobile: "" });
  const totalTickets = Object.values(quantities).reduce((s, n) => s + n, 0);
  const totalTicketPrice = ticketTiers.reduce(
    (sum, t) => sum + t.price * quantities[t.key],
    0
  );
  const vatAmount = totalTicketPrice * 0.14;
  const cardCost = 150;
  const renewalCost = 150;
  const totalAmount = totalTicketPrice + vatAmount + cardCost + renewalCost;
  const userTicketTypeRef = useRef<TierKey | "">("");
  const [userTicketType, setUserTicketType] = useState<TierKey | "">("");
  const [addOrder, setAddOrder] = useState<TierKey[]>([]);

  const ticketTypeColors: Record<TierKey, string> = {
    platinum: "bg-gray-300", // platinum
    gold: "bg-yellow-300", // gold
    regular: "bg-green-200", // green
  };

  const eventData = {
    title: "Cairo Jazz Festival 2024",
    date: "2024-02-15",
    time: "10:00",
    location: "Cairo Opera House",
    minimumAge: "13",
    price: 250,
  };

  const changeQty = (tier: TierKey, delta: number) => {
    setQuantities((prev) => {
      const newQty = Math.max(0, prev[tier] + delta);
      setAddOrder((prevOrder) => {
        if (delta > 0) {
          // Add ticket
          return [...prevOrder, tier];
        } else if (delta < 0) {
          // Remove the first occurrence of this tier
          const idx = prevOrder.indexOf(tier);
          if (idx !== -1) {
            return prevOrder.filter((_, i) => i !== idx);
          }
        }
        return prevOrder;
      });
      return { ...prev, [tier]: newQty };
    });
  };

  const updateDependent = (
    index: number,
    field: string,
    value: string | boolean
  ) => {
    const updated = [...dependents];
    updated[index] = { ...updated[index], [field]: value };
    setDependents(updated);
  };
  useEffect(() => {
    if (addOrder.length === 0) {
      userTicketTypeRef.current = "";
      setUserTicketType("");
      setDependents([]);
      return;
    }
    // Assign the first ticket to the main user
    const mainUserTicket = addOrder[0];
    userTicketTypeRef.current = mainUserTicket;
    setUserTicketType(mainUserTicket);
    // Assign the rest to dependents
    const dependentTickets = addOrder.slice(1);
    setDependents((prev) => {
      const updated = [...prev];
      dependentTickets.forEach((ticketType, index) => {
        if (!updated[index]) {
          updated[index] = {
            name: "",
            mobile: "",
            socialMedia: "",
            assignedTicketNumber: index + 2,
            ticketType,
          };
        } else {
          updated[index].assignedTicketNumber = index + 2;
          updated[index].ticketType = ticketType;
        }
      });
      return updated.slice(0, dependentTickets.length);
    });
  }, [addOrder]);

  const [hours, minutes] = eventData.time.split(":").map(Number);
  const timeDate = new Date();
  timeDate.setHours(hours, minutes, 0);

  const formattedTime = new Intl.DateTimeFormat(i18n.language, {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(timeDate);

  const handlePayment = () => {
    const newBooking = {
      id,
      title: eventData.title,
      date: eventData.date,
      time: eventData.time,
      timestamp: new Date().toISOString(),
    };

    const stored = localStorage.getItem("bookedEvents");
    const existing = stored ? JSON.parse(stored) : [];
    localStorage.setItem(
      "bookedEvents",
      JSON.stringify([...existing, newBooking])
    );

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

  const currency = t("currency.egp");
  const numberFormat = new Intl.NumberFormat(i18n.language);

  // Check if any dependent is unassigned
  const hasUnassigned = dependents.some((d) => d && d.assigned === false);

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Dialog open={showTerms} onOpenChange={setShowTerms}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("terms.title")}</DialogTitle>
          </DialogHeader>
          <p>{t("terms.message")}</p>
          <div className="flex justify-end gap-4 mt-4">
            <Button variant="outline" onClick={() => setShowTerms(false)}>
              {t("common.cancel")}
            </Button>
            <Button onClick={onAcceptTerms}>{t("common.accept")}</Button>
          </div>
        </DialogContent>
      </Dialog>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
              {t("booking.title")}
            </h1>
          </div>
          {eventData.minimumAge && (
            <div className="mb-4 text-sm text-destructive">
              {t("booking.ageRestrictionNotice", { age: eventData.minimumAge })}
            </div>
          )}

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
                      {new Intl.DateTimeFormat(i18n.language, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }).format(new Date(eventData.date))}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formattedTime}
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
                      <div className="space-x-1">
                        <p className="font-medium">
                          {t(`booking.tiers.${tier.key}`)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {tier.price} {t("booking.perTicket")}
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
                    <span>
                      {numberFormat.format(totalTicketPrice)} {currency}
                    </span>
                  </div>
                </CardContent>
              </Card>
              <div className={`p-4 rounded-xl`}>
                {/* Customer Information */}
                {addOrder.length > 0 && (
                  <Card className={ticketTypeColors[addOrder[0]]}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" />
                        {t("booking.mainUserInfo")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2 md:col-span-2">
                          <Label>{t("booking.ticketType")}</Label>
                          <Input
                            value={t(`booking.tiers.${addOrder[0]}`)}
                            disabled
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
              {/* Dependents Information */}

              {addOrder.length > 1 && (
                <Card>
                  <CardHeader>
                    <div className="flex flex-col gap-1 mb-2">
                      <p className="text-red-500">
                        {t("booking.dependentDisclaimer")}
                      </p>
                      {hasUnassigned && (
                        <span className="text-xs text-yellow-600 font-medium">
                          {t(
                            "booking.unassignedTransferFeeWarning",
                            "Transferring unassigned tickets later will incur a transfer fee."
                          )}
                        </span>
                      )}
                    </div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      {t("booking.dependentsInfo")}
                    </CardTitle>
                    <CardDescription>
                      {t("booking.dependentsOptional")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {addOrder.slice(1).map((ticketType, index) => {
                      const bgClass = ticketTypeColors[ticketType];
                      const dependentRaw = dependents[index] || {};
                      const dependent = {
                        assigned: true,
                        child: false,
                        name: "",
                        mobile: "",
                        email: "",
                        ...dependentRaw,
                      };
                      return (
                        <div
                          key={index}
                          className={`border border-border rounded-lg p-4 space-y-3 ${bgClass}`}
                        >
                          <h4 className="font-medium">
                            {t("booking.dependent") + ` ${index + 1}`}
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <Label>{t("booking.ticketType")}</Label>
                              <Input
                                value={t(`booking.tiers.${ticketType}`) || ""}
                                disabled
                              />

                              <div className="flex flex-col gap-2 pt-2">
                                <label className="inline-flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={dependent.assigned}
                                    onChange={(e) =>
                                      updateDependent(
                                        index,
                                        "assigned",
                                        e.target.checked
                                      )
                                    }
                                  />
                                  <span>{t("booking.assigned")}</span>
                                </label>

                                <label className="inline-flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={dependent.child}
                                    onChange={(e) =>
                                      updateDependent(
                                        index,
                                        "child",
                                        e.target.checked
                                      )
                                    }
                                  />
                                  <span>{t("booking.child")}</span>
                                </label>
                              </div>

                              {dependent.assigned && (
                                <>
                                  <div className="space-y-2">
                                    <Label>{t("booking.name")}</Label>
                                    <Input
                                      value={dependent.name}
                                      onChange={(e) =>
                                        updateDependent(
                                          index,
                                          "name",
                                          e.target.value
                                        )
                                      }
                                      placeholder={t("booking.name")}
                                    />
                                  </div>
                                  {/* Only show mobile and email if not child */}
                                  {!dependent.child && (
                                    <>
                                      <div className="space-y-2">
                                        <Label>{t("booking.mobile")}</Label>
                                        <Input
                                          type="tel"
                                          value={dependent.mobile}
                                          onChange={(e) =>
                                            updateDependent(
                                              index,
                                              "mobile",
                                              e.target.value
                                            )
                                          }
                                          placeholder={t("booking.mobile")}
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label>{t("booking.email")}</Label>
                                        <Input
                                          type="email"
                                          value={dependent.email || ""}
                                          onChange={(e) =>
                                            updateDependent(
                                              index,
                                              "email",
                                              e.target.value
                                            )
                                          }
                                          placeholder={t("booking.email")}
                                        />
                                      </div>
                                    </>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
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
                      <span>
                        {numberFormat.format(totalTicketPrice)} {currency}
                      </span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>{t("booking.vat")}</span>
                      <span>
                        {numberFormat.format(vatAmount)} {currency}
                      </span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>{t("booking.cardCost")}</span>
                      <span>
                        {numberFormat.format(cardCost)} {currency}
                      </span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>{t("booking.renewalCost")}</span>
                      <span>
                        {numberFormat.format(renewalCost)} {currency}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>{t("booking.totalAmount")}</span>
                      <span>
                        {numberFormat.format(totalAmount)} {currency}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4">
                    <Button
                      variant="gradient"
                      size="lg"
                      className="w-full pt-1 pb-1"
                      onClick={onConfirmPayment}
                    >
                      <CreditCard className="h-5 w-5 mr-2 rtl:mr-0 rtl:ml-2" />
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
