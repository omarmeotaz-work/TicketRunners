import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface TransferState {
  ticketIndexes: number[];
  bookingId: string;
}

export default function TransferTicketsPage() {
  const { state } = useLocation();
  const { ticketIndexes = [], bookingId = "" } = (state as TransferState) || {};
  const [email, setEmail] = useState("");
  const [agree, setAgree] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  if (!ticketIndexes.length || !bookingId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-dark text-foreground">
        Missing transfer data.
      </div>
    );
  }

  const handleConfirm = () => {
    if (!email || !agree) {
      toast({
        title: "Incomplete",
        description: "Enter an email and accept the policy.",
        variant: "destructive",
      });
      return;
    }

    // TODO: call backend API here

    toast({
      title: "Transfer Initiated",
      description: `Tickets ${ticketIndexes.join(
        ", "
      )} for booking ${bookingId} will be sent to ${email}.`,
    });
    navigate(`/booking/${bookingId}`); // back to booking
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      <main className="container mx-auto max-w-md py-12 px-4">
        <Card>
          <CardHeader>
            <CardTitle>
              Transfer {ticketIndexes.length} Ticket
              {ticketIndexes.length > 1 && "s"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">
                Recipient Email
              </label>
              <Input
                type="email"
                placeholder="friend@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                checked={agree}
                onCheckedChange={(v) => setAgree(!!v)}
              />
              <span className="text-sm text-muted-foreground">
                I agree to the transfer policy and 50EGP fee.
              </span>
            </div>

            <Button
              className="w-full"
              disabled={!email || !agree}
              onClick={handleConfirm}
            >
              Confirm & Pay
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
