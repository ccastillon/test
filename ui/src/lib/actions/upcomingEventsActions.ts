"use server";

import config from "@/utils/config";
import { fetchInterceptor } from "../fetchInterceptor";
import { AcceptBetResult, ProposedBet } from "bet-module";

export async function UpdateBet(model: ProposedBet) {
  // TODO: check if user is logged in or user param is equal to logged in user
  console.log("UpdateBet() called");
  const url = `${config.baseApiUrl}/UserBets/AcceptBet`;
  const response = await fetchInterceptor(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(model),
  });
  
  if (response.statusText == "OK") {
    return "Succeeded";
  } else {
    return JSON.stringify(response.status);
  }
}