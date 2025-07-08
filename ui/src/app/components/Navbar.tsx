"use client";

import Menus from "./Menus";
import MenuLogo from "./MenuLogo";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const bar1 = { bar1: "" };
  const bar2 = { bar2: "" };
  const bar3 = { bar3: "" };
  const pathname = usePathname();

  // if (session && session.user) {
  //   return <AuthenticatedNavbar />;
  // } else {
  //   return <UnauthenticatedNavbar />;
  // }

  if (pathname.includes("/auth/account-created")) {
    return null;
  }
  return (
    <div className="container sticky top-0 z-110 ">
      <div className="flex flex-wrap -mx-3">
        <div className="w-full max-w-full px-3 flex-0">
          <nav className="absolute top-0 left-0 right-0 z-30 flex flex-wrap items-center justify-between w-full px-4 py-4 mx-6 backdrop-blur-2xl backdrop-saturate-200 rounded-blur lg:flex-nowrap lg:justify-start">
            <div className="container flex flex-wrap items-center justify-between lg-max:overflow-hidden lg:flex-nowrap">
              <MenuLogo />
              <button
                aria-expanded="false"
                nav-collapse-trigger=""
                className="px-3 py-1 ml-2 leading-none bg-transparent rounded-lg shadow-none cursor-pointer lg:hidden text-lg text-slate-700"
              >
                <span className="inline-block mt-2 align-middle w-6 h-6 bg-none">
                  <span
                    {...bar1}
                    className="block relative w-5.5 h-px rounded-px bg-slate-700 transition-all duration-200 mx-auto my-0 origin-10-10"
                  />
                  <span
                    {...bar2}
                    className="block relative w-5.5 h-px rounded-px bg-slate-700 transition-all duration-200 mx-auto my-0 mt-1.75"
                  />
                  <span
                    {...bar3}
                    className="block relative w-5.5 h-px rounded-px bg-slate-700 transition-all duration-200 mx-auto my-0 mt-1.75 origin-10-90"
                  />
                </span>
              </button>
              <div className="items-center w-full pt-4 pb-2 transition-all duration-350 ease-soft-in-out lg-max:max-h-0 lg-max:overflow-hidden lg-max:hidden lg-max:bg-transparent lg-max:shadow-none md-max:relative grow basis-full rounded-2xl lg:flex lg:basis-auto lg:py-0">
                <Menus />
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
