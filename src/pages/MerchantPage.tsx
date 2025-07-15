import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Search, CreditCard, User as UserIcon } from "lucide-react";

interface UserInfo {
  id: string;
  name: string;
  email: string;
}

export default function MerchantPage() {
  const { toast } = useToast();
  const [emailQuery, setEmailQuery] = useState("");
  const [foundUser, setFoundUser] = useState<UserInfo | null>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  /* ---------------------------------------------------------------------- */
  /* Mock API helpers – replace with real backend calls                     */
  /* ---------------------------------------------------------------------- */
  const mockDatabase: UserInfo[] = [
    { id: "1", name: "Ahmed Mohamed", email: "ahmed@example.com" },
    { id: "2", name: "Sara Ali", email: "sara@example.com" },
  ];

  const searchByEmail = (email: string): Promise<UserInfo | null> =>
    new Promise((resolve) => {
      setTimeout(() => {
        const user = mockDatabase.find((u) => u.email === email.trim());
        resolve(user || null);
      }, 800);
    });

  const assignCard = (userId: string, card: string): Promise<boolean> =>
    new Promise((resolve) => {
      setTimeout(() => resolve(true), 800);
    });

  /* ---------------------------------------------------------------------- */
  /* Handlers                                                               */
  /* ---------------------------------------------------------------------- */
  const handleSearch = async () => {
    if (!emailQuery) return;
    setIsSearching(true);
    setFoundUser(null);
    const user = await searchByEmail(emailQuery);
    setIsSearching(false);

    if (!user) {
      toast({
        title: "User Not Found",
        description: `No account associated with ${emailQuery}.`,
      });
    } else {
      setFoundUser(user);
      toast({
        title: "User Found",
        description: `Account belongs to ${user.name}.`,
      });
    }
  };

  const handleAssign = async () => {
    if (!foundUser || !cardNumber) return;
    setIsAssigning(true);
    const ok = await assignCard(foundUser.id, cardNumber);
    setIsAssigning(false);
    if (ok) {
      toast({
        title: "Card Assigned Successfully",
        description: `Card ${cardNumber} is now linked to ${foundUser.name}.`,
      });
      setCardNumber("");
      setFoundUser(null);
      setEmailQuery("");
    } else {
      toast({ title: "Error", description: "Failed to assign card." });
    }
  };

  /* ---------------------------------------------------------------------- */
  /* UI                                                                     */
  /* ---------------------------------------------------------------------- */
  return (
    <div className="min-h-screen flex flex-col bg-gradient-dark">
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <UserIcon className="h-5 w-5 text-primary" />
              Merchant Portal
            </CardTitle>
            <CardDescription>
              Search customer by email and assign NFC card.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Search Section */}
            <div className="space-y-4">
              <Label htmlFor="emailSearch">Customer Email</Label>
              <div className="flex gap-2">
                <Input
                  id="emailSearch"
                  type="email"
                  placeholder="customer@example.com"
                  value={emailQuery}
                  onChange={(e) => setEmailQuery(e.target.value)}
                />
                <Button
                  variant="gradient"
                  size="icon"
                  disabled={isSearching}
                  onClick={handleSearch}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Assignment Section */}
            {foundUser && (
              <div className="space-y-4 animate-fade-in">
                <p className="text-sm">
                  Assigning card to:{" "}
                  <span className="font-semibold">{foundUser.name}</span> (
                  {foundUser.email})
                </p>
                <Label htmlFor="cardNumber">NFC Card Number</Label>
                <div className="flex gap-2">
                  <Input
                    id="cardNumber"
                    placeholder="Enter card serial / ID"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                  <Button
                    variant="gradient"
                    disabled={isAssigning || !cardNumber}
                    onClick={handleAssign}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Assign Card
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
