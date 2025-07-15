// src/pages/PaymentConfirmation.tsx
import { useLocation, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

interface PaymentState {
  eventTitle: string;
  totalAmount: number;
  transactionId: string;
}

export default function PaymentConfirmation() {
  const { state } = useLocation();
  const { eventTitle, totalAmount, transactionId } = (state ||
    {}) as PaymentState;

  return (
    <>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-xl mx-auto text-center">
          <CheckCircle className="h-14 w-14 text-primary mx-auto mb-6" />
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
            Payment Successful
          </h1>
          <p className="text-muted-foreground mb-8">
            Thank you for booking with Ticket Runners!
          </p>

          <Card className="text-left">
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium">Event</span>
                <span>{eventTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Transaction ID</span>
                <Badge variant="secondary">{transactionId}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Total Paid</span>
                <span className="font-semibold">
                  {totalAmount.toFixed(2)} EGP
                </span>
              </div>
            </CardContent>
          </Card>

          <Link to="/events">
            <button className="mt-10 bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 py-3 rounded-xl transition">
              Browse More Events
            </button>
          </Link>
        </div>
      </main>
    </>
  );
}
