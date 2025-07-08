import Script from "next/script";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session && session.user) redirect("/upcoming-events");
  return (
    <>
      <div className="relative z-0 flex flex-col min-w-0 break-words bg-red border-0 rounded-2xl bg-clip-border">
        <div className="relative flex items-center min-h-screen p-0 overflow-hidden bg-center bg-cover">
          <div className="container z-1">
            <div className="text-7xl font-bold text-slate-750">
              Start your <br /> winning journey <br /> today
            </div>
            <div className="text-4xl font-semibold mt-6 opacity-60">Sign up, it&apos;s free!</div>
            <Link href="/auth/signup">
              <button
                type="button"
                className="inline-block px-6 py-3 mt-6 mb-0 font-bold text-center text-white uppercase align-middle transition-all border-0 rounded-lg cursor-pointer hover:scale-102 active:opacity-85 hover:shadow-soft-xs bg-green-CUSTOM-600 leading-pro text-xs ease-soft-in-out tracking-tight-soft shadow-soft-md bg-x-25"
              >
                Sign up now &nbsp; <i className="fa fa-arrow-right"></i>
              </button>
            </Link>
            <div className="flex flex-row-reverse">
              <img
                className="hidden absolute inset-y-30 right-50 w-2/5 xl:w-2/5 xl:right-20 xl:block"
                src="/assets/img/ftb-landing-page.gif"
                alt="image description"
              ></img>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
