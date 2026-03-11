"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Montserrat } from "next/font/google";
import { authenticate, setSession } from "@/lib/auth";

const brandFont = Montserrat({
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const user = await authenticate(email, password);
    setLoading(false);
    if (!user) {
      setError("Invalid email or password.");
      return;
    }
    setSession(user);
    if (user.role === "owner") return router.replace("/owner");
    if (user.role === "manager") return router.replace("/manager");
    if (user.role === "cashier") return router.replace("/cashier");
    if (user.role === "admin") return router.replace("/admin");
    router.replace("/");
  }

  return (
    <div className="center">
      <div className="card authCard">
        <div className={`logo ${brandFont.className}`}>BREW POS</div>
        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
          <div>
            <label htmlFor="email" className="inputLabel">
              Email
            </label>
            <div className="inputGroup">
              <input
                id="email"
                type="email"
                className="input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="inputLabel">
              Password
            </label>
            <div className="inputGroup" style={{ position: "relative" }}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 18,
                  padding: 4,
                }}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit" className="button buttonPrimary buttonFull" disabled={loading}>
            {loading ? "Logging in…" : "Login"}
          </button>
        </form>
        <div style={{ marginTop: 12, fontSize: 12, color: "var(--muted)", textAlign: "center" }}>
          Please log in using one of the users stored in your Supabase database (see <code>user_admin</code>, <code>user_owner</code>, etc.).
        </div>
      </div>
    </div>
  );
}
