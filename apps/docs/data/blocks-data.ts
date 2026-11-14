export const BLOCKS = [
  {
    slug: "dashboard",
    title: "Admin dashboard",
    description:
      "A complete administration screen with a floating glass sidebar, live KPI cards, revenue flow, and an orders table. Built from Sidebar, Card, Badge, Button, and Table.",
    componentsUsed: ["Sidebar", "Card", "Badge", "Button", "Table"],
    code: `import { AdminDashboard } from "glacia";

export default function DashboardRoute() {
  return <AdminDashboard />;
}`,
  },
  {
    slug: "login",
    title: "Login page",
    description:
      "A production-ready authentication screen with a centered glass card, email and password fields, OAuth providers, and remember-me. Also available in a split layout.",
    componentsUsed: ["Card", "Input", "Button", "Label", "Checkbox", "Separator"],
    code: `import { LoginPage } from "glacia";

export default function LoginRoute() {
  return (
    <LoginPage
      layout="centered"
      onSubmit={() => console.log("Login submitted")}
    />
  );
}`,
  },
  {
    slug: "settings",
    title: "System settings",
    description:
      "An authentic Apple macOS/iPadOS Preferences window with a categorized glass sidebar, appearance options, haptics, and volume controls.",
    componentsUsed: ["Sidebar", "Card", "Item", "Switch", "Slider", "SegmentedControl", "Button", "Avatar", "Separator"],
    code: `import { SettingsBlock } from "glacia";

export default function SettingsRoute() {
  return <SettingsBlock image={BACKDROP} />;
}`,
  },
  {
    slug: "profile",
    title: "User profile",
    description:
      "Apple ID contact card profile with an avatar hero, linked Apple devices, verification badge, and contact action buttons.",
    componentsUsed: ["Card", "Item", "Avatar", "Badge", "Button", "Separator"],
    code: `import { ProfileBlock } from "glacia";

export default function ProfileRoute() {
  return <ProfileBlock image={BACKDROP} />;
}`,
  },
  {
    slug: "signup",
    title: "Account registration",
    description:
      "Apple onboarding account creation screen with real-time animated password strength meter, passkey option, and terms agreement.",
    componentsUsed: ["Card", "Input", "Button", "Label", "Checkbox", "Separator"],
    code: `import { SignupBlock } from "glacia";

export default function SignupRoute() {
  return <SignupBlock image={BACKDROP} />;
}`,
  },
  {
    slug: "calendar-page",
    title: "Calendar application",
    description:
      "A complete Apple macOS Calendar app with left sidebar mini-picker, iCloud account categories, upcoming agenda, and 7-column month grid with interactive event pills.",
    componentsUsed: ["Calendar", "SegmentedControl", "Glass", "Button", "Badge"],
    code: `import { CalendarPageBlock } from "glacia";

export default function CalendarRoute() {
  return <CalendarPageBlock image={BACKDROP} />;
}`,
  },
  {
    slug: "pricing",
    title: "Pricing & tiers",
    description:
      "Apple-style subscription tier comparison with annual billing discount toggle, featured refractive Pro card, and feature checklists.",
    componentsUsed: ["Glass", "Button", "Switch", "Badge"],
    code: `import { PricingBlock } from "glacia";

export default function PricingRoute() {
  return <PricingBlock image={BACKDROP} />;
}`,
  },
  {
    slug: "landing",
    title: "Product launch landing",
    description:
      "Apple keynote marketing page with floating glass pill navigation, glowing gradient headline, 3-column feature cards, and metrics banner.",
    componentsUsed: ["Glass", "Button", "Badge"],
    code: `import { LandingBlock } from "glacia";

export default function LandingRoute() {
  return <LandingBlock image={BACKDROP} />;
}`,
  },
  {
    slug: "forgot-password",
    title: "Account recovery & OTP",
    description:
      "Apple ID password recovery with trusted email entry, 6-digit InputOTP code verification, resend countdown, and passkey support.",
    componentsUsed: ["InputOTP", "Input", "Label", "Button", "Glass"],
    code: `import { ForgotPasswordBlock } from "glacia";

export default function ForgotPasswordRoute() {
  return <ForgotPasswordBlock image={BACKDROP} />;
}`,
  },
  {
    slug: "error-page",
    title: "Error & 404 screen",
    description:
      "Apple system error screen with floating glass status card, glowing 404 frosted typography, and recovery action buttons.",
    componentsUsed: ["Glass", "Button", "Badge"],
    code: `import { ErrorPageBlock } from "glacia";

export default function ErrorRoute() {
  return <ErrorPageBlock code="404" />;
}`,
  },
  {
    slug: "boarding-pass",
    title: "Boarding pass",
    description:
      "A flight boarding pass with a dominant route and times, a labelled detail grid, and a perforated stub carrying the seat and a generated barcode. Collapses to a single column on narrow screens.",
    componentsUsed: ["Glass", "Badge"],
    code: `import { BoardingPassBlock } from "glacia";

export default function FlightRoute() {
  return (
    <BoardingPassBlock
      passenger="A. Rivera"
      date="12 Nov"
      seat="14A"
      boardingGroup="2"
      barcodeValue="GL208-14A"
      flight={{
        airline: "Glacia Air",
        flightNumber: "GA 208",
        from: "SFO",
        fromCity: "San Francisco",
        to: "NRT",
        toCity: "Tokyo",
        departure: "11:40",
        arrival: "15:25 +1",
        duration: "11h 05m",
        terminal: "2",
        gate: "B14",
      }}
    />
  );
}`,
  },
  {
    slug: "activity",
    title: "Activity feed",
    description:
      "A chronological feed grouped by day, with a continuous rail connecting markers. Entries carry a tone so approvals, warnings and failures are distinguishable at a glance rather than only by text.",
    componentsUsed: ["Glass", "Badge"],
    code: `import { ActivityBlock } from "glacia";

export default function ActivityRoute() {
  return (
    <ActivityBlock
      title="Activity"
      summary="Everything that happened this week"
      entries={[
        {
          id: "a1",
          actor: "Mina",
          action: "approved the production deploy",
          time: "09:42",
          day: "Today",
          tone: "positive",
          initials: "MI",
        },
      ]}
    />
  );
}`,
  },

];
