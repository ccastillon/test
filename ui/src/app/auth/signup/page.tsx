import { authOptions } from "@/lib/auth";
import { LoadScript } from "@/app/components/ScriptLoader";
import SignUpForm from "@/app/components/auth/SignUpForm";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SignupPage() {
  const session = await getServerSession(authOptions);
  if (session && session.user) redirect("/upcoming-events");
  return (
    <>
      <div className="flex flex-col">
        <div>
          <div className="flex flex-wrap justify-center -mx-3">
            <div className="w-full max-w-full px-3 mx-auto text-center shrink-0 lg:flex-0 lg:w-5/12">
              <Link href="/" type="button">
                <Image
                  src="/assets/img/icon-logo.webp"
                  alt="FTB logo"
                  width={90}
                  height={90}
                />
              </Link>
              <h2 className="font-bold pt-6">Sign up to FTBookie</h2>
              <p className="mb-7">Enter your details to register for free</p>
            </div>
          </div>
        </div>
        <div>
          <div className="flex flex-wrap justify-center">
            <div className="w-full max-w-full px-3 mx-auto shrink-0 md:flex-0 md:w-7/12 lg:w-5/12 xl:w-4/12">
              <div className="flex flex-col shadow-soft-2xl border-0 rounded-2xl bg-clip-border mb-4">
                <div className="flex-auto p-6 text-center">
                  <SignUpForm />
                </div>

                <div className="border-black/12.5 rounded-b-2xl border-t-0 border-solid p-6 text-center pt-0 px-1 sm:px-6">
                  <p className="mx-auto mb-4 text-left">
                    Already have an account?{" "}
                    <Link
                      href="/auth/signin"
                      className="font-bold text-transparent bg-clip-text bg-black"
                    >
                      Log in
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="relative flex items-center min-h-screen p-0 overflow-hidden bg-center bg-cover">
        <div className="container z-1 mb-2">
          <div className="flex justify-center -mx-3">
            <div className="flex items-center flex-col w-full max-w-full px-3 mx-auto lg:mx-0 shrink-0 md:flex-0 md:w-7/12 lg:w-5/12 xl:w-4/12">
              <Link href="/" type="button">
                <Image
                  src="/assets/img/FTB-Logo-90x90px.png"
                  alt="FTB logo"
                  width={90}
                  height={90}
                />
              </Link>
              <div className="relative flex flex-col min-w-0 break-words bg-transparent border-0 shadow-none lg:py4 dark:bg-gray-950 rounded-2xl bg-clip-border">
                <div className="p-6 pb-0 mb-0">
                  <h2 className="font-bold text-center">Sign up to FTBookie</h2>
                  <p className="mb-7 text-center">
                    Enter your details to register for free
                  </p>
                </div>

                <div className="flex flex-col shadow-soft-2xl border-0 rounded-2xl bg-clip-border">
                  <div className="flex-auto p-6 m-2">
                    <SignUpForm />
                  </div>
                  <div className="border-black/12.5 rounded-b-2xl border-t-0 border-solid p-6 text-center pt-0 px-1 sm:px-6">
                    <p className="mx-auto mb-4 text-left">
                      Already have an account?{" "}
                      <Link
                        href="/auth/signin"
                        className="font-bold text-transparent bg-clip-text bg-black"
                      >
                        Log in
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <LoadScript
        scripts={[
          // "/assets/js/soft-ui-dashboard-pro-tailwind.js?v=1.0.1",
          "/assets/js/plugins/flatpickr.min.js",
        ]}
      />
    </>
  );
}
