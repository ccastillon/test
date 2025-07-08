import Link from "next/link";

export default function AccountSidebar() {
  return (
    <div className="sticky flex flex-col w-10/12 min-w-0 break-words bg-white border-0 top-1/100 dark:bg-gray-950 dark:shadow-soft-dark-xl shadow-soft-xl rounded-2xl bg-clip-border">
      <ul className="flex flex-col flex-wrap p-4 mb-0 list-none rounded-xl">
        <li className="pt-2">
          <Link
            href="/account/balance-transactions"
            className="block px-4 py-2 transition-colors rounded-lg ease-soft-in-out text-slate-500 hover:bg-gray-200"
          >
            <div className="inline-block mr-2 text-black fill-current h-4 w-4 stroke-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 19 19"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.9998 16.2C12.9763 16.2 16.1998 12.9765 16.1998 8.99999C16.1998 5.02354 12.9763 1.79999 8.9998 1.79999C5.02335 1.79999 1.7998 5.02354 1.7998 8.99999C1.7998 12.9765 5.02335 16.2 8.9998 16.2ZM9.8998 3.59999C8.40864 3.59999 7.1998 4.80882 7.1998 6.29999V8.09999H6.2998C5.80275 8.09999 5.3998 8.50294 5.3998 8.99999C5.3998 9.49706 5.80275 9.89999 6.2998 9.89999H7.1998V10.8C7.1998 11.2971 6.79686 11.7 6.2998 11.7C5.80275 11.7 5.3998 12.1029 5.3998 12.6C5.3998 13.0971 5.80275 13.5 6.2998 13.5H11.6998C12.1969 13.5 12.5998 13.0971 12.5998 12.6C12.5998 12.1029 12.1969 11.7 11.6998 11.7H8.84617C8.94567 11.4185 8.9998 11.1155 8.9998 10.8V9.89999H9.8998C10.3969 9.89999 10.7998 9.49706 10.7998 8.99999C10.7998 8.50294 10.3969 8.09999 9.8998 8.09999H8.9998V6.29999C8.9998 5.80294 9.40273 5.39999 9.8998 5.39999C10.3969 5.39999 10.7998 5.80294 10.7998 6.29999C10.7998 6.79704 11.2027 7.19999 11.6998 7.19999C12.1969 7.19999 12.5998 6.79704 12.5998 6.29999C12.5998 4.80882 11.391 3.59999 9.8998 3.59999Z"
                  fill="#2D3748"
                />
              </svg>
            </div>
            <span className="leading-normal text-sm dark:text-white">
              Balance
            </span>
          </Link>
        </li>
        <li className="pt-2">
          <Link
            href="/account/bank-details"
            className="block px-4 py-2 transition-colors rounded-lg ease-soft-in-out text-slate-500 hover:bg-gray-200"
          >
            <div className="inline-block mr-2 text-black fill-current h-4 w-4 stroke-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 19 19"
                fill="none"
              >
                <path
                  d="M3.5998 3.59998C2.60569 3.59998 1.7998 4.40586 1.7998 5.39998V6.29998H16.1998V5.39998C16.1998 4.40586 15.3939 3.59998 14.3998 3.59998H3.5998Z"
                  fill="#2D3748"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M16.1998 8.09998H1.7998V12.6C1.7998 13.5941 2.60569 14.4 3.5998 14.4H14.3998C15.3939 14.4 16.1998 13.5941 16.1998 12.6V8.09998ZM3.5998 11.7C3.5998 11.2029 4.00275 10.8 4.4998 10.8H5.3998C5.89686 10.8 6.2998 11.2029 6.2998 11.7C6.2998 12.197 5.89686 12.6 5.3998 12.6H4.4998C4.00275 12.6 3.5998 12.197 3.5998 11.7ZM8.0998 10.8C7.60275 10.8 7.1998 11.2029 7.1998 11.7C7.1998 12.197 7.60275 12.6 8.0998 12.6H8.9998C9.49687 12.6 9.8998 12.197 9.8998 11.7C9.8998 11.2029 9.49687 10.8 8.9998 10.8H8.0998Z"
                  fill="#111827"
                />
              </svg>
            </div>
            <span className="leading-normal text-sm dark:text-white">
              Bank Details
            </span>
          </Link>
        </li>
        <li className="pt-2">
          <Link
            href="/account/info"
            className="block px-4 py-2 transition-colors rounded-lg ease-soft-in-out text-slate-500 hover:bg-gray-200"
          >
            <div className="inline-block mr-2 text-black fill-current h-4 w-4 stroke-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 19 19"
                fill="none"
              >
                <path
                  d="M8.9998 8.10001C10.491 8.10001 11.6998 6.89118 11.6998 5.40001C11.6998 3.90885 10.491 2.70001 8.9998 2.70001C7.50864 2.70001 6.2998 3.90885 6.2998 5.40001C6.2998 6.89118 7.50864 8.10001 8.9998 8.10001Z"
                  fill="#2D3748"
                />
                <path
                  d="M2.69971 16.2C2.69971 12.7206 5.52032 9.89996 8.99971 9.89996C12.4791 9.89996 15.2997 12.7206 15.2997 16.2H2.69971Z"
                  fill="#111827"
                />
              </svg>
            </div>
            <span className="leading-normal text-sm dark:text-white">
              Account Info
            </span>
          </Link>
        </li>
        <li className="pt-2">
          <Link
            href="/account/change-password"
            className="block px-4 py-2 transition-colors rounded-lg ease-soft-in-out text-slate-500 hover:bg-gray-200"
          >
            <div className="inline-block mr-2 text-black fill-current h-4 w-4 stroke-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 19 19"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4.49971 8.09999V6.29999C4.49971 3.81471 6.51443 1.79999 8.99971 1.79999C11.485 1.79999 13.4997 3.81471 13.4997 6.29999V8.09999C14.4938 8.09999 15.2997 8.90587 15.2997 9.89999V14.4C15.2997 15.3941 14.4938 16.2 13.4997 16.2H4.49971C3.50559 16.2 2.69971 15.3941 2.69971 14.4V9.89999C2.69971 8.90587 3.50559 8.09999 4.49971 8.09999ZM11.6997 6.29999V8.09999H6.29971V6.29999C6.29971 4.80882 7.50854 3.59999 8.99971 3.59999C10.4909 3.59999 11.6997 4.80882 11.6997 6.29999Z"
                  fill="#2D3748"
                />
              </svg>
            </div>
            <span className="leading-normal text-sm dark:text-white">
              Change Password
            </span>
          </Link>
        </li>
      </ul>
    </div>
  );
}
