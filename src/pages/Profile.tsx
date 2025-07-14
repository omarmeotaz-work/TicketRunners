import { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  User,
  Ticket,
  History,
  CreditCard,
  Smartphone,
  Settings,
  QrCode,
  MapPin,
  Calendar,
  Clock,
  Download,
  Eye,
  EyeOff,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [showCardDetails, setShowCardDetails] = useState(false);

  // Mock data
  const userInfo = {
    name: "Ahmed Mohamed Hassan",
    phone: "+20 123 456 7890",
    email: "ahmed.mohamed@example.com",
  };

  const bookings = [
    {
      id: 1,
      eventTitle: "Cairo Jazz Festival 2024",
      date: "2024-02-15",
      time: "20:00",
      location: "Cairo Opera House",
      ticketPrice: 250,
      quantity: 2,
      qrEnabled: true,
      status: "confirmed",
    },
    {
      id: 2,
      eventTitle: "Comedy Night with Ahmed Ahmed",
      date: "2024-02-20",
      time: "21:00",
      location: "Al-Azhar Park",
      ticketPrice: 150,
      quantity: 1,
      qrEnabled: false,
      status: "pending",
    },
  ];

  const visits = [
    {
      id: 1,
      eventTitle: "Rock Concert 2023",
      date: "2023-12-15",
      location: "New Capital Arena",
      entranceTime: "19:45",
      dependents: ["Sarah Hassan", "Omar Hassan"],
    },
    {
      id: 2,
      eventTitle: "Art Exhibition Opening",
      date: "2023-11-20",
      location: "Museum of Modern Art",
      entranceTime: "18:30",
      dependents: [],
    },
  ];

  const billingHistory = [
    {
      id: 1,
      date: "2024-01-15",
      eventTitle: "Cairo Jazz Festival 2024",
      amount: 500,
      currency: "EGP",
      status: "paid",
      invoiceId: "INV-2024-001",
    },
    {
      id: 2,
      date: "2024-01-10",
      eventTitle: "Comedy Night",
      amount: 150,
      currency: "EGP",
      status: "paid",
      invoiceId: "INV-2024-002",
    },
  ];

  const nfcCard = {
    status: "Active",
    cardNumber: "**** **** **** 1234",
    issueDate: "2023-06-15",
    expiryDate: "2025-06-15",
  };
  const navigate = useNavigate();

  const handleViewDetails = (ticketID: number) => {
    navigate(`/ticket/${ticketID}`);
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
              My Profile
            </h1>
            <p className="text-muted-foreground">
              Manage your account, bookings, and preferences
            </p>
          </div>

          <Tabs defaultValue="bookings" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="bookings" className="flex items-center gap-2">
                <Ticket className="h-4 w-4" />
                My Bookings
              </TabsTrigger>
              <TabsTrigger value="visits" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                My Visits
              </TabsTrigger>
              <TabsTrigger value="billing" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Billing History
              </TabsTrigger>
              <TabsTrigger value="nfc" className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                NFC Card
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Account Settings
              </TabsTrigger>
            </TabsList>

            {/* My Bookings */}
            <TabsContent value="bookings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ticket className="h-5 w-5 text-primary" />
                    My Bookings
                  </CardTitle>
                  <CardDescription>
                    View and manage your ticket bookings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="border border-border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {booking.eventTitle}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {booking.date}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {booking.time}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {booking.location}
                            </div>
                          </div>
                        </div>
                        <Badge
                          variant={
                            booking.status === "confirmed"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {booking.status}
                        </Badge>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="text-sm">
                          <span className="text-muted-foreground">
                            Quantity:{" "}
                          </span>
                          <span className="font-medium">
                            {booking.quantity}
                          </span>
                          <span className="text-muted-foreground ml-4">
                            Total:{" "}
                          </span>
                          <span className="font-medium">
                            {booking.ticketPrice * booking.quantity} EGP
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {booking.qrEnabled && (
                            <Button variant="outline" size="sm">
                              <QrCode className="h-4 w-4 mr-2" />
                              QR Code
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(booking.id)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* My Visits */}
            <TabsContent value="visits" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5 text-primary" />
                    My Visits
                  </CardTitle>
                  <CardDescription>
                    History of events you have attended
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {visits.map((visit) => (
                    <div
                      key={visit.id}
                      className="border border-border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {visit.eventTitle}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {visit.date}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              Entered at {visit.entranceTime}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {visit.location}
                            </div>
                          </div>
                        </div>
                      </div>

                      {visit.dependents.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            Dependents: {visit.dependents.join(", ")}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Billing History */}
            <TabsContent value="billing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Billing History
                  </CardTitle>
                  <CardDescription>
                    View your payment history and download invoices
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {billingHistory.map((payment) => (
                    <div
                      key={payment.id}
                      className="border border-border rounded-lg p-4"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {payment.eventTitle}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span>{payment.date}</span>
                            <span>Invoice: {payment.invoiceId}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="font-semibold text-foreground">
                              {payment.amount} {payment.currency}
                            </div>
                            <Badge variant="default" className="text-xs">
                              {payment.status}
                            </Badge>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* NFC Card */}
            <TabsContent value="nfc" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5 text-primary" />
                    My NFC Card
                  </CardTitle>
                  <CardDescription>
                    Manage your NFC card for seamless event entry
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border border-border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-foreground">
                        Card Status
                      </h3>
                      <Badge variant="default">{nfcCard.status}</Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Card Number:
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono">
                            {showCardDetails
                              ? "1234 5678 9012 1234"
                              : nfcCard.cardNumber}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowCardDetails(!showCardDetails)}
                          >
                            {showCardDetails ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Issue Date:
                        </span>
                        <span>{nfcCard.issueDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Expiry Date:
                        </span>
                        <span>{nfcCard.expiryDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button variant="outline">Replace Card</Button>
                    <Button variant="outline">Deactivate Card</Button>
                    <Button variant="gradient">Buy New Card</Button>
                  </div>

                  <div className="bg-muted/20 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Card Features</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Contactless entry to events</li>
                      <li>• Faster check-in process</li>
                      <li>• Works with all supported venues</li>
                      <li>• Backup QR code always available</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Account Settings */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    Account Settings
                  </CardTitle>
                  <CardDescription>
                    Update your contact information and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input id="fullName" defaultValue={userInfo.name} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" defaultValue={userInfo.phone} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        defaultValue={userInfo.email}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">New Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter new password"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-semibold">Notification Preferences</h4>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="rounded border-border"
                        />
                        <span className="text-sm">
                          Email notifications for new events
                        </span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="rounded border-border"
                        />
                        <span className="text-sm">
                          SMS notifications for booking confirmations
                        </span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          className="rounded border-border"
                        />
                        <span className="text-sm">
                          Marketing communications
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button variant="gradient">Save Changes</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Profile;
