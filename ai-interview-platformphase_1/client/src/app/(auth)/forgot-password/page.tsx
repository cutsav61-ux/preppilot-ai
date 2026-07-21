import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthCard";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { ROUTES } from "@/lib/constants";

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Reset your password"
      description="Enter the email on your account and we'll send you a reset link."
      footer={
        <>
          Remembered it?{" "}
          <Link href={ROUTES.login} className="font-medium text-cobalt">
            Log in
          </Link>
        </>
      }
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
