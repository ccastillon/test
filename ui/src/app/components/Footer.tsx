import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bottom-0 fixed w-full z-100 bg-gray-50">
      <div className="container my-5">
        <div className="flex flex-wrap items-center -mx-3 lg:justify-between">
          <div className="w-full max-w-full px-3 mt-0 mb-6 shrink-0 lg:mb-0 lg:w-1/2 lg:flex-none">
            <div className="text-sm leading-normal text-center copyright text-slate-500 lg:text-left">
              Copyright © 2024 Forget the Bookie
            </div>
          </div>
          <div className="w-full max-w-full px-3 mt-0 shrink-0 lg:w-1/2 lg:flex-none">
            <ul className="flex flex-wrap justify-center pl-0 mb-0 list-none lg:justify-end">
              <li className="nav-item">
                <Link
                  href="/"
                  className="block px-4 pt-0 pb-1 text-sm font-normal transition-colors ease-soft-in-out text-slate-500"
                >
                  Site
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href="/rules"
                  className="block px-4 pt-0 pb-1 text-sm font-normal transition-colors ease-soft-in-out text-slate-500"
                >
                  Rules
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

// export default function Footer() {
//   return (
//     <footer className="w-full bottom-0 py-15 border-t border-grey">
//       <div className="container my-5">
//         <div className="flex flex-wrap -mx-3">
//           <div className="w-8/12 max-w-full px-3 mx-auto mt-1 text-center flex-0">
//             <p className="mb-0 text-slate-400">
//               Copyright © 2024 Forget the Bookie
//             </p>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }
