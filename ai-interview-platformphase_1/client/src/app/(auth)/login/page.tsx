import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthCard";
import { LoginForm } from "@/components/auth/LoginForm";
import { ROUTES } from "@/lib/constants";

export default function LoginPage() {
  return (
    <AuthCard
      title="Welcome back"
      description="Log in to pick up your next mock interview."
      footer={
        <>
          Don't have an account?{" "}
          <Link href={ROUTES.signup} className="font-medium text-cobalt">
            Sign up
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthCard>
  );
}
