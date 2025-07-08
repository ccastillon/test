"use client";

import { signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UseAuth({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  // const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (session?.user.error === "RefreshAccessTokenError") {
      signOut({ callbackUrl: "/auth/signin", redirect: true });
    }
    if (session === null) {
      if (
        ![
          "/",
          "/auth/signin",
          "/auth/signup",
          "/auth/account-created",
        ].includes(pathname)
      ) {
        router.replace("/auth/signin");
      }

      // if (pathname !== "/auth/signin") {
      //   router.replace("/auth/signin");
      // }
      // setIsAuthenticated(false);
    } else if (session !== undefined) {
      if (
        ["/", "/auth/signin", "/auth/signup", "/auth/account-created"].includes(
          pathname
        )
      ) {
        router.replace("/upcoming-events");
      }
      // setIsAuthenticated(true);
    }
  }, [session]);

  // return <>{isAuthenticated ? { children } : null}</>;
  return <>{children}</>;
}
