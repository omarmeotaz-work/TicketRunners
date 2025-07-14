import { useParams } from "react-router-dom";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function TransferTicketPage() {
  const { bookingId, ticketIndex } = useParams();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);

  const handleConfirm = () => {
    if (!email || !agreed) {
      toast({
        title: "Error",
        description: "Please enter the email and accept the transfer policy.",
        variant: "destructive",
      });
      return;
    }

    // Payment and transfer logic here

    toast({
      title: "Transfer Complete",
      description: `Ticket #${ticketIndex} for booking ${bookingId} transferred to ${email}.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      <main className="container mx-auto py-12 px-4 max-w-xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Transfer Ticket #{ticketIndex}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">
                Recipient's Email
              </label>
              <Input
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="policy"
                checked={agreed}
                onCheckedChange={(val) => setAgreed(!!val)}
              />
              <label htmlFor="policy" className="text-sm text-muted-foreground">
                I agree to the ticket transfer policy and service fee.
              </label>
            </div>

            <div className="text-sm text-muted-foreground">
              A service fee of <strong>25 EGP</strong> will apply to this
              transfer.
            </div>

            <Button className="w-full" onClick={handleConfirm}>
              Confirm & Pay
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
