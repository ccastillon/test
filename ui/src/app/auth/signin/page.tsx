// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import SignInForm from "@/app/components/auth/SignInForm";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

interface Props {
  searchParams: {
    callbackUrl?: string;
  };
}

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function SiginPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const { callbackUrl } = searchParams;

  const session = await getServerSession(authOptions);
  if (session && session.user) redirect("/upcoming-events");
  else {
    return (
      <>
        <div className="flex flex-col">
          <div>
            <div className="flex flex-wrap justify-center -mx-3">
              <div className="w-full max-w-full px-3 mx-auto text-center shrink-0 lg:flex-0 lg:w-5/12">
                <Link href="/" type="button">
                  <Image src="/assets/img/icon-logo.webp" alt="FTB logo" width={90} height={90} />
                </Link>
                <h2 className="font-bold pt-6">Welcome to FTBookie</h2>
                <p className="mb-7">Where your winning journey begins</p>
              </div>
            </div>
          </div>
          <div>
            <div className="flex flex-wrap justify-center">
              <div className="w-full max-w-full px-3 mx-auto shrink-0 md:flex-0 md:w-7/12 lg:w-5/12 xl:w-4/12">
                <div className="flex flex-col shadow-soft-2xl border-0 rounded-2xl bg-clip-border">
                  <div className="flex-auto p-6 text-center">
                    <SignInForm callbackUrl={callbackUrl} />
                  </div>

                  <div className="border-black/12.5 rounded-b-2xl border-t-0 border-solid p-6 text-center pt-0 px-1 sm:px-6">
                    <p className="mx-auto mb-4 text-left">
                      New to FTBookie?{" "}
                      <Link href="/auth/signup" className="font-bold text-transparent bg-clip-text bg-black">
                        Create Account
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}