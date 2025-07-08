import config from "@/utils/config";
import { fetchInterceptor } from "@/lib/fetchInterceptor";
import { getUserId } from "@/lib/getUserId";
import Link from "next/link";
import { UserBalance } from "user-module";

export async function getUserBalanceData() {
  try {
    const userId = await getUserId();
    const url = `${config.baseApiUrl}/Users/${userId}/Balance`;
    const response = await fetchInterceptor(url, {
      cache: "no-store",
      method: "GET",
    });
    const userBalance: UserBalance = await response.json();

    if (!response.ok) throw userBalance;

    return userBalance;
  } catch (error) {
    console.error("Error fetching data");
    return null;
  }
}

export default async function Balance() {
  const userBalance = await getUserBalanceData();
  return (
    <div className="relative flex flex-col w-full h-1/2 min-w-0 break-words bg-white border-0 dark:bg-gray-950 dark:shadow-soft-dark-xl shadow-soft-xl rounded-2xl bg-clip-border">
      <div className="px-6 pt-6 mb-0 rounded-t-2xl">
        <h5 className="dark:text-white">Balance</h5>
      </div>
      <div className="flex-auto px-6 pt-0 pb-4 w-full">
        <div className="flex-auto pt-0">
          <div className="pt-4 px-4">
            <div className="p-2 w-1/2 my-6 rounded-xl bg-gray-50 dark:bg-gray-600 sm:flex">
              <p className="my-auto font-semibold leading-normal text-xs sm:pl-2">Available Balance</p>
              <h6 className="my-auto ml-auto mr-4 leading-normal text-xs dark:text-white">
                <i className="fa fa-pound-sign fa-xs" aria-hidden="true"></i> {userBalance != null ? userBalance.balance : 0}
              </h6>
              <Link className="my-auto font-semibold mr-2 leading-normal text-xs sm:pl-2" href="#">
                WITHDRAW
              </Link>
              <Link className="my-auto font-semibold mr-2 leading-normal text-xs sm:pl-2 text-green-500" href="#">
                DEPOSIT
              </Link>
            </div>

            <div className="p-2 w-4/12 my-6 rounded-xl bg-gray-50 dark:bg-gray-600 sm:flex">
              <p className="my-auto font-semibold leading-normal text-xs sm:pl-2">Allocated to Bets</p>
              <h6 className="my-auto ml-auto mr-2 leading-normal text-xs dark:text-white">
                <i className="fa fa-pound-sign fa-xs" aria-hidden="true"></i> {userBalance != null ? userBalance.allocatedToBets : 0}
              </h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
