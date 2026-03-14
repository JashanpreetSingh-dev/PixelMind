import { redirect } from "next/navigation";
import { fetchMe } from "@/lib/api";
import OnboardingContent from "./OnboardingContent";

export default async function OnboardingPage() {
  let alreadyOnboarded = false;
  try {
    const me = await fetchMe();
    if (me?.onboarding_completed === true) {
      alreadyOnboarded = true;
    }
  } catch {
    // If the API is unreachable, render onboarding so the user can still proceed.
  }
  if (alreadyOnboarded) redirect("/app");

  return <OnboardingContent />;
}
