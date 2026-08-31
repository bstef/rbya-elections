import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink font-display">Election Committee Login</h1>
        <p className="mt-1 text-ink-muted">
          Admin accounts are provisioned by the committee directly and are
          not available via public sign-up.
        </p>
      </div>
      <AdminLoginForm />
    </div>
  );
}
