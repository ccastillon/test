// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./auth";

export const fetchInterceptor: typeof fetch = async (url, params) => {
  // pre-processing here
  const session = await getServerSession(authOptions);
  const accessToken = session?.user.accessToken;

  const authorizationHeader = { Authorization: `Bearer ${accessToken}` };

  if (params?.headers === undefined) {
    params = { ...params, ...{ headers: authorizationHeader } };
  } else {
    params.headers = { ...params.headers, ...authorizationHeader };
  }

  const response = await fetch(url, params);

  // post-processing here
  if (params.method === "GET") {
    if ([401, 403].includes(response.status)) {
      redirect("/auth/logout");
    }
  }

  return response;
};
