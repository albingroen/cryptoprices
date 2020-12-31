import { useRouter } from "next/router";
import axios from "axios";
import useSWR from "swr";
import { capitalize, uniqBy } from "lodash";
import moment from "moment";
import History from "../components/History";
import Change from "../components/Change";

const getCoin = async (id: string) => {
  return axios
    .get(`https://api.coinranking.com/v1/public/coin/${id}`)
    .then((res) => res.data.data);
};

export default function CoinView() {
  const router = useRouter();
  const { id } = router.query;

  const isIdValid = id && typeof id === "string";

  const { data, error } = useSWR(isIdValid ? `coins/${id}` : null, () =>
    getCoin(id as string)
  );

  if (!data?.coin || error) return null;

  return (
    <div className="page space-y-6">
      <div className="card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="grid-coin-icon-wrapper">
              <img className="w-5" src={data.coin.iconUrl} alt="" />
            </div>

            <h1 className="text-2xl">
              {data.coin.name}
              <span className="text-xl ml-2.5 opacity-25">
                {data.coin.symbol}
              </span>
            </h1>
          </div>

          <h2 className="text-xl">
            <span className="opacity-25">Slug:</span>{" "}
            <span className="opacity-50">{data.coin.slug}</span>
          </h2>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between space-x-2">
          <div className="flex items-center space-x-2.5">
            {uniqBy([...data.coin.socials, ...data.coin.links], "type").map(
              ({ type, url }, i) => (
                <>
                  {i ? <span className="opacity-10">|</span> : null}

                  <a href={url} target="_blank" rel="noopener noreferer">
                    <p className="transition opacity-40 hover:opacity-60">
                      {capitalize(type)}
                    </p>
                  </a>
                </>
              )
            )}
          </div>

          <h2 className="text-xl mr-3">
            <span className="opacity-25">Rank:</span>{" "}
            <span className="opacity-50">{data.coin.rank}</span>
          </h2>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center space-x-4">
          <div className="flex flex-col space-y-2">
            <p className="opacity-50 text-sm">Change today %</p>
            <div className="flexitems-center space-x-2">
              <Change change={data.coin.change}>
                {(value) => <p>{value}</p>}
              </Change>
            </div>
          </div>

        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="card flex-grow">
          <div className="space-y-2">
            <p className="opacity-50">Current price</p>
            <h1 className="text-3xl font-semibold text-blue-500">
              {data.base.sign}
              {Number(data.coin.price).toFixed(2)}
            </h1>
          </div>
        </div>

        <div className="card flex-grow">
          <div className="space-y-2">
            <p className="opacity-50">
              All time high (
              {moment(data.coin.allTimeHigh.timestamp * 1000).format(
                "YYYY-MM-DD"
              )}
              )
            </p>

            <h1 className="text-3xl font-semibold text-green-500">
              {data.base.sign}
              {Number(data.coin.allTimeHigh.price).toFixed(2)}
            </h1>
          </div>
        </div>

        <div className="card flex-grow">
          <div className="space-y-2">
            <p className="opacity-50">Current marketcap</p>
            <h1 className="text-3xl text-gray-500 font-semibold">
              {data.coin.marketCap}
            </h1>
          </div>
        </div>

        <div className="card flex-grow">
          <div className="space-y-2">
            <p className="opacity-50">Total supply</p>
            <h1 className="text-3xl text-gray-500 font-semibold">
              {data.coin.totalSupply}
            </h1>
          </div>
        </div>

        <div className="card flex-grow">
          <div className="space-y-2">
            <p className="opacity-50">Volume</p>
            <h1 className="text-3xl text-gray-500 font-semibold">
              {data.coin.volume}
            </h1>
          </div>
        </div>
      </div>

      <div className="card">
        <History currency={data.base} id={data.coin.id} />
      </div>
    </div>
  );
}