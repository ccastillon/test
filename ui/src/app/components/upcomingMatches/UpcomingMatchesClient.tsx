"use client";

import { getMatches, getUserBalanceData } from "@/lib/actions/api";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import TableInstance from "./TableInstance";
import CreateBetModal from "../upcomingEvents/CreateBetModal";
import ErrorSuccessAlert from "../ErrorSuccessAlert";
import ErrorModal from "../upcomingEvents/ErrorModal";

export default function UpcomingMatchesClient() {
  // const { data, error, isLoading } = useQuery({
  //   queryKey: ["matches"],
  //   queryFn: () => getMatches(),
  //   refetchInterval: 60 * 1000, // 5 minutes
  //   refetchIntervalInBackground: true,
  // });

  const { data: userBalance } = useSuspenseQuery({
    queryKey: ["userBalance"],
    queryFn: () => getUserBalanceData(),
  });

  if (typeof window !== 'undefined' && userBalance !== null) {
    sessionStorage.setItem('userBalance', userBalance.balance.toString());
  }

  const { data } = useSuspenseQuery({
    queryKey: ["matches"],
    queryFn: () => getMatches(),
    refetchInterval: 1800 * 1000, // 30 minutes
    refetchIntervalInBackground: true,
  });

  const tableData = useMemo(() => data ?? [], [data]);

  const [displaySuccess, setDisplaySuccess] = useState(false);

  let showAlert = null;
  if (typeof window !== "undefined") {
    // get the saved data from sessionStorage
    showAlert = sessionStorage.getItem("alert");
  }
  if (showAlert != null) {
    setDisplaySuccess(true);
    // clean the sessionStorage
    sessionStorage.removeItem("alert");
    setTimeout(() => {
      setDisplaySuccess(false);
    }, 5000);
  }

  // if (isLoading) return <div>Loading...</div>;
  // if (error) return <div>Error loading matches: {error.message}</div>;

  return (
    <>
      {displaySuccess && (
        <ErrorSuccessAlert
          isSuccess={true}
          message={
            <>
              Success! Bet successfully created and is now waiting to be accepted. View your bets in{" "}
              <a href="/my-bets/active-bets" style={{ color: "inherit", textDecoration: "underline" }}>
                My Bets
              </a>{" "}
              page.
            </>
          }
        />
      )}

      <TableInstance data={tableData} />

      <CreateBetModal displaySuccess={displaySuccess} setDisplaySuccess={setDisplaySuccess} />

      <ErrorModal />
    </>
  );

  // return (
  //   <div>
  //     {data == undefined ? (
  //       <p className="text-center">Failed to fetch your transactions... Try to reload the page.</p>
  //     ) : (
  //       <div>
  //         {data.map((match) => (
  //           <div key={match.id}>
  //             <p>
  //               <strong>{match.leagueName}</strong>
  //             </p>
  //             <p>
  //               <strong>
  //                 {match.team1Name} vs {match.team2Name}
  //               </strong>
  //             </p>
  //             <p>{new Date(match.startDateTime).toLocaleString()}</p>
  //           </div>
  //         ))}
  //       </div>
  //     )}
  //   </div>
  // );
}
