import { useState } from "react";
import { useParams } from "react-router-dom";
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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Ticket,
  Calendar,
  MapPin,
  Clock,
  Send,
  ArrowRight,
} from "lucide-react";
import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

/* -------------------------------------------------------------------------- */
/*                              Mock Booking Data                             */
/* -------------------------------------------------------------------------- */

const bookings = [
  {
    id: "1",
    title: "Cairo Jazz Festival 2024",
    date: "2024-02-15",
    time: "20:00",
    location: "Cairo Opera House",
    price: 250,
    quantity: 2,
  },
  {
    id: "2",
    title: "Comedy Night with Ahmed Ahmed",
    date: "2024-02-20",
    time: "21:00",
    location: "Al-Azhar Park",
    price: 150,
    quantity: 1,
  },
];

/* -------------------------------------------------------------------------- */
/*                              Helper Functions                               */
/* -------------------------------------------------------------------------- */

const generateTransferCode = () =>
  Math.random().toString(36).substring(2, 8).toUpperCase();

/* -------------------------------------------------------------------------- */
/*                                 Component                                   */
/* -------------------------------------------------------------------------- */
type TicketState = { index: number; transferred: boolean; code?: string };

export default function TicketDetails() {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedTicketIndexes, setSelectedTicketIndexes] = useState<number[]>(
    []
  );

  const booking = bookings.find((b) => b.id === id);
  const [tickets, setTickets] = useState<TicketState[]>(() => {
    if (!booking) return [];
    return Array.from({ length: booking.quantity }, (_, i) => ({
      index: i + 1,
      transferred: false,
      code: undefined, // explicitly included
    }));
  });

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-dark text-foreground">
        Booking not found.
      </div>
    );
  }

  /* ------------------------ Ticket Transfer State ------------------------- */

  const handleSelect = (index: number) => {
    setSelectedTicketIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };
  const handleNavigateToTransfer = () => {
    navigate("/transfer-tickets", {
      state: { ticketIndexes: selectedTicketIndexes, bookingId: booking.id },
    });
  };

  const handleTransfer = (idx: number) => {
    navigate(`/transfer/${booking.id}/${idx}`);
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Heading */}
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
              Ticket Details
            </h1>
            <p className="text-muted-foreground">
              Booking reference #{booking.id}
            </p>
          </div>

          {/* Event Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="h-5 w-5 text-primary" /> {booking.title}
              </CardTitle>
              <CardDescription>Event information</CardDescription>
            </CardHeader>
          </Card>

          {/* Tickets List */}
          {/* Tickets List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" /> Your Tickets
              </CardTitle>
              <CardDescription>
                Transfer tickets individually or select multiple to transfer
                together
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {tickets.map((ticket) => (
                <div
                  key={ticket.index}
                  className="flex items-center justify-between border border-border rounded-lg p-4"
                >
                  <div className="flex items-center gap-3">
                    {!ticket.transferred && (
                      <input
                        type="checkbox"
                        checked={selectedTicketIndexes.includes(ticket.index)}
                        onChange={() => handleSelect(ticket.index)}
                        className="form-checkbox h-4 w-4 text-primary"
                      />
                    )}
                    <Badge variant="default">Ticket #{ticket.index}</Badge>
                    {ticket.transferred && ticket.code && (
                      <span className="text-xs text-muted-foreground">
                        Transferred (Code: {ticket.code})
                      </span>
                    )}
                  </div>

                  {!ticket.transferred && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTransfer(ticket.index)}
                      className="group"
                    >
                      Transfer
                      <Send className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </Button>
                  )}
                </div>
              ))}

              {selectedTicketIndexes.length > 0 && (
                <div className="text-right pt-4">
                  <Button onClick={handleNavigateToTransfer}>
                    Transfer Selected Tickets
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{booking.price * booking.quantity}EGP</span>
              </div>
              <div className="flex justify-between">
                <span>VAT(14%)</span>
                <span>
                  {(booking.price * booking.quantity * 0.14).toFixed(2)}EGP
                </span>
              </div>
              <div className="flex justify-between font-semibold text-foreground">
                <span>Total</span>
                <span>
                  {(booking.price * booking.quantity * 1.14).toFixed(2)}EGP
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
