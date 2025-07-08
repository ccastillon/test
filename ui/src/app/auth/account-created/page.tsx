import Link from "next/link";
import React from "react";

export default function AccountCreatedPage() {
  return (
    <div className="flex justify-center items-center flex-col -mx-3">
      <div className="flex items-center mt-12 flex-col w-full max-w-full px-3 mx-auto lg:mx-0 shrink-0 md:flex-0 md:w-7/12 lg:w-5/12 xl:w-4/12">
        <img className="h-auto w-3/4" src="/assets/img/Account-Succesfully-Created.png" alt="image description"></img>
        <div className="p-6 pb-0 mb-0">
          <h2 className="font-bold text-center">Hooray, account succesfully created!</h2>
          <p className="mb-7 pb-10 text-center">Please log in to start using FTBookie</p>
        </div>
      </div>
      <div className="text-center">
        <Link
          href="/auth/signin"
          className="inline-block w-full px-6 py-3 mt-6 mb-0 font-bold text-center text-white uppercase align-middle transition-all border-0 rounded-lg cursor-pointer hover:scale-102 active:opacity-85 hover:shadow-soft-xs bg-green-CUSTOM-600 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25"
        >
          GO TO LOG IN <i className="fa fa-arrow-right"></i>
        </Link>
      </div>
    </div>
  );
}
