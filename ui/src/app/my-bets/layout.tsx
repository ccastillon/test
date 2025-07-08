import { Suspense } from "react";
import MyBetsNavbar from "../components/myBets/MyBetsNavbar";
import Loading from "../loading";

export default function MyBetsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="relative w-full mx-auto mt-6 mb-6">
        <div className="flex w-full flex-col">
          <div className="flex flex-col w-full h-full">
            <h1>My Bets</h1>
            <MyBetsNavbar />
          </div>

          <Suspense fallback={<Loading />}>
            <div className="flex w-full h-full">{children}</div>
          </Suspense>
        </div>
      </div>
    </>
  );
}
