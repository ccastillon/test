import Script from "next/script";
import { Metadata } from "next";
import EditAccountInfoForm from "@/app/components/account/EditAccountInfoForm";
import { getUserData } from "@/lib/actions/accountInfoActions";
import { LoadScript } from "@/app/components/ScriptLoader";

export const metadata: Metadata = {
  title: "FTBookie - Account Info",
};

export default async function EditInfoPage() {
  const user = await getUserData();
  return (
    <>
      <div className="w-full h-full">
        <div
          className="relative flex flex-col w-full h-150 min-w-0 bg-white border-0 dark:bg-gray-950 dark:shadow-soft-dark-xl shadow-soft-xl rounded-2xl bg-clip-border"
          id="acct-info"
        >
          <EditAccountInfoForm user={user} />
        </div>
      </div>

      <LoadScript
        scripts={[
          // "/assets/js/soft-ui-dashboard-pro-tailwind.js?v=1.0.1",
          "/assets/js/plugins/flatpickr.min.js",
        ]}
      />
    </>
  );
}
