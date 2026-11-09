import { useState, type FormEvent } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../card";
import { Button } from "../button";
import { Input } from "../input";
import { Label } from "../label";
import { Checkbox } from "../checkbox";
import { Separator } from "../separator";

export interface SignupBlockProps {
  onSubmit?: (data: { name: string; email: string }) => void;
  onLoginClick?: () => void;
}

export function SignupBlock({ onSubmit, onLoginClick }: SignupBlockProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);

  // Simple password strength calculator (0 to 4)
  const getPasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strength = getPasswordStrength(password);
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["#ff3b30", "#ff9500", "#0088ff", "#34c759"];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!agreed) return;
    onSubmit?.({ name, email });
  };

  return (
    <div className="gl-signup-block flex justify-center items-center py-8">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center space-y-1">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-2xl mb-2">
            
          </div>
          <CardTitle className="text-2xl font-bold">Create Your Account</CardTitle>
          <CardDescription>
            One account connects your services with Liquid Glass security.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Social fast signup */}
            <div className="space-y-2">
              <Button variant="filled" className="w-full" type="button">
                Continue with Passkey
              </Button>
            </div>

            <div className="gl-login-divider my-4 flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-xs uppercase opacity-50 font-medium">Or enter details</span>
              <Separator className="flex-1" />
            </div>

            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="signup-name">Full Name</Label>
              <Input
                id="signup-name"
                type="text"
                placeholder="Jane Doe"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="signup-email">Email Address</Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="jane@icloud.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="signup-password">Password</Label>
              <Input
                id="signup-password"
                type="password"
                placeholder="••••••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {password.length > 0 && (
                <div className="space-y-1 pt-1">
                  <div className="flex gap-1 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className="flex-1 transition-all duration-300"
                        style={{
                          backgroundColor:
                            step <= strength
                              ? strengthColors[strength - 1] || "#0088ff"
                              : "transparent",
                        }}
                      />
                    ))}
                  </div>
                  <span
                    className="text-xs font-medium"
                    style={{ color: strengthColors[strength - 1] || "var(--gl-muted)" }}
                  >
                    Strength: {strengthLabels[strength - 1] || "Too short"}
                  </span>
                </div>
              )}
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start gap-2 pt-1">
              <Checkbox
                id="signup-terms"
                checked={agreed}
                onCheckedChange={(checked) => setAgreed(Boolean(checked))}
              />
              <Label htmlFor="signup-terms" className="text-xs leading-relaxed opacity-80 cursor-pointer">
                I agree to the Terms of Service and Privacy Policy for Glacia services.
              </Label>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button
              type="submit"
              variant="filled"
              className="w-full"
              disabled={!agreed}
            >
              Create Account
            </Button>
            <p className="text-xs text-center opacity-70">
              Already have an account?{" "}
              <button
                type="button"
                className="underline hover:opacity-100 font-medium"
                onClick={onLoginClick}
              >
                Sign In
              </button>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
