import { getMatches, getProposedBets, getUserBalanceData } from "@/lib/actions/api";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import FootballLeagues from "../components/upcomingEvents/FootballLeagues";
import TopTeams from "../components/upcomingEvents/TopTeams";
import Link from "next/link";
import UpcomingMatchesClient from "../components/upcomingMatches/UpcomingMatchesClient";
import { LoadScript } from "../components/ScriptLoader";
import { getQueryClient } from "../get-query-client";
import ProposedBetsClient from "../components/proposedBets/ProposedBetsClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FTBookie - Upcoming Matches",
};

export default function UpcomingMatchesPage() {
  const queryClient = getQueryClient();

  queryClient.prefetchQuery({
    queryKey: ["matches"],
    queryFn: getMatches,
  });

  queryClient.prefetchQuery({
    queryKey: ["proposedBets"],
    queryFn: getProposedBets,
  });

  queryClient.prefetchQuery({
    queryKey: ["userBalance"],
    queryFn: getUserBalanceData,
  });

  return (
    <>
      <div className="relative w-full mx-auto mt-6 mb-6">
        <div className="flex flex-between space-x-5">
          {/* Sidebar */}
          <div className="flex flex-col w-1/4 h-full">
            <div className="flex flex-col w-full h-full">
              {/* <Suspense fallback={<div>Loading football leagues...</div>}> */}
              <FootballLeagues />
              {/* </Suspense> */}
            </div>
            <div className="flex flex-col w-full h-full">
              {/* <Suspense fallback={<div>Loading top teams...</div>}> */}
              <TopTeams />
              {/* </Suspense> */}
            </div>
          </div>

          {/* Main content */}
          <div className="flex flex-col w-3/4 h-full">
            <div className="flex w-full h-full mt-4">
              <h4 className="dark:text-white text-6 font-bold"> Upcoming Matches</h4>
              <Link
                href="/"
                className="block px-5 pt-3 pb-0 text-xs font-normal text-transform: uppercase transition-colors ease-soft-in-out text-slate-500"
              >
                see all matches
              </Link>
            </div>

            {/* Upcoming Matches */}
            <div className="flex flex-col w-full h-full">
              <div className="relative flex flex-col mt-4 w-full h-1/2 min-w-0 break-words bg-white border-0 dark:bg-gray-950 dark:shadow-soft-dark-xl shadow-soft-xl rounded-2xl bg-clip-border">
                <div className="flex flex-wrap mt-6 w-full">
                  <div className="w-full max-w-full px-3 flex-0">
                    <div className="relative flex flex-col min-w-0 break-words bg-white border-0 dark:bg-gray-950">
                      <div className="table-responsive">
                        <HydrationBoundary state={dehydrate(queryClient)}>
                          <UpcomingMatchesClient />
                        </HydrationBoundary>
                      </div>
                    </div>
                    <button className="inline-block w-full px-6 py-3 mt-3 mb-3 font-bold text-center text-white uppercase align-middle transition-all border-0 rounded-lg cursor-pointer hover:scale-102 active:opacity-85 hover:shadow-soft-xs bg-green-CUSTOM-600 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25">
                      see all matches &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <i className="fas fa-caret-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex w-full h-full mt-4">
              <h4 className="dark:text-white text-6 font-bold"> Proposed Bets </h4>
              <Link
                href="/"
                className="block px-5 pt-3 pb-0 text-xs font-normal text-transform: uppercase transition-colors ease-soft-in-out text-slate-500"
              >
                go to bets feed
              </Link>
            </div>

            <div className="flex flex-col w-full h-full">
              <div className="relative flex flex-col mt-4 w-full h-1/2 min-w-0 break-words bg-white border-0 dark:bg-gray-950 dark:shadow-soft-dark-xl shadow-soft-xl rounded-2xl bg-clip-border">
                <div className="flex flex-wrap mt-6 w-full">
                  <div className="w-full max-w-full px-3 flex-0">
                    <div className="relative flex flex-col min-w-0 break-words bg-white border-0 dark:bg-gray-950">
                      <div className="table-responsive">
                        <HydrationBoundary state={dehydrate(queryClient)}>
                          <ProposedBetsClient />
                        </HydrationBoundary>
                      </div>
                    </div>
                    <button className="inline-block w-full px-6 py-3 mt-3 mb-3 font-bold text-center text-white uppercase align-middle transition-all border-0 rounded-lg cursor-pointer hover:scale-102 active:opacity-85 hover:shadow-soft-xs bg-green-CUSTOM-600 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25">
                      go to bets feeds &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <i className="fas fa-caret-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <LoadScript scripts={["/assets/js/plugins/datatables.min.js"]} /> */}
      <LoadScript scripts={[]} />
    </>
  );
}
