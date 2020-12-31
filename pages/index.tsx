import axios from "axios";
import Link from "next/link";
import useSWR from "swr";
import Change from "../components/Change";

const getCoins = async () => {
  return axios
    .get("https://api.coinranking.com/v1/public/coins?sort=price&limit=100")
    .then((res) => res.data.data);
};

export default function Home() {
  const { data, error } = useSWR("coins", getCoins);

  if (!data?.coins || error) return null;

  return (
    <div className="page space-y-8">
      <div className="coins-grid">
        {data.coins.map((coin) => (
          <Link href={`/${coin.id}`} key={coin.id}>
            <div className="card transition transform hover:scale-110 hover:shadow-lg cursor-pointer">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="grid-coin-icon-wrapper">
                    <img className="w-5" src={coin.iconUrl} alt="" />
                  </div>

                  <h3>{coin.name}</h3>
                </div>

                <div className="flex items-center space-x-4 flex-none">
                  <div className="flex flex-col items-end text-right">
                    <h3 className="font-semibold">
                      {data.base.sign}
                      {Math.round(coin.price)}
                    </h3>

                    <p className="text-sm opacity-30">
                      {data.base.sign}
                      {coin.price} {coin.symbol}
                    </p>
                  </div>

                  <Change change={Math.round(coin.change)}>
                    {(value) => (
                      <div
                        className={`h-11 w-11 bg-${
                          Math.round(coin.change) < 0 ? "red" : "blue"
                        }-100 text-sm font-medium rounded-lg flex items-center justify-center dark:bg-opacity-5`}
                      >
                        {value}
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
