"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UserSettings } from "@/actions/utils/types";
import { updateSettings } from "@/actions/settings";
import { useRouter } from "next/navigation";

interface SettingsFormProps {
  settings: UserSettings | null;
  section: "preferences" | "notifications" | "privacy";
}

export function SettingsForm({ settings, section }: SettingsFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const data: any = {};

    // Build update data based on section
    if (section === "preferences") {
      data.theme = formData.get("theme") as string;
      data.language = formData.get("language") as string;
    } else if (section === "notifications") {
      data.emailNotifications = formData.get("emailNotifications") === "on";
      data.pushNotifications = formData.get("pushNotifications") === "on";
      data.assignmentNotifications = formData.get("assignmentNotifications") === "on";
      data.messageNotifications = formData.get("messageNotifications") === "on";
      data.announcementNotifications = formData.get("announcementNotifications") === "on";
    } else if (section === "privacy") {
      data.profileVisibility = formData.get("profileVisibility") as string;
      data.showEmail = formData.get("showEmail") === "on";
    }

    const result = await updateSettings(data);

    if (result.success) {
      setSuccess(true);
      router.refresh();
    } else {
      setError(result.error?.message || "Failed to update settings");
    }

    setIsLoading(false);
  }

  if (section === "preferences") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>
            Customize your application preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
                {error}
              </div>
            )}
            
            {success && (
              <div className="rounded-md bg-green-50 p-3 text-sm text-green-800">
                Settings updated successfully!
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <select
                  id="theme"
                  name="theme"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  defaultValue={settings?.theme || "light"}
                  disabled={isLoading}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <select
                  id="language"
                  name="language"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  defaultValue={settings?.language || "en"}
                  disabled={isLoading}
                >
                  <option value="en">English</option>
                  <option value="fr">French</option>
                  <option value="es">Spanish</option>
                  <option value="ar">Arabic</option>
                </select>
              </div>
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  if (section === "notifications") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Manage your notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
                {error}
              </div>
            )}
            
            {success && (
              <div className="rounded-md bg-green-50 p-3 text-sm text-green-800">
                Settings updated successfully!
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="emailNotifications"
                  name="emailNotifications"
                  className="h-4 w-4"
                  defaultChecked={settings?.emailNotifications ?? true}
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="pushNotifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive push notifications in the browser
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="pushNotifications"
                  name="pushNotifications"
                  className="h-4 w-4"
                  defaultChecked={settings?.pushNotifications ?? true}
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="assignmentNotifications">Assignment Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about new assignments
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="assignmentNotifications"
                  name="assignmentNotifications"
                  className="h-4 w-4"
                  defaultChecked={settings?.assignmentNotifications ?? true}
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="messageNotifications">Message Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about new messages
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="messageNotifications"
                  name="messageNotifications"
                  className="h-4 w-4"
                  defaultChecked={settings?.messageNotifications ?? true}
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="announcementNotifications">Announcement Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about course announcements
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="announcementNotifications"
                  name="announcementNotifications"
                  className="h-4 w-4"
                  defaultChecked={settings?.announcementNotifications ?? true}
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  if (section === "privacy") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Privacy</CardTitle>
          <CardDescription>
            Manage your privacy settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
                {error}
              </div>
            )}
            
            {success && (
              <div className="rounded-md bg-green-50 p-3 text-sm text-green-800">
                Settings updated successfully!
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="profileVisibility">Profile Visibility</Label>
                <select
                  id="profileVisibility"
                  name="profileVisibility"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  defaultValue={settings?.profileVisibility || "public"}
                  disabled={isLoading}
                >
                  <option value="public">Public</option>
                  <option value="friends">Friends Only</option>
                  <option value="private">Private</option>
                </select>
                <p className="text-sm text-muted-foreground">
                  Control who can see your profile information
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="showEmail">Show Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Display your email address on your profile
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="showEmail"
                  name="showEmail"
                  className="h-4 w-4"
                  defaultChecked={settings?.showEmail ?? false}
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return null;
}
