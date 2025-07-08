import config from "@/utils/config";
import { fetchInterceptor } from "@/lib/fetchInterceptor";
import { getUserId } from "@/lib/getUserId";
import { User } from "user-module";

async function getUserAccountInfo() {
  try {
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    const userId = await getUserId();
    const url = `${config.baseApiUrl}/Users/${userId}`;
    const response = await fetchInterceptor(url, {
      cache: "no-store",
      method: "GET",
    });

    const data: User = await response.json();

    if (!response.ok) throw data;

    return data;
  } catch (error) {
    console.error("Error fetching data");
    return null;
  }
}

export default async function AccountInfo() {
  const userAccountInfo = await getUserAccountInfo();
  const dateOfBirth = userAccountInfo !== null ? userAccountInfo.dateOfBirth.toString() : "";
  let dateOfBirthFormat = new Date(dateOfBirth).toLocaleString(undefined, { dateStyle: "long" });

  return (
    <div className="flex-auto p-6 pt-0">
      {userAccountInfo == null ? (
        <div className="grid grid-cols-4 gap-y-4">
          <p>Failed to fetch user data...</p>
        </div>
      ) : (
        <div className="w-4/12 max-w-full flex-0">
          <label className="mb-2 ml-1 font-bold text-sm text-slate-700 dark:text-white/80" htmlFor="Name">
            Name
          </label>
          <div className="block w-full flex-col h-full relative flex-wrap items-stretch rounded-lg">
            <input
              disabled
              type="text"
              name="Name"
              placeholder="Name"
              className="focus:shadow-soft-primary-outline dark:bg-gray-950 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-green-300 focus:outline-none"
              value={userAccountInfo?.name}
            />
          </div>
          <label className="mb-2 mt-2 ml-1 font-bold text-sm text-slate-700 dark:text-white/80" htmlFor="Username">
            Username
          </label>
          <div className="relative flex flex-wrap items-stretch w-full rounded-lg">
            <input
              disabled
              type="text"
              name="Username"
              placeholder="Username"
              className="focus:shadow-soft-primary-outline dark:bg-gray-950 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-green-300 focus:outline-none"
              value={userAccountInfo?.username}
            />
          </div>
          <label className="mb-2 mt-2 ml-1 font-bold text-sm text-slate-700 dark:text-white/80" htmlFor="Email">
            Email Address
          </label>
          <div className="relative flex flex-wrap items-stretch w-full rounded-lg">
            <input
              disabled
              type="text"
              name="Email"
              placeholder="Email Address"
              className="focus:shadow-soft-primary-outline dark:bg-gray-950 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-green-300 focus:outline-none"
              value={userAccountInfo?.email}
            />
          </div>
          <label className="mb-2 mt-2 ml-1 font-bold text-sm text-slate-700 dark:text-white/80" htmlFor="Date">
            Date of Birth
          </label>
          <div className="relative flex flex-wrap items-stretch w-full rounded-lg">
            <input
              disabled
              type="text"
              name="DateOfBirth"
              // placeholder="Username"
              className="focus:shadow-soft-primary-outline dark:bg-gray-950 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-green-300 focus:outline-none"
              value={dateOfBirthFormat}
            />
          </div>
        </div>
      )}
    </div>
  );
}
