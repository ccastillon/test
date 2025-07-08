// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./auth";

export async function getUserId() {
  const session = await getServerSession(authOptions);
  if (session?.user.error === "RefreshAccessTokenError") {
    redirect("/auth/logout");
    // signIn(); // Force sign in to hopefully resolve error
  }

  const userId = session?.user.id;
  return userId;
}
