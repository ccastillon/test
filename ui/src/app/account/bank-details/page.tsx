import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "FTBookie - Bank Details",
};

export default function BankDetailsPage() {
  return (
    <>
      <div className="flex flex-col w-full h-full">
        <div
          className="relative flex flex-col w-full h-1/2 min-w-0 break-words bg-white border-0 dark:bg-gray-950 dark:shadow-soft-dark-xl shadow-soft-xl rounded-2xl bg-clip-border"
          id="balance"
        >
          <div className="flex justify-between mx-3 w-full sm-max:flex-col">
            <div className="p-6 mb-0 rounded-t-2xl">
              <h6 className="dark:text-white text-5">Bank Details</h6>
            </div>
            <div className="flex-none max-w-full pr-4 mr-4 text-right lg:max-w-1/4">
              <a
                className="inline-block w-full px-6 py-3 mt-6 mb-0 font-bold text-center text-white uppercase align-middle transition-all border-0 rounded-lg cursor-pointer hover:scale-102 active:opacity-85 hover:shadow-soft-xs bg-green-CUSTOM-600 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25"
                href="javascript:;"
              >
                &nbsp;&nbsp;Add A New Card
              </a>
            </div>
          </div>

          <div className="flex-auto p-4">
            <div className="flex flex-wrap -mx-3">
              <div className="max-w-full px-3 mb-6 md:mb-0 md:w-1/2 md:flex-none">
                <div className="relative flex flex-row items-center flex-auto min-w-0 p-6 break-words bg-transparent border border-solid shadow-none rounded-xl border-slate-100 bg-clip-border dark:border-slate-700">
                  <img className="mb-0 mr-4 w-1/10" src="../../../assets/img/logos/mastercard.png" alt="logo" />
                  <h6 className="mb-0 dark:text-white">****&nbsp;&nbsp;&nbsp;****&nbsp;&nbsp;&nbsp;****&nbsp;&nbsp;&nbsp;7852</h6>
                  <i className="ml-auto cursor-pointer fas fa-pencil-alt text-slate-700" data-target="tooltip_trigger"></i>
                  <div className="hidden px-2 py-1 text-white bg-black rounded-lg text-sm" id="tooltip" role="tooltip" data-popper-placement="top">
                    Edit Card
                    <div
                      className="invisible absolute h-2 w-2 bg-inherit before:visible before:absolute before:h-2 before:w-2 before:rotate-45 before:bg-inherit before:content-['']"
                      data-popper-arrow
                    ></div>
                  </div>
                </div>
              </div>
              <div className="max-w-full px-3 md:w-1/2 md:flex-none">
                <div className="relative flex flex-row items-center flex-auto min-w-0 p-6 break-words bg-transparent border border-solid shadow-none rounded-xl border-slate-100 bg-clip-border dark:border-slate-700">
                  <img className="mb-0 mr-4 w-1/10" src="../../../assets/img/logos/visa.png" alt="logo" />
                  <h6 className="mb-0 dark:text-white">****&nbsp;&nbsp;&nbsp;****&nbsp;&nbsp;&nbsp;****&nbsp;&nbsp;&nbsp;5248</h6>
                  <i className="ml-auto cursor-pointer fas fa-pencil-alt text-slate-700" data-target="tooltip_trigger"></i>
                  <div className="hidden px-2 py-1 text-white bg-black rounded-lg text-sm" id="tooltip" role="tooltip" data-popper-placement="top">
                    Edit Card
                    <div
                      className="invisible absolute h-2 w-2 bg-inherit before:visible before:absolute before:h-2 before:w-2 before:rotate-45 before:bg-inherit before:content-['']"
                      data-popper-arrow
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="relative flex flex-col mt-4 w-full h-1/2 min-w-0 break-words bg-white border-0 dark:bg-gray-950 dark:shadow-soft-dark-xl shadow-soft-xl rounded-2xl bg-clip-border"
          id="balance"
        >
          <div className="flex justify-between mx-3 w-full sm-max:flex-col">
            <div className="px-6 pt-6 mb-0 rounded-t-2xl">
              <h6 className="dark:text-white text-5">Billing Information</h6>
            </div>
          </div>

          <div className="flex-auto px-4">
            <ul className="flex flex-col pl-0 mb-0 rounded-lg">
              <li className="relative flex p-6 mt-4 mb-2 border-0 rounded-xl bg-gray-50 dark:bg-transparent">
                <div className="flex flex-col">
                  <h6 className="mb-4 leading-normal text-sm dark:text-white">Billing Info 1</h6>
                  <span className="mb-2 leading-tight text-xs">
                    Name: <span className="font-semibold text-slate-700 dark:text-white sm:ml-2">John Doe</span>
                  </span>
                  <span className="mb-2 leading-tight text-xs">
                    Street: <span className="font-semibold text-slate-700 dark:text-white sm:ml-2">99 Golf Road</span>
                  </span>
                  <span className="mb-2 leading-tight text-xs">
                    City: <span className="font-semibold text-slate-700 dark:text-white sm:ml-2">Sangobeg</span>
                  </span>
                  <span className="mb-2 leading-tight text-xs">
                    Country: <span className="font-semibold text-slate-700 dark:text-white sm:ml-2">United Kingdom</span>
                  </span>
                  <span className="mb-2 leading-tight text-xs">
                    Zip/Postal Code: <span className="font-semibold text-slate-700 dark:text-white sm:ml-2">IV27 9XD</span>
                  </span>
                  <span className="leading-tight text-xs">
                    Phone: <span className="font-semibold text-slate-700 dark:text-white sm:ml-2">079 4132 8483</span>
                  </span>
                </div>
                <div className="ml-auto text-right">
                  <a
                    className="relative z-10 inline-block px-4 py-3 mb-0 font-bold text-center text-transparent uppercase align-middle transition-all border-0 rounded-lg shadow-none cursor-pointer leading-pro text-xs ease-soft-in bg-150 bg-gradient-to-tl from-red-600 to-rose-400 hover:scale-102 active:opacity-85 bg-x-25 bg-clip-text"
                    href="javascript:;"
                  >
                    <i className="mr-2 far fa-trash-alt bg-150 bg-gradient-to-tl from-red-600 to-rose-400 bg-x-25 bg-clip-text"></i>Delete
                  </a>
                  <a
                    className="inline-block px-4 py-3 mb-0 font-bold text-center uppercase align-middle transition-all bg-transparent border-0 rounded-lg shadow-none cursor-pointer leading-pro text-xs ease-soft-in bg-150 hover:scale-102 active:opacity-85 bg-x-25 text-slate-700 dark:text-white"
                    href="javascript:;"
                  >
                    <i className="mr-2 fas fa-pencil-alt text-slate-700" aria-hidden="true"></i>Edit
                  </a>
                </div>
              </li>
              <li className="relative flex p-6 mt-2 mb-4 border-0 rounded-b-inherit rounded-xl bg-gray-50 dark:bg-transparent">
                <div className="flex flex-col">
                  <h6 className="mb-4 leading-normal text-sm dark:text-white">Billing Info 2</h6>
                  <span className="mb-2 leading-tight text-xs">
                    Name: <span className="font-semibold text-slate-700 dark:text-white sm:ml-2">John Doe</span>
                  </span>
                  <span className="mb-2 leading-tight text-xs">
                    Street: <span className="font-semibold text-slate-700 dark:text-white sm:ml-2">99 Golf Road</span>
                  </span>
                  <span className="mb-2 leading-tight text-xs">
                    City: <span className="font-semibold text-slate-700 dark:text-white sm:ml-2">Sangobeg</span>
                  </span>
                  <span className="mb-2 leading-tight text-xs">
                    Country: <span className="font-semibold text-slate-700 dark:text-white sm:ml-2">United Kingdom</span>
                  </span>
                  <span className="mb-2 leading-tight text-xs">
                    Zip/Postal Code: <span className="font-semibold text-slate-700 dark:text-white sm:ml-2">IV27 9XD</span>
                  </span>
                  <span className="leading-tight text-xs">
                    Phone: <span className="font-semibold text-slate-700 dark:text-white sm:ml-2">079 4132 8483</span>
                  </span>
                </div>
                <div className="ml-auto text-right">
                  <a
                    className="relative z-10 inline-block px-4 py-3 mb-0 font-bold text-center text-transparent uppercase align-middle transition-all border-0 rounded-lg shadow-none cursor-pointer leading-pro text-xs ease-soft-in bg-150 bg-gradient-to-tl from-red-600 to-rose-400 hover:scale-102 active:opacity-85 bg-x-25 bg-clip-text"
                    href="javascript:;"
                  >
                    <i className="mr-2 far fa-trash-alt bg-150 bg-gradient-to-tl from-red-600 to-rose-400 bg-x-25 bg-clip-text"></i>Delete
                  </a>
                  <a
                    className="inline-block px-4 py-3 mb-0 font-bold text-center uppercase align-middle transition-all bg-transparent border-0 rounded-lg shadow-none cursor-pointer leading-pro text-xs ease-soft-in bg-150 hover:scale-102 active:opacity-85 bg-x-25 text-slate-700 dark:text-white"
                    href="javascript:;"
                  >
                    <i className="mr-2 fas fa-pencil-alt text-slate-700" aria-hidden="true"></i>Edit
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
