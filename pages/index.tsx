import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";
import Change from "../components/Change";
import MetaTags from "../components/MetaTags/MetaTags";

const getCoins = async () => {
  return axios
    .get("https://api.coinranking.com/v1/public/coins?sort=price&limit=100")
    .then((res) => res.data.data);
};

export default function Home() {
  const { data, error } = useSWR("coins", getCoins);
  const router = useRouter();

  if (!data?.coins || error) return null;

  return (
    <div className="page space-y-8">
      <MetaTags
        image="https://res.cloudinary.com/albin-groen/image/upload/v1621442165/cryptorprices-og-image_rprl20.png"
        description="Monitor, explore and track all available cryptocurrencies"
        url={`https://cryptoprices.albingroen.com${router.asPath}`}
        title="Cryptoprices"
      />

      <div className="grid gap-4 grid-cols-1 xl:grid-cols-2">
        {data.coins.map((coin) => (
          <Link href={`/${coin.id}`} key={coin.id}>
            <div className="card transition hover:shadow-lg cursor-pointer">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="grid-coin-icon-wrapper">
                    <img className="w-3 sm:w-5" src={coin.iconUrl} alt="" />
                  </div>

                  <h3 className="truncate overflow-ellipsis w-24 sm:w-auto">
                    {coin.name}
                  </h3>
                </div>

                <div className="flex items-center space-x-4 flex-none">
                  <div className="flex flex-col items-end text-right">
                    <h3 className="font-medium text-blue-500 dark:text-blue-300">
                      {data.base.sign}
                      {Number(coin.price).toFixed(2)}
                    </h3>

                    <p className="text-sm opacity-30 dark:opacity-40 truncate overflow-ellipsis w-20 sm:w-auto">
                      {data.base.sign}
                      {coin.price} {coin.symbol}
                    </p>
                  </div>

                  <Change change={Math.round(coin.change)}>
                    {(value) => (
                      <div
                        className={`h-11 w-11 ${
                          Math.round(coin.change) < 0
                            ? "bg-red-100"
                            : "bg-blue-100"
                        } rounded-md flex items-center justify-center dark:bg-opacity-5`}
                      >
                        <span className="font-medium sm:font-normal text-xs sm:text-sm">
                          {value}
                        </span>
                      </div>
                    )}
                  </Change>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
