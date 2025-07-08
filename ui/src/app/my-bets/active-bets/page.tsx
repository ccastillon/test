import { LoadScript } from "@/app/components/ScriptLoader";
import config from "@/utils/config";
import { fetchInterceptor } from "@/lib/fetchInterceptor";
import { dateFormatter } from "@/lib/formatter";
import { UserBet } from "bet-module";

async function getActiveBets() {
  try {
    // await new Promise((resolve) => setTimeout(resolve, 3000)); // for Suspense testing

    const url = `${config.baseApiUrl}/userbets/active`;
    const response = await fetchInterceptor(url, {
      cache: "no-store",
      method: "GET",
    });

    const events: UserBet[] = await response.json();

    if (!response.ok) throw events;

    return events;
  } catch (error) {
    console.error("Error fetching data");
    return null;
  }
}

export default async function ActiveBetsPage() {
  const datatable = { datatable: "" };
  const activeBets = await getActiveBets();
  return (
    <>
      <div className="flex flex-wrap mt-6 w-full">
        <div className="w-full max-w-full px-3 flex-0">
          <div className="relative flex flex-col min-w-0 break-words bg-white border-0 dark:bg-gray-950">
            {activeBets == null ? (
              <p className="text-center">Failed to fetch your bets... Try to reload the page.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-flush w-full" {...datatable} id="datatable-search">
                  <thead className="thead-light">
                    <tr>
                      {/* <th>Id</th> */}
                      <th>League</th>
                      <th>Date & Time</th>
                      <th>Game</th>
                      <th>Stake</th>
                      <th>Odds</th>
                      <th>Bet Status</th>
                      <th>Game Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeBets.map((item) => (
                      <tr key={item.id}>
                        {/* <td className="font-semibold leading-normal text-sm">
                          {item.id}
                        </td> */}
                        <td className="font-semibold leading-normal text-xs">{item.leagueName}</td>

                        <td className="font-semibold leading-normal text-xs">{dateFormatter(item.eventStartDateTime)}</td>

                        <td className="font-semibold leading-normal text-xs">
                          {item.team1Name} vs {item.team2Name}
                        </td>

                        <td className="font-semibold leading-normal text-xs">£ {item.stake}</td>

                        <td className="font-semibold leading-normal text-xs">{item.odds}</td>

                        <td className="font-semibold leading-normal text-xs">{item.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      <LoadScript scripts={["/assets/js/plugins/datatables.min.js"]} />
    </>
  );
}
