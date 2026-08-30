import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Election Committee Login</h1>
        <p className="mt-1 text-slate-600">
          Admin accounts are provisioned by the committee directly and are
          not available via public sign-up.
        </p>
      </div>
      <AdminLoginForm />
    </div>
  );
}
