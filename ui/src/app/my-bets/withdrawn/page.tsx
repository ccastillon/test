import Datatable from "@/app/components/myBets/data-table";
import config from "@/utils/config";
import { fetchInterceptor } from "@/lib/fetchInterceptor";
import { UserBet } from "bet-module";
import { columns } from "./columns";

async function getWithdrawnBets() {
  try {
    // await new Promise((resolve) => setTimeout(resolve, 3000)); // for Suspense testing

    const url = `${config.baseApiUrl}/userbets/all-results/withdrawn`;
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

export default async function WithdrawnPage() {
  const bets = await getWithdrawnBets();
  return (
    <div className="flex flex-wrap mt-6 w-full">
      <div className="w-full max-w-full px-3 flex-0">
        <div className="relative flex flex-col min-w-0 break-words bg-white border-0 dark:bg-gray-950">
          {bets == null ? (
            <p className="text-center">Failed to fetch your bets... Try to reload the page.</p>
          ) : (
            <div className="table-responsive">
              <Datatable columns={columns} data={bets} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
