"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MyBetsNavbar() {
  const pathname = usePathname();
  const activeAtr = { active: "" };
  const navs = [
    { name: "Active Bets", href: "/my-bets/active-bets" },
    { name: "All Results", href: "/my-bets/all-results" },
    { name: "Won", href: "/my-bets/won" },
    { name: "Lost", href: "/my-bets/lost" },
    { name: "Withdrawn", href: "/my-bets/withdrawn" },
  ];

  return (
    <>
      <div className="w-full mx-auto mt-6">
        <div className="flex flex-wrap items-center -mx-3">
          <div className="w-full max-w-full sm:flex-0 shrink-0 sm:w-8/12 lg:w-4/12">
            <div className="relative right-0">
              <ul
                // nav-pills=""
                className="relative flex flex-wrap p-1 mb-0 list-none dark:shadow-soft-dark-xl dark:bg-gray-950 rounded-xl bg-gray-50"
                role="tablist"
              >
                {navs.map((nav, i) => {
                  const active = nav.href === pathname ? { active: "" } : {};
                  const isSelected = nav.href === pathname;
                  return (
                    <li key={nav.href} className="z-30 flex-auto text-center">
                      <Link
                        {...active}
                        nav-link=""
                        className={`block w-full py-1 transition-colors border-0 rounded-lg ease-soft-in-out dark:text-white ${
                          isSelected ? "active-tab" : "bg-none"
                        }`}
                        href={nav.href}
                        role="tab"
                        aria-selected={isSelected}
                      >
                        {nav.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
