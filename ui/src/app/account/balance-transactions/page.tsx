import Balance from "@/app/components/account/UserBalance";
import Transactions from "@/app/components/account/UserTransactions";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "FTBookie - Account Balance and Transactions",
};

export default async function BalanceTransactionsPage() {
  return (
    <>
      <div className="flex flex-col w-full h-full">
        <Suspense fallback={<div>Loading your account balance...</div>}>
          <Balance />
        </Suspense>
        <Suspense fallback={<div>Loading your transactions...</div>}>
          <Transactions />
        </Suspense>
      </div>
    </>
  );
}
