import AccountSidebar from "../components/AccountSideBar";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative w-full mx-auto mt-6">
      <div className="flex w-full sm-max:flex-col">
        <div className="flex w-full h-full mb-12 lg:w-3/12">
          <AccountSidebar />
        </div>

        <div className="flex w-full h-full lg:w-9/12">{children}</div>
      </div>
    </div>
  );
}
