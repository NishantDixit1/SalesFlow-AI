import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import Contacts from "./pages/Contacts";
import Pipeline from "./pages/Pipeline";
import Notes from "./pages/Notes";
import Tasks from "./pages/Tasks";
import Settings from "./pages/Settings";

/* Central route table. Auth routes are public; everything else is wrapped in
   the authenticated AppLayout behind <ProtectedRoute>. */
export default function App() {
  const [showWebViewWarning, setShowWebViewWarning] = useState(false);

  // WebView detection — blocks Google Sign-In failures when opened inside
  // LinkedIn/Instagram/FB/Twitter in-app browsers
  useEffect(() => {
    const ua = navigator.userAgent;
    const isWebView =
      /FBAN|FBAV|Instagram|LinkedInApp|Twitter|Line|wv/.test(ua) ||
      (ua.includes("Android") && /Version\/\d/.test(ua));
    if (isWebView) {
      setShowWebViewWarning(true);
    }
  }, []);

  return (
    <>
      {/* WebView Warning Overlay */}
      {showWebViewWarning && (
        <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center px-6">
          <div className="bg-white rounded-2xl p-8 text-center max-w-sm shadow-2xl">
            <p className="text-4xl mb-4">🌐</p>
            <h2 className="font-bold text-gray-800 text-lg mb-3">
              Open in Chrome or Safari
            </h2>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Google Sign-In doesn't work inside LinkedIn or other apps.
              Please open this link in your browser.
            </p>
            <div className="bg-gray-100 rounded-xl p-4 text-left space-y-2 mb-6">
              <p className="text-xs text-gray-600 font-semibold">How to open:</p>
              <p className="text-xs text-gray-500">
                Android → Tap <strong>⋮</strong> → "Open in Chrome"
              </p>
              <p className="text-xs text-gray-500">
                iPhone → Tap <strong>⋯</strong> → "Open in Safari"
              </p>
            </div>
            <button
              onClick={() => setShowWebViewWarning(false)}
              className="text-xs text-gray-400 underline"
            >
              Continue anyway
            </button>
          </div>
        </div>
      )}

      {/* Existing Routes — unchanged */}
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Private */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/pipeline" element={<Pipeline />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
