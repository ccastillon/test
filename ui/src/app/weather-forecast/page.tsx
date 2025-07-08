import Link from "next/link";
import config from "@/utils/config";
import { getServerSession } from "next-auth";
// import { authOptions } from "../api/auth/[...nextauth]/route";
import { fetchInterceptor } from "@/lib/fetchInterceptor";
import { authOptions } from "@/lib/auth";

export const metadata = {
  title: "Weather Forecast API - FTBookie",
};

interface IWeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

async function fetchWeatherForecasts() {
  try {
    const session = await getServerSession(authOptions);
    const accessToken = session?.user.accessToken;
    const response = await fetch(`${config.baseApiUrl}/WeatherForecast`, {
      cache: "no-store",
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 401) {
      return [];
    }

    const weatherForecasts: IWeatherForecast[] = await response.json();
    return weatherForecasts;
  } catch (error) {
    // console.log("error: ", error);
    throw new Error(`Failed to fetch weather forecast. Error: ${error}`);
  }
}

async function testFetchInterceptor() {
  const session = await getServerSession(authOptions);
  const accessToken = session?.user.accessToken;
  const response = await fetchInterceptor(`${config.baseApiUrl}/WeatherForecast`, {
    cache: "no-store",
    method: "GET",
    // headers: {
    //   // Authorization: `Bearer ${accessToken}`,
    //   // "Content-Type": "application/json",
    // },
  });

  if (!response.ok && response.status !== 200) {
    console.log("Error fetching data");
    return [];
  } else {
    const data: IWeatherForecast[] = await response.json();
    // console.log("DATA: ", data);
    return data;
  }

  // return await response.json();
}

export default async function WeatherForecastPage() {
  console.log("WeatherForecastPage");

  // const weatherForecasts: IWeatherForecast[] = [];
  const weatherForecasts = await testFetchInterceptor();

  return (
    <div className="p-10">
      <h1 className="mt-5 text-2xl">Weather Forecast API</h1>
      {!weatherForecasts.length ? (
        <p className="text-center">Failed to fetch weather forecast...</p>
      ) : (
        <div className="flex flex-col">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-hidden">
                <table className="min-w-full text-left text-sm font-light">
                  <thead className="border-b font-medium dark:border-neutral-500">
                    <tr>
                      <th scope="col" className="px-6 py-4">
                        date
                      </th>
                      <th scope="col" className="px-6 py-4">
                        temperatureC
                      </th>
                      <th scope="col" className="px-6 py-4">
                        temperatureF
                      </th>
                      <th scope="col" className="px-6 py-4">
                        summary
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {weatherForecasts.map((forecast) => (
                      <tr key={forecast.date} className="border-b dark:border-neutral-500">
                        <td className="whitespace-nowrap px-6 py-4 font-medium">{forecast.date}</td>
                        <td className="whitespace-nowrap px-6 py-4">{forecast.temperatureC}</td>
                        <td className="whitespace-nowrap px-6 py-4">{forecast.temperatureF}</td>
                        <td className="whitespace-nowrap px-6 py-4">{forecast.summary}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
