import Link from "next/link";

export default async function TopTeams() {
  return (
    <>
      <div
        className="relative flex flex-col mt-4 w-full h-1/2 min-w-0 break-words"
      >
        <div className="flex justify-between w-full flex-col sm-max:flex-col">
          <div className="inline px-5 pt-0 mb-0 rounded-t-2xl">
            <span className="dark:text-white text-5 font-semibold text-slate-700">Top Teams</span>
            <Link
                  href="/"
                  className="px-6 pt-1 pb-1 text-xs font-normal text-transform: uppercase transition-colors ease-soft-in-out text-slate-500"
                >
                  see all
            </Link>
          </div>
          <ul>
            <li>
              <Link
                    href="/"
                    className="block px-6 pt-1 pb-1 text-sm font-normal transition-colors ease-soft-in-out text-slate-500"
                  >
                    Manchester City
              </Link>
            </li>
            <li>
              <Link
                    href="/"
                    className="block px-6 pt-1 pb-1 text-sm font-normal transition-colors ease-soft-in-out text-slate-500"
                  >
                    Arsenal F.C.
              </Link>
            </li>
            <li>
              <Link
                    href="/"
                    className="block px-6 pt-1 pb-1 text-sm font-normal transition-colors ease-soft-in-out text-slate-500"
                  >
                    Juventus F.C.
              </Link>
            </li>
            <li>
              <Link
                    href="/"
                    className="block px-6 pt-1 pb-1 text-sm font-normal transition-colors ease-soft-in-out text-slate-500"
                  >
                    Paris Saint-Germain
              </Link>
            </li>
            <li>
              <Link
                    href="/"
                    className="block px-6 pt-1 pb-1 text-sm font-normal transition-colors ease-soft-in-out text-slate-500"
                  >
                    Real Madrid
              </Link>
            </li>
          </ul>
        </div>
        
        <div className="w-full p-6 mx-auto"></div>
      </div>
    </>
  );
}