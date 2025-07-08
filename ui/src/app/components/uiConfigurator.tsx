// @ts-nocheck
"use client";

import { useSession } from "next-auth/react";

export default function UIConfigurator() {
  const { data: session } = useSession();
  return (
    <>
      {session && session.user ? (
        <div fixed-plugin="">
          <a
            fixed-plugin-button=""
            className="fixed px-4 py-2 text-xl bg-white cursor-pointer bottom-7 right-7 z-990 shadow-soft-lg rounded-circle text-slate-700"
            aria-expanded="false"
          >
            <i
              className="py-2 pointer-events-none fa fa-cog"
              aria-hidden="true"
            >
              {" "}
            </i>
          </a>
          {/* -right-90 in loc de 0*/}
          <div
            fixed-plugin-card=""
            className="dark:bg-gray-950/80 z-sticky shadow-soft-3xl w-90 ease-soft -right-90 fixed top-0 left-auto flex h-full min-w-0 flex-col break-words rounded-none border-0 bg-white/80 bg-clip-border px-2.5 backdrop-blur-2xl backdrop-saturate-200 duration-200"
          >
            <div className="px-6 pt-4 pb-0 mb-0 border-b-0 rounded-t-2xl">
              <div className="float-left">
                <h5 className="mt-4 mb-0 dark:text-white">
                  Soft UI Configurator
                </h5>
                <p className="dark:text-white dark:opacity-60">
                  See our dashboard options.
                </p>
              </div>
              <div className="float-right mt-6">
                <button
                  fixed-plugin-close-button=""
                  className="inline-block p-0 mb-4 text-xs font-bold text-center uppercase align-middle transition-all bg-transparent border-0 rounded-lg shadow-none cursor-pointer hover:scale-102 leading-pro ease-soft-in tracking-tight-soft bg-150 bg-x-25 active:opacity-85 text-slate-700 dark:text-white"
                >
                  <i className="fa fa-close" aria-hidden="true" />
                </button>
              </div>
              {/* End Toggle Button */}
            </div>
            <hr className="h-px mx-0 my-1 bg-transparent bg-gradient-to-r from-transparent via-black/40 to-transparent dark:bg-gradient-to-r dark:from-transparent dark:via-white dark:to-transparent" />
            <div className="flex-auto p-6 pt-0 sm:pt-4">
              {/* Sidebar Backgrounds */}
              <div>
                <h6 className="mb-0 dark:text-white">Sidebar Colors</h6>
              </div>
              <a className="switch-trigger background-color">
                <div className="my-2 text-left" sidenav-colors="">
                  <span
                    className="py-2.2 text-xs px-2.2 rounded-circle h-5.6 mr-1.25 w-5.6 ease-soft-in-out bg-gradient-to-tl from-purple-700 to-pink-500 relative inline-block cursor-pointer whitespace-nowrap border border-solid border-slate-700 text-center align-baseline font-bold uppercase leading-none text-white transition-all duration-200 hover:border-slate-700"
                    active-color=""
                    data-color-from="purple-700"
                    data-color-to="pink-500"
                    onClick={(e) => sidebarColor(e.currentTarget)}
                  />
                  <span
                    className="py-2.2 text-xs px-2.2 rounded-circle h-5.6 mr-1.25 w-5.6 ease-soft-in-out bg-gradient-to-tl from-gray-900 to-slate-800 dark:bg-gradient-to-tl dark:from-slate-850 dark:to-gray-850 relative inline-block cursor-pointer whitespace-nowrap border border-solid border-white text-center align-baseline font-bold uppercase leading-none text-white transition-all duration-200 hover:border-slate-700"
                    data-color-from="gray-900"
                    data-color-to="slate-800"
                    onClick={(e) => sidebarColor(e.currentTarget)}
                  />
                  <span
                    className="py-2.2 text-xs px-2.2 rounded-circle h-5.6 mr-1.25 w-5.6 ease-soft-in-out bg-gradient-to-tl from-blue-600 to-cyan-400 relative inline-block cursor-pointer whitespace-nowrap border border-solid border-white text-center align-baseline font-bold uppercase leading-none text-white transition-all duration-200 hover:border-slate-700"
                    data-color-from="blue-600"
                    data-color-to="cyan-400"
                    onClick={(e) => sidebarColor(e.currentTarget)}
                  />
                  <span
                    className="py-2.2 text-xs px-2.2 rounded-circle h-5.6 mr-1.25 w-5.6 ease-soft-in-out bg-gradient-to-tl from-green-600 to-lime-400 relative inline-block cursor-pointer whitespace-nowrap border border-solid border-white text-center align-baseline font-bold uppercase leading-none text-white transition-all duration-200 hover:border-slate-700"
                    data-color-from="green-600"
                    data-color-to="lime-400"
                    onClick={(e) => sidebarColor(e.currentTarget)}
                  />
                  <span
                    className="py-2.2 text-xs px-2.2 rounded-circle h-5.6 mr-1.25 w-5.6 ease-soft-in-out bg-gradient-to-tl from-red-500 to-yellow-400 relative inline-block cursor-pointer whitespace-nowrap border border-solid border-white text-center align-baseline font-bold uppercase leading-none text-white transition-all duration-200 hover:border-slate-700"
                    data-color-from="red-500"
                    data-color-to="yellow-400"
                    onClick={(e) => sidebarColor(e.currentTarget)}
                  />
                  <span
                    className="py-2.2 text-xs px-2.2 rounded-circle h-5.6 mr-1.25 w-5.6 ease-soft-in-out bg-gradient-to-tl from-red-600 to-rose-400 relative inline-block cursor-pointer whitespace-nowrap border border-solid border-white text-center align-baseline font-bold uppercase leading-none text-white transition-all duration-200 hover:border-slate-700"
                    data-color-from="red-600"
                    data-color-to="rose-400"
                    onClick={(e) => sidebarColor(e.currentTarget)}
                  />
                </div>
              </a>
              {/* Sidenav Type */}
              <div className="mt-4">
                <h6 className="mb-0 dark:text-white">Sidenav Type</h6>
                <p className="text-sm leading-normal dark:opacity-60">
                  Choose between 2 different sidenav types.
                </p>
              </div>
              <div className="flex">
                <button
                  transparent-style-btn=""
                  className="inline-block w-full px-4 py-3 mb-2 text-xs font-bold text-center text-white uppercase align-middle transition-all border border-transparent border-solid rounded-lg cursor-pointer xl-max:cursor-not-allowed xl-max:opacity-65 xl-max:pointer-events-none xl-max:bg-gradient-to-tl xl-max:from-purple-700 xl-max:to-pink-500 xl-max:text-white xl-max:border-0 hover:scale-102 hover:shadow-soft-xs active:opacity-85 leading-pro ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 bg-gradient-to-tl from-purple-700 to-pink-500 bg-fuchsia-500 hover:border-fuchsia-500 dark:pointer-events-none dark:cursor-not-allowed"
                  data-class="bg-transparent"
                  active-style=""
                >
                  Transparent
                </button>
                <button
                  white-style-btn=""
                  className="inline-block w-full px-4 py-3 mb-2 ml-2 text-xs font-bold text-center uppercase align-middle transition-all bg-transparent border border-solid rounded-lg cursor-pointer xl-max:cursor-not-allowed xl-max:opacity-65 xl-max:pointer-events-none xl-max:bg-gradient-to-tl xl-max:from-purple-700 xl-max:to-pink-500 xl-max:text-white xl-max:border-0 hover:scale-102 hover:shadow-soft-xs active:opacity-85 leading-pro ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 border-fuchsia-500 bg-none text-fuchsia-500 hover:border-fuchsia-500 dark:pointer-events-none dark:cursor-not-allowed"
                  data-class="bg-white"
                >
                  White
                </button>
              </div>
              <p className="block mt-2 text-sm leading-normal xl:hidden">
                You can change the sidenav type just on desktop view.
              </p>
              {/* Navbar Fixed */}
              <div className="mt-4">
                <h6 className="mb-0 dark:text-white">Navbar Fixed</h6>
              </div>
              <div className="min-h-6 mb-0.5 block pl-0">
                <input
                  navbar-fixed-toggle=""
                  className="rounded-10 duration-250 ease-soft-in-out after:rounded-circle after:shadow-soft-2xl after:duration-250 checked:after:translate-x-5.3 h-5 relative float-left mt-1 ml-auto w-10 cursor-pointer appearance-none border border-solid border-gray-200 bg-slate-800/10 bg-none bg-contain bg-left bg-no-repeat align-top transition-all after:absolute after:top-px after:h-4 after:w-4 after:translate-x-px after:bg-white after:content-[''] checked:border-slate-800/95 checked:bg-slate-800/95 checked:bg-none checked:bg-right"
                  type="checkbox"
                />
              </div>
              <hr className="h-px mt-4 mb-1 bg-transparent bg-gradient-to-r from-transparent via-black/40 to-transparent dark:bg-gradient-to-r dark:from-transparent dark:via-white dark:to-transparent" />
              <div className="mt-2">
                <h6 className="mb-0 dark:text-white">Sidenav Mini</h6>
              </div>
              <div className="min-h-6 mb-0.5 block pl-0">
                <input
                  sidenav-mini-toggle=""
                  className="rounded-10 duration-250 ease-soft-in-out after:rounded-circle after:shadow-soft-2xl after:duration-250 checked:after:translate-x-5.3 h-5 relative float-left mt-1 ml-auto w-10 cursor-pointer appearance-none border border-solid border-gray-200 bg-slate-800/10 bg-none bg-contain bg-left bg-no-repeat align-top transition-all after:absolute after:top-px after:h-4 after:w-4 after:translate-x-px after:bg-white after:content-[''] checked:border-slate-800/95 checked:bg-slate-800/95 checked:bg-none checked:bg-right"
                  type="checkbox"
                />
              </div>
              <hr className="h-px mt-4 mb-1 bg-transparent bg-gradient-to-r from-transparent via-black/40 to-transparent dark:bg-gradient-to-r dark:from-transparent dark:via-white dark:to-transparent" />
              <div className="mt-2">
                <h6 className="mb-0 dark:text-white">Light/Dark</h6>
              </div>
              <div className="min-h-6 mb-0.5 block pl-0">
                <input
                  dark-toggle=""
                  className="rounded-10 duration-250 ease-soft-in-out after:rounded-circle after:shadow-soft-2xl after:duration-250 checked:after:translate-x-5.3 h-5 relative float-left mt-1 ml-auto w-10 cursor-pointer appearance-none border border-solid border-gray-200 bg-slate-800/10 bg-none bg-contain bg-left bg-no-repeat align-top transition-all after:absolute after:top-px after:h-4 after:w-4 after:translate-x-px after:bg-white after:content-[''] checked:border-slate-800/95 checked:bg-slate-800/95 checked:bg-none checked:bg-right"
                  type="checkbox"
                />
              </div>
              <hr className="h-px my-6 bg-transparent bg-gradient-to-r from-transparent via-black/40 to-transparent dark:bg-gradient-to-r dark:from-transparent dark:via-white dark:to-transparent" />
              <div className="w-full text-center">
                <h6 className="mt-4">Thank you for sharing!</h6>
                <a
                  href="https://twitter.com/intent/tweet?text=Check%20Soft%20UI%20Dashboard%20Pro%20Tailwind%20made%20by%20%40CreativeTim%20%23webdesign%20%23dashboard%20%23tailwindCSS&url=https%3A%2F%2Fwww.creative-tim.com%2Fproduct%2Fsoft-ui-dashboard-pro-tailwind"
                  className="inline-block px-6 py-3 mb-0 mr-2 text-xs font-bold text-center text-white uppercase align-middle transition-all border-0 rounded-lg cursor-pointer hover:shadow-soft-xs hover:scale-102 active:opacity-85 leading-pro ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 me-2 border-slate-700 bg-slate-700"
                  target="_blank"
                >
                  {" "}
                  <i
                    className="mr-1 fab fa-twitter"
                    aria-hidden="true"
                  /> Tweet{" "}
                </a>
                <a
                  href="https://www.facebook.com/sharer/sharer.php?u=https://www.creative-tim.com/product/soft-ui-dashboard-pro-tailwind"
                  className="inline-block px-6 py-3 mb-0 mr-2 text-xs font-bold text-center text-white uppercase align-middle transition-all border-0 rounded-lg cursor-pointer hover:shadow-soft-xs hover:scale-102 active:opacity-85 leading-pro ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 me-2 border-slate-700 bg-slate-700"
                  target="_blank"
                >
                  {" "}
                  <i
                    className="mr-1 fab fa-facebook-square"
                    aria-hidden="true"
                  />{" "}
                  Share{" "}
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
