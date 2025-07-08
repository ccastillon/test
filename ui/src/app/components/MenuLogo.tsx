"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function MenuLogo() {
  const { data: session } = useSession();
  return (
    <Link href={session && session.user ? "/upcoming-events" : "/"}>
      {/* <img
                  className=" flex justify-center items-center"
                  src="/assets/img/FTB-Logo-155x35px.png"
                  alt="FTB logo"
                ></img> */}
      <Image
        src="/assets/img/nav-logo.webp"
        alt="FTB logo"
        width={155}
        height={35}
      />
    </Link>
  );
}
