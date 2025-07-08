"use server";

import config from "@/utils/config";
import { IdentityResult, User } from "user-module";
import { fetchInterceptor } from "../fetchInterceptor";
import { getUserId } from "../getUserId";
import { revalidatePath } from "next/cache";

export async function getUserData() {
  const userId = await getUserId();
  const url = `${config.baseApiUrl}/users/${userId}`;
  const response = await fetchInterceptor(url, {
    cache: "no-store",
    method: "GET",
  });

  if (!response.ok && response.status !== 200) {
    console.error("Error fetching data");
    return undefined;
  } else {
    const data: User = await response.json();
    return data;
  }
}

export async function saveEditUser(user: Omit<User, "token" | "expiration" | "password">) {
  // TODO: check if user is logged in or user param is equal to logged in user

  const url = `${config.baseApiUrl}/users`;
  const response = await fetchInterceptor(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  const result: IdentityResult = await response.json();

  revalidatePath("/account/info");
  return result;
}
