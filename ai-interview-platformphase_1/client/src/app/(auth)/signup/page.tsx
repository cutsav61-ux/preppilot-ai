import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthCard";
import { SignupForm } from "@/components/auth/SignupForm";
import { ROUTES } from "@/lib/constants";

export default function SignupPage() {
  return (
    <AuthCard
      title="Create your account"
      description="Start practicing in under a minute — no card required."
      footer={
        <>
          Already have an account?{" "}
          <Link href={ROUTES.login} className="font-medium text-cobalt">
            Log in
          </Link>
        </>
      }
    >
      <SignupForm />
    </AuthCard>
  );
}
