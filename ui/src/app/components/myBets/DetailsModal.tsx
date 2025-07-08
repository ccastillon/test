export default function DetailsModal() {
  return (
    <div
      className="fixed top-0 left-0 hidden w-full h-full overflow-x-hidden overflow-y-auto transition-opacity ease-linear opacity-0 z-sticky outline-0"
      id="user-bet-details"
      aria-hidden="true"
    >
      <div className="relative w-auto transition-transform duration-300 pointer-events-none sm:m-7 sm:max-w-100 sm:mx-auto lg:mt-48 ease-soft-out -translate-y-13">
        <div className="relative flex flex-col w-full bg-white border border-solid pointer-events-auto dark:bg-gray-950 bg-clip-padding border-black/20 rounded-xl outline-0">
          <div className="flex items-center justify-between p-4">
            <h4 className="font-bold mb-0 leading-normal dark:text-white" id="ModalLabel">
              Bet Details
            </h4>
            <button
              type="button"
              // data-toggle="modal"
              data-target="#user-bet-details"
              className="view-details-btn fa fa-close w-4 h-4 ml-auto box-content p-2 text-black dark:text-white border-0 rounded-1.5 opacity-50 cursor-pointer -m-2 "
              data-dismiss="modal"
            />X
          </div>
          <div className="relative flex-auto p-4">
            <div>
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
            </div>
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
            <div className="flex py-2 mb-1 border-b border-solid border-slate-200"></div>
            <div id="bet-against-container">
                <label className="mb-2 mt-2 ml-1 font-bold text-sm text-slate-700 dark:text-white/80" htmlFor="Name">
                  Bet against
                </label>
                <input
                  disabled
                  type="text"
                  name="acceptedByUser"
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
          </div>
          <div className="flex py-4 border-t border-b border-solid border-slate-200 mx-4">
            <h6>
              Bet result: <strong id="bet-result"></strong>
            </h6>
          </div>
          <div className="flex p-5 m-4 flex-col bg-gray-1 text-sm rounded" id="breakdown-container">
            <p className="block text-sm">
              <strong id="bet-breakdown">Breakdown</strong>
            </p>
            <div className="grid grid-cols-2 pb-3 border-b border-solid border-slate-200">
              <div className="flex flex-col">
                <span>Stake</span>
                <span>Winnings</span>
                <span>Rake</span>
              </div>
              <div className="flex flex-col items-end">
                <span id="breakdown-stake-amt">£ 0</span>
                <span id="breakdown-winnings">0</span>
                <span id="breakdown-rake">0</span>
              </div>
            </div>
            <div className="grid grid-cols-3 justify-items-end pt-3">
              <span className="col-span-2 justify-self-start">Refunded to your account</span>
              <span id="refunded-amount">
                <strong>£ 0</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
