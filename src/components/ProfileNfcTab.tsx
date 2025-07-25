import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Smartphone, Eye, EyeOff } from "lucide-react";

export const ProfileNfcTab = (props: any) => {
  const {
    t,
    hasActiveNfcCard,
    isCardDeactivated,
    setIsCardDeactivated,
    firstName,
    userInfo,
    nfcCard,
    showCardDetails,
    setShowCardDetails,
    formatDate,
    nfcCardStatus,
    handleDeactivateCard,
    handleBuyNewCard,
    handleAddToWallet,
    addedToWallet,
    showCountdown,
    timeLeft,
    isExpired,
    handleRenewTemporaryAccess,
    setShowCountdown,
  } = props;
  return (
    <div className="relative">
      <TabsContent value="nfc" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" />
              {t("profilepage.nfc.title")}
            </CardTitle>
            <CardDescription>
              {t("profilepage.nfc.description")}
            </CardDescription>
          </CardHeader>
          {/* Blur only the card images and info, not the disclaimer or action buttons */}
          <div className="relative">
            {/* Disclaimer overlay over card image when deactivated */}
            {isCardDeactivated && (
              <div className="absolute inset-0 flex items-center justify-center z-30">
                <div className="bg-white/80 text-red-600 font-semibold text-center rounded-lg px-4 py-2 shadow-lg">
                  {t(
                    "profilepage.nfc.deactivatedDisclaimer",
                    "Your card is deactivated. Please buy a new card from the nearest merchant."
                  )}
                </div>
              </div>
            )}
            <div
              className={
                !hasActiveNfcCard || isCardDeactivated
                  ? "blur-sm pointer-events-none select-none transition-all duration-300"
                  : "transition-all duration-300"
              }
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="relative group w-44 h-auto flex items-center justify-center">
                  <div className="transition-opacity duration-500 ease-in-out group-hover:opacity-0 z-10">
                    <img
                      src="/public/NFC CARD Front -1.png"
                      alt="NFC Front"
                      className="shadow-2xl w-44 rounded-lg"
                    />
                  </div>
                  <div className="absolute transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100 z-20 flex items-center justify-center">
                    <img
                      src="/public/NFC CARD Back-1.png"
                      alt="NFC Card Back"
                      className="shadow-2xl w-44 rounded-lg"
                    />
                    <div className="absolute top-[83%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      <span className="text-black text-xs font-bold drop-shadow-md">
                        {firstName}
                      </span>
                    </div>
                    <div className="absolute top-[93%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      <span className="text-white text-xs font-bold drop-shadow-md">
                        {(userInfo as any).id}
                      </span>
                    </div>
                    <div className="absolute top-[15%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      <span className="text-white text-xs font-bold drop-shadow-md">
                        {formatDate((nfcCard as any).expiryDate)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <CardContent className="space-y-6">
                <div className="border border-border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-foreground">
                      {t("profilepage.nfc.cardStatus")}
                    </h3>
                    <Badge variant="default">
                      {t(`profilepage.nfc.status.${nfcCardStatus}`)}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {t("profilepage.nfc.cardNumber")}
                      </span>
                      <div className="flex items-center gap-2">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        <span className="font-mono">
                          {showCardDetails
                            ? "1234 5678 9012 1234"
                            : (nfcCard as any).cardNumber}
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
                        {t("profilepage.nfc.issueDate")}
                      </span>
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      <span>{formatDate((nfcCard as any).issueDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {t("profilepage.nfc.expiryDate")}
                      </span>
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      <span>{formatDate((nfcCard as any).expiryDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {t("profilepage.nfc.walletexpiryDate")}
                      </span>
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      <span>{formatDate((nfcCard as any).expiryDate)}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-muted/20 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">
                    {t("profilepage.nfc.cardFeaturesTitle")}
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• {t("profilepage.nfc.feature1")}</li>
                    <li>• {t("profilepage.nfc.feature2")}</li>
                    <li>• {t("profilepage.nfc.feature3")}</li>
                    <li>• {t("profilepage.nfc.feature4")}</li>
                  </ul>
                </div>
              </CardContent>
            </div>
          </div>
          {/* Action buttons (never blurred) */}
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <Button
                variant="destructive"
                disabled={nfcCardStatus !== "Active"}
                onClick={() => {
                  handleDeactivateCard();
                  setIsCardDeactivated(true);
                }}
              >
                {t("profilepage.nfc.deactivateCard")}
              </Button>
              <Button
                variant="gradient"
                className="w-full sm:w-auto"
                onClick={() => {
                  handleBuyNewCard();
                  setIsCardDeactivated(false); // Simulate new card activation
                }}
              >
                {t("profilepage.nfc.buyNewCard")}
              </Button>
              <div className="space-y-2 z-30">
                <Button
                  className="duration-300 disabled:opacity-50 w-full text-center sm:w-auto"
                  onClick={() => {
                    handleAddToWallet();
                    if (typeof setShowCountdown === "function")
                      setShowCountdown(true);
                  }}
                  variant="gradient"
                  disabled={addedToWallet}
                >
                  {addedToWallet ? t("wallet.added") : t("wallet.add")}
                </Button>
                {showCountdown && timeLeft && (
                  <div className="text-xs text-muted-foreground mt-2">
                    {t("wallet.expiresOn")}: {timeLeft}
                  </div>
                )}
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {(nfcCard as any).isVirtual && isExpired && (
                  <div className="text-sm text-red-500 border border-red-300 p-2 rounded">
                    Your temporary access has expired. Please renew to regain
                    access.
                    <div className="mt-2">
                      <button
                        onClick={handleRenewTemporaryAccess}
                        className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
                      >
                        Renew Temporary Access
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      {!hasActiveNfcCard && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm z-10 text-center p-4">
          <p className="text-foreground ">{t("profilepage.nfc.notice")}</p>
        </div>
      )}
    </div>
  );
};
