import Link from "next/link";
import Image from "next/image";

export default function AuthenticatedNavbar() {
  const bar1 = { bar1: "" };
  const bar2 = { bar2: "" };
  const bar3 = { bar3: "" };
  const authenticatedMenus = [
    { name: "Weather Forecast API", href: "/weatherForecastApi" },
    { name: "Upcoming Events", href: "/upcomingEvents" },
    { name: "My Bets", href: "/myBets" },
    { name: "My Account", href: "/myAccount" },
    { name: "Log Out", href: "/api/auth/signout" },
  ];
  return (
    <div className="container sticky top-0 z-110 ">
      <div className="flex flex-wrap -mx-3">
        <div className="w-full max-w-full px-3 flex-0">
          <nav className="absolute top-0 left-0 right-0 z-30 flex flex-wrap items-center justify-between w-full px-4 py-3 mx-6 my-4 backdrop-blur-2xl backdrop-saturate-200 rounded-blur lg:flex-nowrap lg:justify-start">
            <div className="container flex flex-wrap items-center justify-between lg-max:overflow-hidden lg:flex-nowrap">
              <Link href="/upcoming-events">
                {/* <img
                  className=" flex justify-center items-center"
                  src="/assets/img/FTB-Logo-155x35px.png"
                  alt="FTB logo"
                ></img> */}
                <Image
                  src="/assets/img/nav-logo.webp"
                  alt="FTB logo"
                  width={155}
                  height={35}
                />
              </Link>
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
                <ul className="flex flex-col mr-0 mx-auto pl-0 mb-0 list-none md-max:w-full lg:flex-row">
                  {authenticatedMenus.map((menu) => (
                    <li
                      key={menu.name}
                      className="relative mx-6 group md-max:static lg:after:content-[''] lg:after:top-0 lg:hover:after:top-full lg:after:absolute lg:after:left-0 lg:after:-bottom-6 lg:after:w-full lg:after:h-full"
                    >
                      <Link
                        href={menu.href}
                        className=" font-semibold inline-block py-2 mr-1"
                      >
                        {menu.name === "Log Out" ? (
                          <div className="flex">
                            <div>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                className="relative bottom-0"
                              >
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
                  ))}
                </ul>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
