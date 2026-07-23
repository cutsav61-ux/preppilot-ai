import { Suspense } from "react";
import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthCard";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { Skeleton } from "@/components/ui/Skeleton";
import { ROUTES } from "@/lib/constants";

export default function ResetPasswordPage() {
  return (
    <AuthCard
      title="Choose a new password"
      description="Make it something you haven't used before."
      footer={
        <>
          Remembered your old password?{" "}
          <Link href={ROUTES.login} className="font-medium text-cobalt">
            Log in
          </Link>
        </>
      }
    >
      <Suspense
        fallback={
          <div className="flex flex-col gap-4">
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </AuthCard>
  );
}
