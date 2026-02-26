import { useState, useEffect } from "react";
import { Link } from "wouter";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { User, Lock, Bell, LogOut } from "lucide-react";

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("mediportal_user");
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch {}
    }
  }, []);

  const capitalize = (str: string) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Settings</h1>
          <p className="text-slate-500 mt-2">Manage your account preferences and security settings.</p>
        </div>

        <div className="space-y-6 max-w-3xl">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500 bg-opacity-10">
                <User className="w-5 h-5 text-blue-500" />
              </div>
              <CardTitle className="text-lg font-semibold text-slate-900">Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-600">First Name</Label>
                  <Input
                    data-testid="input-first-name"
                    value={user?.firstName || ""}
                    readOnly
                    className="bg-slate-50 border-slate-200 text-slate-900"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-600">Last Name</Label>
                  <Input
                    data-testid="input-last-name"
                    value={user?.lastName || ""}
                    readOnly
                    className="bg-slate-50 border-slate-200 text-slate-900"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-600">Email</Label>
                <Input
                  data-testid="input-email"
                  value={user?.email || ""}
                  readOnly
                  className="bg-slate-50 border-slate-200 text-slate-900"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-600">Phone</Label>
                  <Input
                    data-testid="input-phone"
                    value={user?.phone || ""}
                    readOnly
                    className="bg-slate-50 border-slate-200 text-slate-900"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-600">Specialty</Label>
                  <Input
                    data-testid="input-specialty"
                    value={user?.specialty ? capitalize(user.specialty.replace("-", " ")) : ""}
                    readOnly
                    className="bg-slate-50 border-slate-200 text-slate-900"
                  />
                </div>
              </div>
              <div className="pt-2">
                <Button data-testid="button-edit-profile" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500 bg-opacity-10">
                <Lock className="w-5 h-5 text-blue-500" />
              </div>
              <CardTitle className="text-lg font-semibold text-slate-900">Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-600">Current Password</Label>
                <Input
                  data-testid="input-current-password"
                  type="password"
                  placeholder="Enter current password"
                  className="border-slate-200"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-600">New Password</Label>
                  <Input
                    data-testid="input-new-password"
                    type="password"
                    placeholder="Enter new password"
                    className="border-slate-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-600">Confirm Password</Label>
                  <Input
                    data-testid="input-confirm-password"
                    type="password"
                    placeholder="Confirm new password"
                    className="border-slate-200"
                  />
                </div>
              </div>
              <div className="pt-2">
                <Button data-testid="button-update-password" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Update Password
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500 bg-opacity-10">
                <Bell className="w-5 h-5 text-blue-500" />
              </div>
              <CardTitle className="text-lg font-semibold text-slate-900">Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">Email Notifications</p>
                  <p className="text-sm text-slate-500">Receive updates and alerts via email</p>
                </div>
                <Switch
                  data-testid="switch-email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              <div className="border-t border-slate-100" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">SMS Notifications</p>
                  <p className="text-sm text-slate-500">Receive urgent alerts via text message</p>
                </div>
                <Switch
                  data-testid="switch-sms-notifications"
                  checked={smsNotifications}
                  onCheckedChange={setSmsNotifications}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 shadow-sm">
            <CardHeader className="flex flex-row items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500 bg-opacity-10">
                <LogOut className="w-5 h-5 text-red-500" />
              </div>
              <CardTitle className="text-lg font-semibold text-slate-900">Account</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500 mb-4">Sign out of your account. You will need to log in again to access the dashboard.</p>
              <Link href="/login">
                <Button data-testid="button-sign-out" variant="destructive">
                  Sign Out
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
