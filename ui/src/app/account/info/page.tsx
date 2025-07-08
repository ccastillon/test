import React, { Suspense } from "react";
import Script from "next/script";
import { Metadata } from "next";
import Link from "next/link";
import AccountInfo from "@/app/components/account/AccountInfo";

export const metadata: Metadata = {
  title: "FTBookie - Account Info",
};

export default async function InfoPage() {
  return (
    <>
      <div className="w-full h-full">
        <div
          className="relative flex flex-col w-full h-150 min-w-0 bg-white border-0 dark:bg-gray-950 dark:shadow-soft-dark-xl shadow-soft-xl rounded-2xl bg-clip-border"
          id="acct-info"
        >
          <div className="flex justify-between p-6 mb-0 rounded-t-2xl">
            <h5 className="inline-block mt-2 font-bold dark:text-white">
              Account Info
            </h5>
            <Link
              href="/account/edit-info"
              type="button"
              className="inline-block px-8 py-3 mr-3 font-bold text-center uppercase align-middle transition-all bg-transparent border rounded-lg cursor-pointer border-slate-700 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:scale-102 active:opacity-85 hover:shadow-soft-xs text-slate-700"
            >
              Edit
            </Link>
          </div>

          <Suspense fallback={<div>Loading account info...</div>}>
            <AccountInfo />
          </Suspense>
        </div>
      </div>
      <Script src="/assets/js/plugins/flatpickr.min.js"></Script>
    </>
  );
}
