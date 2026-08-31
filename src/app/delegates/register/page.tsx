import { DelegateRegistrationForm } from "@/components/forms/DelegateRegistrationForm";

export default function DelegateRegisterPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink font-display">Register Your Delegates</h1>
        <p className="mt-1 text-ink-muted">
          Each church may register one delegate for every ten youth (rounding
          up for the remainder). Submissions are reviewed by the election
          committee before delegates can log in to vote -- check with your
          church if you&apos;re not sure your delegates have been verified.
        </p>
      </div>
      <DelegateRegistrationForm />
    </div>
  );
}
