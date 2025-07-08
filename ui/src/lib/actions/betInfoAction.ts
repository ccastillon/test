"use server";

import config from "@/utils/config";
import { fetchInterceptor } from "../fetchInterceptor";
import { CreateBet, UserBet } from "bet-module";

export async function saveCreateBet(model: Omit<CreateBet, "id" | "status" | "proposedByUserId">) {
  const response = await fetchInterceptor(`${config.baseApiUrl}/UserBets/create-bet`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(model),
  });

  if (!response.ok) throw new Error("Network response was not ok");

  const data: UserBet = await response.json();
  
  return data;

  // if (response.statusText == "OK") {
  //   return "Succeeded";
  // } else {
  //   return JSON.stringify(response.status);
  // }
}
