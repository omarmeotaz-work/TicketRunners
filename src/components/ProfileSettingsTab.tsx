import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { OtpInput } from "@/components/ui/input-otp";
import { TabsContent } from "@/components/ui/tabs";

export const ProfileSettingsTab = (props: any) => {
  const {
    t,
    userInfo,
    profileImage,
    setProfileImage,
    phone,
    setPhone,
    phoneVerified,
    setPhoneVerified,
    handleSendPhoneOtp,
    email,
    setEmail,
    emailVerified,
    setEmailVerified,
    handleSendEmailOtp,
    bloodType,
    setBloodType,
    emergencyContact,
    setEmergencyContact,
    emergencyContactName,
    setEmergencyContactName,
    oldPassword,
    setOldPassword,
    newPassword,
    setNewPassword,
    passwordOtpVerified,
    passwordOtpError,
    handleSendPasswordOtp,
    handleVerifyPasswordOtp,
    handleSettingsSave,
    notifyEmail,
    setNotifyEmail,
    notifySMS,
    setNotifySMS,
    notificationWarning,
  } = props;

  // Local state for OTP modals and values
  const [showPhoneOtpModal, setShowPhoneOtpModal] = useState(false);
  const [showEmailOtpModal, setShowEmailOtpModal] = useState(false);
  const [showPasswordOtpModal, setShowPasswordOtpModal] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [passwordOtp, setPasswordOtp] = useState("");

  // Ensure at least one notification method is checked
  const handleNotifyEmailChange = (checked: boolean) => {
    if (!checked && !notifySMS) return; // Prevent unchecking last
    props.setNotifyEmail(checked);
  };
  const handleNotifySMSChange = (checked: boolean) => {
    if (!checked && !notifyEmail) return; // Prevent unchecking last
    props.setNotifySMS(checked);
  };

  return (
    <TabsContent value="settings" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {t("profilepage.settingsTab.tab")}
          </CardTitle>
          <CardDescription className="mb-2">
            {t("profilepage.settingsTab.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">
                {t("profilepage.settingsTab.fullName")}
              </Label>
              <Input
                id="fullName"
                disabled
                defaultValue={(userInfo as any).name}
              />
            </div>
            {/* Phone Verification */}
            <div className="space-y-2">
              <Label htmlFor="phone">
                {t("profilepage.settingsTab.phone")}
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setPhoneVerified(false);
                  }}
                  placeholder={t(
                    "profilepage.settingsTab.phonePlaceholder",
                    "Phone Number"
                  )}
                />
                {!phoneVerified ? (
                  <>
                    <Button
                      size="sm"
                      variant="gradient"
                      onClick={() => {
                        handleSendPhoneOtp();
                        setShowPhoneOtpModal(true);
                      }}
                    >
                      {t("auth.verify", "Verify")}
                    </Button>
                    <Dialog
                      open={showPhoneOtpModal}
                      onOpenChange={setShowPhoneOtpModal}
                    >
                      <DialogContent>
                        <DialogHeader>
                          {t(
                            "profilepage.settingsTab.phoneOtpTitle",
                            "Enter OTP"
                          )}
                        </DialogHeader>
                        <OtpInput
                          value={phoneOtp}
                          onChange={setPhoneOtp}
                          autoFocus
                        />
                        <Button
                          className="w-full mt-2"
                          onClick={() => {
                            // Add your phone OTP verification logic here
                            setShowPhoneOtpModal(false);
                            setPhoneVerified(true);
                          }}
                          disabled={phoneOtp.length !== 6}
                        >
                          {t("auth.verifyOtp", "Verify OTP")}
                        </Button>
                      </DialogContent>
                    </Dialog>
                  </>
                ) : (
                  <span className="text-green-600 text-xs font-semibold">
                    {t("auth.verified", "Verified")}
                  </span>
                )}
              </div>
            </div>
            {/* Email Verification */}
            <div className="space-y-2">
              <Label htmlFor="email">
                {t("profilepage.settingsTab.email")}
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailVerified(false);
                  }}
                  placeholder={t(
                    "profilepage.settingsTab.emailPlaceholder",
                    "Email Address"
                  )}
                />
                {!emailVerified ? (
                  <>
                    <Button
                      size="sm"
                      variant="gradient"
                      onClick={() => {
                        handleSendEmailOtp();
                        setShowEmailOtpModal(true);
                      }}
                    >
                      {t("auth.verify", "Verify")}
                    </Button>
                    <Dialog
                      open={showEmailOtpModal}
                      onOpenChange={setShowEmailOtpModal}
                    >
                      <DialogContent>
                        <DialogHeader>
                          {t(
                            "profilepage.settingsTab.emailOtpTitle",
                            "Enter OTP"
                          )}
                        </DialogHeader>
                        <OtpInput
                          value={emailOtp}
                          onChange={setEmailOtp}
                          autoFocus
                        />
                        <Button
                          className="w-full mt-2"
                          onClick={() => {
                            // Add your email OTP verification logic here
                            setShowEmailOtpModal(false);
                            setEmailVerified(true);
                          }}
                          disabled={emailOtp.length !== 6}
                        >
                          {t("auth.verifyOtp", "Verify OTP")}
                        </Button>
                      </DialogContent>
                    </Dialog>
                  </>
                ) : (
                  <span className="text-green-600 text-xs font-semibold">
                    {t("auth.verified", "Verified")}
                  </span>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="profileImage">
                {t("profilepage.settingsTab.profileImage")}
              </Label>
              <div className="flex items-center space-x-2">
                {profileImage && (
                  <img
                    src={(userInfo as any).profileImage}
                    alt="Profile Preview"
                    className="w-24 h-24 rounded-full object-cover border"
                  />
                )}
                <Input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    // You may want to handle image change here
                  }}
                />
              </div>
            </div>
            {/* Blood Type */}
            <div className="space-y-2">
              <Label htmlFor="bloodType">
                {t("profilepage.settingsTab.bloodType")}
              </Label>
              <select
                id="bloodType"
                className="w-full rounded-md border border-input bg-input px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={bloodType}
                onChange={(e) => setBloodType(e.target.value)}
              >
                <option value="">
                  {t("profilepage.settingsTab.selectOption")}
                </option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
            {/* Emergency Contact Name */}
            <div className="space-y-2">
              <Label htmlFor="emergencyContactName">
                {t("profilepage.settingsTab.emergencyContactName")}
              </Label>
              <Input
                id="emergencyContactName"
                value={emergencyContactName}
                onChange={(e) => setEmergencyContactName(e.target.value)}
                placeholder={t(
                  "profilepage.settingsTab.emergencyContactNamePlaceholder",
                  "Contact Name"
                )}
              />
            </div>
            {/* Emergency Contact Number */}
            <div className="space-y-2">
              <Label htmlFor="emergencyContact">
                {t("profilepage.settingsTab.emergencyContact")}
              </Label>
              <Input
                id="emergencyContact"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                placeholder={t(
                  "profilepage.settingsTab.emergencyContactPlaceholder",
                  "Contact Number"
                )}
              />
            </div>
          </div>
          {/* Password Change Section */}
          <div className="space-y-2 pt-4">
            <Label>{t("profilepage.settingsTab.changePassword")}</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <Input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder={t(
                  "profilepage.settingsTab.oldPasswordPlaceholder",
                  "Current Password"
                )}
              />
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setPasswordOtpVerified(false);
                }}
                placeholder={t(
                  "profilepage.settingsTab.newPasswordPlaceholder",
                  "New Password"
                )}
              />
              {/* For change password verification: */}
              {!passwordOtpVerified ? (
                <>
                  <Button
                    className="m-auto"
                    size="sm"
                    variant="gradient"
                    onClick={() => {
                      setShowPasswordOtpModal(true);
                    }}
                    disabled={!oldPassword || !newPassword}
                  >
                    {t("auth.verify", "Send OTP")}
                  </Button>
                  <Dialog
                    open={showPasswordOtpModal}
                    onOpenChange={setShowPasswordOtpModal}
                  >
                    <DialogContent>
                      <DialogHeader>
                        {t(
                          "profilepage.settingsTab.passwordOtpTitle",
                          "Enter OTP"
                        )}
                      </DialogHeader>
                      <OtpInput
                        value={passwordOtp}
                        onChange={setPasswordOtp}
                        autoFocus
                      />
                      <Button
                        className="w-full mt-2"
                        onClick={() => {
                          // Add your password OTP verification logic here
                          setShowPasswordOtpModal(false);
                          // You may want to setPasswordOtpVerified(true) here
                        }}
                        disabled={passwordOtp.length !== 6}
                      >
                        {t("auth.verifyOtp", "Verify OTP")}
                      </Button>
                    </DialogContent>
                  </Dialog>
                </>
              ) : (
                <span className="text-green-600 text-xs font-semibold">
                  {t("auth.verified", "Verified")}
                </span>
              )}
            </div>
            {passwordOtpError && (
              <p className="text-sm text-red-500">{passwordOtpError}</p>
            )}
          </div>
          {/* Notification Preferences */}
          <div className="space-y-2 pt-4">
            <Label>
              {t("profilepage.settingsTab.notificationPreferences")}
            </Label>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={props.notifyEmail}
                  onChange={(e) => handleNotifyEmailChange(e.target.checked)}
                  disabled={!props.notifySMS && props.notifyEmail}
                />
                <span>{t("profilepage.settingsTab.notifyEmail")}</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={props.notifySMS}
                  onChange={(e) => handleNotifySMSChange(e.target.checked)}
                  disabled={!props.notifyEmail && props.notifySMS}
                />
                <span>{t("profilepage.settingsTab.notifySMS")}</span>
              </label>
              {notificationWarning && (
                <span className="text-xs text-red-500 font-medium">
                  {notificationWarning}
                </span>
              )}
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button
              variant="gradient"
              onClick={handleSettingsSave}
              disabled={newPassword && !passwordOtpVerified}
            >
              {t("profilepage.settingsTab.saveChanges", "Save Changes")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};
