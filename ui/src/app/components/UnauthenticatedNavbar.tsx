import Link from "next/link";
import Image from "next/image";

export default function UnauthenticatedNavbar() {
  const bar1 = { bar1: "" };
  const bar2 = { bar2: "" };
  const bar3 = { bar3: "" };
  const unauthenticatedMenus = [
    { name: "Rules", href: "/rules" },
    { name: "Log in", href: "/auth/signin" },
    // { name: "Sign Up", href: "/auth/signup" },
  ];
  return (
    <div className="container sticky top-0 z-110 ">
      <div className="flex flex-wrap -mx-3">
        <div className="w-full max-w-full px-3 flex-0">
          <nav className="absolute top-0 left-0 right-0 z-30 flex flex-wrap items-center justify-between w-full px-4 py-3 mx-6 my-4 backdrop-blur-2xl backdrop-saturate-200 rounded-blur lg:flex-nowrap lg:justify-start">
            <div className="container flex flex-wrap items-center justify-between lg-max:overflow-hidden lg:flex-nowrap">
              <Link href="/">
                {/* <img
                  className=" flex justify-center items-center"
                  src="/assets/img/FTB-Logo-155x35px.png"
                  alt="FTB logo"
                ></img> */}
                <Image src="/assets/img/nav-logo.webp" alt="FTB logo" width={155} height={35} />
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
                  <span {...bar2} className="block relative w-5.5 h-px rounded-px bg-slate-700 transition-all duration-200 mx-auto my-0 mt-1.75" />
                  <span
                    {...bar3}
                    className="block relative w-5.5 h-px rounded-px bg-slate-700 transition-all duration-200 mx-auto my-0 mt-1.75 origin-10-90"
                  />
                </span>
              </button>
              <div className="items-center w-full pt-4 pb-2 transition-all duration-350 ease-soft-in-out lg-max:max-h-0 lg-max:overflow-hidden lg-max:hidden lg-max:bg-transparent lg-max:shadow-none md-max:relative grow basis-full rounded-2xl lg:flex lg:basis-auto lg:py-0">
                <ul className="flex flex-col mr-0 mx-auto pl-0 mb-0 list-none md-max:w-full lg:flex-row">
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

                  {/* <li className="relative mx-6 md-max:static group lg:after:content-[''] lg:after:top-0 lg:hover:after:top-full lg:after:absolute lg:after:left-0 lg:after:-bottom-6 lg:after:w-full lg:after:h-full">
            <button
              onClick={() => signIn()}
              className="font-semibold inline-block py-2 mr-1"
            >
              Log in
            </button>
          </li> */}

                  <li>
                    <Link
                      href={"/auth/signup"}
                      className="inline-block px-8 py-2 mb-1 mr-1 font-bold text-center text-white align-middle transition-all border-0 cursor-pointer ease-soft-in-out text-sm leading-pro bg-green-CUSTOM-600 tracking-tight-soft shadow-soft-md bg-150 bg-x-25 rounded-7 hover:scale-102 active:opacity-85"
                    >
                      Sign Up
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
