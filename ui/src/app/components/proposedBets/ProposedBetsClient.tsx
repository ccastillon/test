"use client";

import { getProposedBets } from "@/lib/actions/api";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import ErrorSuccessAlert from "../ErrorSuccessAlert";
import TableInstance from "./TableInstance";
import AcceptBetModal from "../upcomingEvents/AcceptBetModal";
import ErrorModal from "../upcomingEvents/ErrorModal";

export default function ProposedBetsClient() {
  // const { data, error, isLoading } = useQuery({
  //   queryKey: ["proposedBets"],
  //   queryFn: () => getProposedBets(),
  //   refetchInterval: 60 * 1000, // 5 minutes
  //   refetchIntervalInBackground: true,
  // });

  const { data } = useSuspenseQuery({
    queryKey: ["proposedBets"],
    queryFn: () => getProposedBets(),
    refetchInterval: 300 * 1000, // 5 minutes
    refetchIntervalInBackground: true,
  });

  const tableData = useMemo(() => data ?? [], [data]);

  const [displaySuccess, setDisplaySuccess] = useState(false);

  let showAlert = null;
  if (typeof window !== "undefined") {
    // get the saved data from sessionStorage
    showAlert = sessionStorage.getItem("successAlert");
  }
  if (showAlert != null) {
    setDisplaySuccess(true);
    // clean the sessionStorage
    sessionStorage.removeItem("successAlert");
    setTimeout(() => {
      setDisplaySuccess(false);
    }, 5000);
  }

  // if (isLoading) return <div>Loading...</div>;
  // if (error) return <div>Error loading matches: {error.message}</div>;

  return (
    <>
      {displaySuccess && <ErrorSuccessAlert isSuccess={true} message="Bet successfully accepted. You can view all your bets in My Bets page." />}
      <div>
        <TableInstance data={tableData} />
      </div>

      <AcceptBetModal />

      <ErrorModal />
    </>
  );
}
