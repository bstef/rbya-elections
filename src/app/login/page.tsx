import { LoginForm } from "@/components/forms/LoginForm";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Delegate Login</h1>
        <p className="mt-1 text-slate-600">
          Enter the email your church registered you with. We&apos;ll send you a
          secure sign-in link -- no password needed.
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
