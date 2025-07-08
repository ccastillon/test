"use server";

import config from "@/utils/config";
import { fetchInterceptor } from "@/lib/fetchInterceptor";
import { Event } from "event-module";
import { ProposedBet } from "bet-module";
import { getUserId } from "../getUserId";
import { UserBalance } from "user-module";

export async function getMatches() {
  const url = `${config.baseApiUrl}/Events/Upcoming-matches`;
  const response = await fetchInterceptor(url, {
    cache: "no-store",
    method: "GET",
  });

  if (!response.ok) throw new Error("Network response was not ok");

  const events: Event[] = await response.json();

  return events;
}

export async function getProposedBets() {
  const url = `${config.baseApiUrl}/UserBets/Proposed`;
  const response = await fetchInterceptor(url, {
    cache: "no-store",
    method: "GET",
  });

  if (!response.ok) throw new Error("Network response was not ok");

  const proposedBets: ProposedBet[] = await response.json();

  return proposedBets;
}

export async function getUserBalanceData() {
    const userId = await getUserId();
    const url = `${config.baseApiUrl}/Users/${userId}/Balance`;
    const response = await fetchInterceptor(url, {
      cache: "no-store",
      method: "GET",
    });
    const userBalance: UserBalance = await response.json();

    if (!response.ok) throw new Error("Network response was not ok");

    return userBalance;
}