import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";

export default function SettingsPage() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [language, setLanguage] = useState(localStorage.getItem("language") || "en");
  const [notifications, setNotifications] = useState(
    localStorage.getItem("notifications") !== "false"
  );

  const saveSettings = () => {
    localStorage.setItem("theme", theme);
    localStorage.setItem("language", language);
    localStorage.setItem("notifications", notifications);

    alert("Settings saved successfully");
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-500">
          Manage system preferences
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow max-w-3xl">
        <div className="space-y-6">
          <div>
            <label className="text-sm text-gray-500">Theme</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full mt-2 p-3 border rounded-xl"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System Default</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-500">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full mt-2 p-3 border rounded-xl"
            >
              <option value="en">English</option>
              <option value="ru">Russian</option>
              <option value="kk">Kazakh</option>
            </select>
          </div>

          <div className="flex items-center justify-between border p-5 rounded-xl">
            <div>
              <h3 className="font-bold">Notifications</h3>
              <p className="text-gray-500 text-sm">
                Allow system notifications
              </p>
            </div>

            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="w-5 h-5"
            />
          </div>
        </div>

        <button
          onClick={saveSettings}
          className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-xl"
        >
          Save Settings
        </button>
      </div>
    </DashboardLayout>
  );
}