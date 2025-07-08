"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function RefreshTokenHandler(props: any) {
  const { data: session } = useSession();

  useEffect(() => {
    if (!!session) {
      const accessTokenExpiry = Date.parse(
        session.user.accessTokenExpiry.toString()
      );
      // We did set the token to be ready to refresh after 23 hours, here we set interval of 23 hours 30 minutes.
      const timeRemaining = Math.round(
        (accessTokenExpiry - 30 * 60 * 1000 - Date.now()) / 1000
      );
      props.setInterval(timeRemaining > 0 ? timeRemaining : 0);
    }
  }, [session]);

  return null;
}
