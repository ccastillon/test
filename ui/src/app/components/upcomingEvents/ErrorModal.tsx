"use client";

import { UpdateBet } from "@/lib/actions/upcomingEventsActions";
import Link from "next/link";
import { FaExclamationCircle } from "react-icons/fa";

export default function ErrorModal() {

  return (
    <>
    <div
      className="modal insufficient-bal-modal fixed top-0 left-0 hidden w-full h-full overflow-x-hidden overflow-y-auto transition-opacity ease-linear opacity-0 z-sticky outline-0"
      id="insufficient-bal-modal"
      aria-hidden="true"
    >
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left">
                    <div className="flex place-content-between">
                      <h5 className="font-bold text-red-700">
                        <FaExclamationCircle />
                        &nbsp;
                        Error
                      </h5>
                      <button type="button" id='close-modal-insufficient' className="btn btn-sm btn-circle btn-ghost inline-flex justify-center place-content-end">
                        ✕
                      </button>
                    </div>
                    <div className="mt-2">
                      <p className="text-md">Your current balance is insufficient to accept this bet. Would you like to deposit additional funds?</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 mb-1 sm:flex sm:flex-row-reverse sm:px-6">
                <Link
                  id="add-funds-button"
                  href="/account/balance-transactions"
                  className="inline-block px-8 py-3 font-bold text-center text-white uppercase align-middle transition-all border-0 rounded-lg cursor-pointer hover:scale-102 active:opacity-85 hover:shadow-soft-xs bg-green-CUSTOM-600 leading-pro text-xs ease-soft-in-out tracking-tight-soft shadow-soft-md bg-x-25"
                >
                  Add Funds
                </Link>
                <button
                  id="error-modal-cancel-btn"
                  type="button"
                  className="inline-block px-8 py-3 font-bold text-center uppercase align-middle transition-all bg-transparent rounded-lg cursor-pointer leading-pro text-xs ease-soft-in tracking-tight-soft bg-150 bg-x-25 hover:scale-102 active:opacity-85 text-slate-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
    </div>
    </>
  );
}
