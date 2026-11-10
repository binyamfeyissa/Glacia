import { BlockBackdrop } from "../internal/block-backdrop";
import * as React from "react";
import { Glass } from "../glass";
import { Button } from "../button";
import { Input } from "../input";
import { Label } from "../label";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "../input-otp";

export interface ForgotPasswordBlockProps {
  /** Backdrop image behind the block. */
  image?: string;
}

export function ForgotPasswordBlock({ image }: ForgotPasswordBlockProps) {
  const [step, setStep] = React.useState<1 | 2>(1);
  const [email, setEmail] = React.useState("alex.morgan@apple.com");
  const [otp, setOtp] = React.useState("");
  const [resendTimer, setResendTimer] = React.useState(54);

  React.useEffect(() => {
    if (step === 2 && resendTimer > 0) {
      const timer = setInterval(() => setResendTimer((t) => t - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [step, resendTimer]);

  return (
    <BlockBackdrop image={image}>
    <div className="gl-forgot-password-block">
      <Glass className="gl-auth-card gl-forgot-card">
        <div className="gl-auth-icon-squircle">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        <div className="gl-auth-header">
          <h2 className="gl-auth-title">
            {step === 1 ? "Apple ID Recovery" : "Enter Verification Code"}
          </h2>
          <p className="gl-auth-desc">
            {step === 1
              ? "Enter your trusted Apple ID email address to receive an authentication code."
              : `A six-digit verification code has been sent to ${email}.`}
          </p>
        </div>

        {step === 1 ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setStep(2);
            }}
            className="gl-auth-form"
          >
            <div className="gl-auth-field">
              <Label htmlFor="recovery-email">Apple ID Email</Label>
              <Input
                id="recovery-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
              />
            </div>

            <Button type="submit" variant="filled" className="gl-auth-submit-btn">
              Send Verification Code
            </Button>
          </form>
        ) : (
          <div className="gl-otp-step-wrap">
            <div className="gl-otp-picker-center">
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button
              type="button"
              variant="filled"
              disabled={otp.length < 6}
              className="gl-auth-submit-btn"
              onClick={() => alert("Verification successful! Security credentials updated.")}
            >
              Verify & Reset Password
            </Button>

            <div className="gl-auth-resend-row">
              {resendTimer > 0 ? (
                <span className="gl-resend-countdown">Resend code in {resendTimer}s</span>
              ) : (
                <button
                  type="button"
                  className="gl-resend-btn"
                  onClick={() => setResendTimer(60)}
                >
                  Resend code
                </button>
              )}
            </div>
          </div>
        )}

        <div className="gl-auth-footer-nav">
          <button
            type="button"
            className="gl-auth-link"
            onClick={() => setStep(step === 1 ? 2 : 1)}
          >
            {step === 1 ? "Already have a code?" : "← Back to email"}
          </button>
        </div>
      </Glass>
    </div>
    </BlockBackdrop>
  );
}
