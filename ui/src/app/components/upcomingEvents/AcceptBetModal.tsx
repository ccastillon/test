"use client";

import { UpdateBet } from "@/lib/actions/upcomingEventsActions";

export default function AcceptBetModal() {
  const handleSubmit = async (event: any) => {
    event?.preventDefault();

    try {
      let dataItem = event.target.getAttribute("data-item");
      const response = await UpdateBet(JSON.parse(dataItem));

      if (response != "Succeeded") throw response;
      else {
        sessionStorage.setItem("successAlert", "true");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };
  return (
    <>
      <div
        className="accept-bet-modal fixed top-0 left-0 hidden w-full h-full overflow-x-hidden overflow-y-auto transition-opacity ease-linear opacity-0 z-sticky outline-0"
        id="proposed-bet-details"
        aria-hidden="true"
      >
        <div className="relative w-auto transition-transform duration-300 pointer-events-none sm:m-7 sm:max-w-100 sm:mx-auto lg:mt-48 ease-soft-out -translate-y-13">
          <div className="relative flex flex-col w-full bg-white border border-solid pointer-events-auto dark:bg-gray-950 bg-clip-padding border-black/20 rounded-xl outline-0">
            <div className="flex items-center justify-between p-4">
              <h5 className="mb-0 leading-normal font-bold dark:text-white" id="ModalLabel">
                Accept proposed bet?
              </h5>
              <button
                type="button"
                // data-toggle="modal"
                data-target="#proposed-bet-details"
                className="accept-btn fa fa-close w-4 h-4 ml-auto box-content p-2 text-black dark:text-white border-0 rounded-1.5 opacity-50 cursor-pointer -m-2 "
                data-dismiss="modal"
              />
            </div>
            <div className="relative flex-auto p-4">
              {/* <div className="flex gap-x-4"> */}
              <div>
                <label className="mb-2 ml-1 font-bold text-sm text-slate-700 dark:text-white/80" htmlFor="Name">
                  League
                </label>
                <input
                  disabled
                  type="text"
                  name="league"
                  className="focus:shadow-soft-primary-outline dark:bg-gray-950 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-green-300 focus:outline-none"
                  value="SPL"
                />
              </div>
              <div>
                <label className="mb-2 mt-2 ml-1 font-bold text-sm text-slate-700 dark:text-white/80" htmlFor="Name">
                  Game Date & Time
                </label>
                <input
                  disabled
                  type="text"
                  name="dateTime"
                  className="focus:shadow-soft-primary-outline dark:bg-gray-950 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-green-300 focus:outline-none"
                  value="14 Dec 2024 6:30pm"
                />
              </div>
              {/* </div> */}
              <div>
                <label className="mb-2 mt-2 ml-1 font-bold text-sm text-slate-700 dark:text-white/80" htmlFor="Name">
                  Game
                </label>
                <input
                  disabled
                  type="text"
                  name="game"
                  className="focus:shadow-soft-primary-outline dark:bg-gray-950 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-green-300 focus:outline-none"
                  value="Team 1 vs Team 2"
                />
              </div>
              <div>
                <label className="mb-2 mt-2 ml-1 font-bold text-sm text-slate-700 dark:text-white/80" htmlFor="Name">
                  Proposed by
                </label>
                <input
                  disabled
                  type="text"
                  name="proposedby"
                  className="focus:shadow-soft-primary-outline dark:bg-gray-950 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-green-300 focus:outline-none"
                  value=""
                />
              </div>
              <div>
                <label className="mb-2 mt-2 ml-1 font-bold text-sm text-slate-700 dark:text-white/80" htmlFor="Name">
                  Backer's Pick
                </label>
                <input
                  disabled
                  type="text"
                  name="backerTeamPick"
                  className="focus:shadow-soft-primary-outline dark:bg-gray-950 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-green-300 focus:outline-none"
                  value=""
                />
              </div>
              <div className="flex gap-x-4 justify-between">
                <div>
                  <label className="mb-2 ml-1 font-bold text-sm text-slate-700 dark:text-white/80" htmlFor="Name">
                    Stake
                  </label>
                  <span className="disabled flex focus:shadow-soft-primary-outline dark:bg-gray-950 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease-soft w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-green-300 focus:outline-none">
                    £
                    <input disabled type="text" name="stake" className="bg-transparent pl-4 max-w-20" value="20" />
                  </span>
                </div>
                <div>
                  <label className="mb-2 ml-1 font-bold text-sm text-slate-700 dark:text-white/80" htmlFor="Name">
                    Odds
                  </label>
                  <span className="flex gap-x-2">
                    <input
                      disabled
                      type="text"
                      name="odds1"
                      className="max-w-10 focus:shadow-soft-primary-outline dark:bg-gray-950 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-green-300 focus:outline-none"
                      value=""
                    />{" "}
                    :
                    <input
                      disabled
                      type="text"
                      name="odds2"
                      className="max-w-10 focus:shadow-soft-primary-outline dark:bg-gray-950 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-green-300 focus:outline-none"
                      value=""
                    />
                  </span>
                </div>
              </div>
              <div className="flex py-2 mb-1 border-b border-solid border-slate-200"></div>

              <div>
                <span>Your liability:</span>
                <span id="layerLiability" className="text-red-500"></span>
              </div>
              <div className="flex border-solid mx-2 mt-1">
                <p className="text-xs italic">Your current balance will cover this liability.</p>
              </div>

              <div>
                <span>Est payout:</span>
                <span id="estPayout" className="text-green-500"></span>
              </div>

              <div className="flex py-2 mb-1 border-b border-solid border-slate-200"></div>
              <div className="flex m-1 flex-col text-sm rounded" id="breakdown-container">
                <div className="grid pb-3 text-slate-DEFAULT-950">
                  <p className="block text-sm">By clicking Accept Bet, you agree to terms.</p>
                  <p className="text-sm">
                    Furthermore, the stake amount will be deducted from your available balance. Should the bet not be
                    accepted by another user, it will be returned automatically to your balance.
                  </p>
                </div>
                <div className="flex place-content-end mb-0 rounded-t-2xl">
                  <button
                    type="button"
                    // data-toggle="modal"
                    id="close-modal-accept"
                    data-target="#proposed-bet-details"
                    className="accept-btn inline-block px-8 py-3 mt-6 mb-0 font-bold text-center uppercase align-middle transition-all bg-transparent rounded-lg cursor-pointer leading-pro text-xs ease-soft-in tracking-tight-soft bg-150 bg-x-25 hover:scale-102 active:opacity-85 text-slate-700"
                    data-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button
                    id="accept-bet-button"
                    onClick={handleSubmit}
                    // disabled={isSubmitting}
                    data-item=""
                    className="inline-block px-6 py-3 mt-6 mb-0 font-bold text-center text-white uppercase align-middle transition-all border-0 rounded-lg cursor-pointer hover:scale-102 active:opacity-85 hover:shadow-soft-xs bg-green-CUSTOM-600 leading-pro text-xs ease-soft-in-out tracking-tight-soft shadow-soft-md bg-x-25"
                  >
                    Accept Bet
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-between mx-3 w-full sm-max:flex-col">
              <div className="flex-none max-w-full pr-4 mr-4 text-right lg:max-w-1/4"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
