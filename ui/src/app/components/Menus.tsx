"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Menus() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const authenticatedMenus = [
    { name: "Upcoming Matches", href: "/upcoming-events" },
    { name: "My Bets", href: "/my-bets/active-bets" },
    { name: "My Account", href: "/account/balance-transactions" },
    { name: "Log Out", href: "/api/auth/signout" },
  ];

  const unauthenticatedMenus = [
    { name: "Rules", href: "/rules" },
    { name: "Log in", href: "/auth/signin" },
    // { name: "Sign Up", href: "/auth/signup" },
  ];

  return (
    <ul className="flex flex-col mr-0 mx-auto pl-0 mb-0 list-none md-max:w-full lg:flex-row">
      {session && session.user ? (
        <>
          {authenticatedMenus.map((menu) => {
            const path = pathname.split("/")[1];
            return (
              <li
                key={menu.name}
                className="relative mx-6 group md-max:static lg:after:content-[''] lg:after:top-0 lg:hover:after:top-full lg:after:absolute lg:after:left-0 lg:after:-bottom-6 lg:after:w-full lg:after:h-full"
              >
                <Link href={menu.href} className={`inline-block py-2 mr-1 ${menu.href.includes(path) ? "font-bold" : "font-semibold"}`}>
                  {menu.name === "Log Out" ? (
                    <div className="flex">
                      <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="relative bottom-0">
                          <path
                            d="M2.0999 2.09998C1.71331 2.09998 1.3999 2.41338 1.3999 2.79998V11.2C1.3999 11.5866 1.71331 11.9 2.0999 11.9C2.4865 11.9 2.7999 11.5866 2.7999 11.2V2.79998C2.7999 2.41338 2.4865 2.09998 2.0999 2.09998Z"
                            fill="#64748B"
                          />
                          <path
                            d="M9.30523 8.60504C9.03188 8.87839 9.03188 9.32163 9.30523 9.59498C9.57858 9.86833 10.0218 9.86833 10.2952 9.59498L12.3952 7.49498C12.5264 7.36373 12.6002 7.18565 12.6002 7.00001C12.6002 6.81436 12.5264 6.63631 12.3952 6.50503L10.2952 4.40504C10.0218 4.13167 9.57858 4.13167 9.30523 4.40504C9.03188 4.67841 9.03188 5.12162 9.30523 5.39499L10.2103 6.30001H4.9002C4.51359 6.30001 4.2002 6.61342 4.2002 7.00001C4.2002 7.38662 4.5136 7.70001 4.9002 7.70001H10.2103L9.30523 8.60504Z"
                            fill="#111827"
                          />
                        </svg>
                      </div>
                      <div> {menu.name}</div>
                    </div>
                  ) : (
                    menu.name
                  )}
                </Link>
              </li>
            );
          })}
        </>
      ) : (
        <>
          {unauthenticatedMenus.map((menu) => (
            <li
              key={menu.name}
              className="relative mx-6 group md-max:static lg:after:content-[''] lg:after:top-0 lg:hover:after:top-full lg:after:absolute lg:after:left-0 lg:after:-bottom-6 lg:after:w-full lg:after:h-full"
            >
              <Link href={menu.href} className=" font-semibold inline-block py-2 mr-1">
                {menu.name}
              </Link>
            </li>
          ))}

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
