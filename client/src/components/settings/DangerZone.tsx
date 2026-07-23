"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Download, Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { useExportData, useDeleteAccount } from "@/hooks/useSettings";
import { deleteAccountSchema, type DeleteAccountFormValues } from "@/lib/validators/settings";

export function DangerZone() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const exportData = useExportData();
  const deleteAccount = useDeleteAccount();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DeleteAccountFormValues>({ resolver: zodResolver(deleteAccountSchema) });

  const onConfirmDelete = handleSubmit(async (values) => {
    try {
      await deleteAccount.mutateAsync(values.password);
    } catch {
      // Error toast handled inside useDeleteAccount's onError.
    }
  });

  return (
    <>
      <Card className="border-coral/30">
        <CardHeader>
          <CardTitle>Danger zone</CardTitle>
          <CardDescription>Export your data, or permanently delete your account.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row">
          <Button
            variant="outline"
            onClick={() => exportData.mutate()}
            isLoading={exportData.isPending}
          >
            <Download className="size-4" />
            Export my data
          </Button>
          <Button variant="destructive" onClick={() => setShowDeleteModal(true)}>
            <Trash2 className="size-4" />
            Delete account
          </Button>
        </CardContent>
      </Card>

      <Modal
        open={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          reset();
        }}
        title="Delete your account?"
        description="This permanently deletes your profile and every interview you've completed. This can't be undone."
      >
        <form onSubmit={onConfirmDelete} noValidate className="flex flex-col gap-4">
          <PasswordInput
            label="Confirm your password"
            error={errors.password?.message}
            {...register("password")}
          />
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setShowDeleteModal(false);
                reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="destructive" isLoading={deleteAccount.isPending}>
              Delete permanently
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
