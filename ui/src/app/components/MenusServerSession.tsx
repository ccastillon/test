import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function MenusServerSession() {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  //   if (!session && !session?.user) redirect("/auth/signin");
  return (
    <ul className="flex flex-col mr-0 mx-auto pl-0 mb-0 list-none md-max:w-full lg:flex-row">
      {session && session.user ? (
        <>
          <li className="relative mx-6 group md-max:static lg:after:content-[''] lg:after:top-0 lg:hover:after:top-full lg:after:absolute lg:after:left-0 lg:after:-bottom-6 lg:after:w-full lg:after:h-full">
            <Link href={"/profile"} className=" font-semibold inline-block py-2 mr-1">
              {session.user.username}
            </Link>
          </li>
          <li className="relative mx-6 group md-max:static lg:after:content-[''] lg:after:top-0 lg:hover:after:top-full lg:after:absolute lg:after:left-0 lg:after:-bottom-6 lg:after:w-full lg:after:h-full">
            <Link href={"/api/auth/signout"} className=" font-semibold inline-block py-2 mr-1">
              Sign Out
            </Link>
          </li>
        </>
      ) : (
        <>
          <li className="relative mx-6 group md-max:static lg:after:content-[''] lg:after:top-0 lg:hover:after:top-full lg:after:absolute lg:after:left-0 lg:after:-bottom-6 lg:after:w-full lg:after:h-full">
            <Link href="/rules" className=" font-semibold inline-block py-2 mr-1">
              Rules
            </Link>
          </li>

          <li className="relative mx-6 md-max:static group lg:after:content-[''] lg:after:top-0 lg:hover:after:top-full lg:after:absolute lg:after:left-0 lg:after:-bottom-6 lg:after:w-full lg:after:h-full">
            <Link href="/auth/signin" className="font-semibold inline-block py-2 mr-1">
              Log in
            </Link>
            {/* <button
              onClick={() => signIn()}
              className="font-semibold inline-block py-2 mr-1"
            >
              Log in
            </button> */}
          </li>

          <li>
            <Link
              href={"/auth/signup"}
              className="inline-block px-8 py-2 mb-1 mr-1 font-bold text-center text-white align-middle transition-all border-0 cursor-pointer ease-soft-in-out text-sm leading-pro bg-green-CUSTOM-600 tracking-tight-soft shadow-soft-md bg-150 bg-x-25 rounded-7 hover:scale-102 active:opacity-85"
            >
              Sign Up
            </Link>
          </li>
        </>
      )}
    </ul>
  );
}
