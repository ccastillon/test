import ChangePasswordForm from "@/app/components/account/ChangePasswordForm";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "FTBookie - Change Password",
};

export default function ChangePasswordPage() {
  return (
    <div className="w-full h-full">
      <div
        className="relative flex flex-col w-full min-w-0 break-words bg-white border-0 dark:bg-gray-950 dark:shadow-soft-dark-xl shadow-soft-xl rounded-2xl bg-clip-border"
        id="balance"
      >
        <ChangePasswordForm />
      </div>
    </div>
  );
}
