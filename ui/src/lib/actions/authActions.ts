"use server";

import config from "@/utils/config";
import { User } from "user-module";
import { fetchInterceptor } from "../fetchInterceptor";
import { getUserId } from "../getUserId";

export async function registerUser(user: Omit<User, "id" | "token" | "expiration">) {
  const response = await fetch(`${config.baseApiUrl}/Auth/Register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  const result = await response.json();

  return result;
}

export async function changePassword(currentPassword: string, newPassword: string) {
  const userId = await getUserId();
  const data = {
    id: userId,
    currentPassword: currentPassword,
    newPassword: newPassword,
  };
  const response = await fetchInterceptor(`${config.baseApiUrl}/Auth/ChangePassword`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  return result;
}
