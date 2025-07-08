import config from "@/utils/config";
import { fetchInterceptor } from "@/lib/fetchInterceptor";
import { getUserId } from "@/lib/getUserId";
import { UserTransaction } from "user-module";
import { LoadScript } from "../ScriptLoader";
import { dateFormatter } from "@/lib/formatter";

export async function getUserTransactions() {
  try {
    // await new Promise((resolve) => setTimeout(resolve, 3000)); // for Suspense testing

    const userId = await getUserId();
    const url = `${config.baseApiUrl}/usertransactions/${userId}`;
    const response = await fetchInterceptor(url, {
      cache: "no-store",
      method: "GET",
    });

    const userTransactions: UserTransaction[] = await response.json();

    if (!response.ok) throw userTransactions;

    return userTransactions;
  } catch (error) {
    console.error("Error fetching data");
    return null;
  }
}

export default async function Transactions() {
  const datatable = { datatable: "" };
  const userTransactions = await getUserTransactions();

  return (
    <>
      <div
        className="relative flex flex-col mt-4 w-full h-1/2 min-w-0 break-words bg-white border-0 dark:bg-gray-950 dark:shadow-soft-dark-xl shadow-soft-xl rounded-2xl bg-clip-border"
        id="balance"
      >
        <div className="flex justify-between w-full sm-max:flex-col">
          <div className="px-6 pt-6 mb-0 rounded-t-2xl">
            <h6 className="dark:text-white text-5">Your Transactions</h6>
          </div>
        </div>
        <div className="flex flex-wrap mt-6 w-full">
          <div className="w-full max-w-full px-3 flex-0">
            <div className="relative flex flex-col min-w-0 break-words bg-white border-0 dark:bg-gray-950">
              {userTransactions == null ? (
                <p className="text-center">Failed to fetch your transactions... Try to reload the page.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-flush w-full" {...datatable} id="datatable-search">
                    <thead className="thead-light">
                      <tr>
                        <th>Date & Time</th>
                        <th>Reference No.</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Running Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userTransactions.map((item) => (
                        <tr key={item.id}>
                          <td className="font-semibold leading-normal text-sm">{dateFormatter(item.transactionDateTime)}</td>
                          <td className="font-semibold leading-normal text-sm">{item.id}</td>
                          <td className="font-semibold leading-normal text-sm">{item.type}</td>

                          {item.type == "DEPOSIT" || item.type == "WINNINGS" ? (
                            <td className="font-semibold leading-normal text-sm text-green-600">+£ {item.amount}</td>
                          ) : (
                            <td className="font-semibold leading-normal text-sm text-red-600">-£ {item.amount}</td>
                          )}

                          <td className="font-semibold leading-normal text-sm">{item.runningBalance}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="w-full p-6 mx-auto"></div>
      </div>
      <LoadScript
        scripts={[
          "/assets/js/plugins/datatables.min.js",
          // "/assets/js/soft-ui-dashboard-pro-tailwind.js?v=1.0.1",
        ]}
      />
    </>
  );
}
