import { useRouter } from "next/router";
import axios from "axios";
import useSWR from "swr";
import { capitalize, uniqBy } from "lodash";
import moment from "moment";
import History from "../components/History";
import Change from "../components/Change";
import MetaTags from "../components/MetaTags/MetaTags";
import { Fragment } from "react";

const getCoin = async (id: string) => {
  return axios
    .get(`https://api.coinranking.com/v1/public/coin/${id}`)
    .then((res) => res.data.data);
};

function CoinView(props) {
  const router = useRouter();
  const { id } = router.query;

  const isIdValid = id && typeof id === "string";

  const { data, error } = useSWR(
    isIdValid ? `coins/${id}` : null,
    () => getCoin(id as string),
    { initialData: props.coin }
  );

  if (!data?.coin || error) return null;

  return (
    <>
      <MetaTags
        image="https://res.cloudinary.com/albin-groen/image/upload/v1621442165/cryptorprices-og-image_rprl20.png"
        description="Monitor, explore and track all available cryptocurrencies"
        url={`https://cryptoprices.albingroen.com${router.asPath}`}
        title={`Cryptoprices | ${data.coin.name}`}
      />

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

            <h2 className="text-xl hidden sm:block">
              <span className="opacity-25">Slug:</span>{" "}
              <span className="opacity-50">{data.coin.slug}</span>
            </h2>
          </div>
        </div>

        <div className="card">
          <div className="flex flex-col sm:flex-row justify-between space-y-4 items-start sm:items-center sm:space-y-0 sm:space-x-2">
            <div className="flex items-center space-x-2.5 overflow-x-auto w-full sm:w-auto">
              {uniqBy([...data.coin.socials, ...data.coin.links], "type").map(
                ({ type, url }, i) => (
                  <Fragment key={type}>
                    {i ? <span className="opacity-10">|</span> : null}

                    <a href={url} target="_blank" rel="noopener noreferer">
                      <p className="transition opacity-40 hover:opacity-60">
                        {capitalize(type)}
                      </p>
                    </a>
                  </Fragment>
                )
              )}
            </div>

            <div className="flex items-center space-x-2">
              <h2 className="text-xl mr-3">
                <span className="opacity-25">Listed in:</span>{" "}
                <span className="opacity-50">
                  {moment(data.coin.listedAt * 1000).format("YYYY-MM-DD")}
                </span>
              </h2>

              <h2 className="text-xl mr-3">
                <span className="opacity-25">Rank:</span>{" "}
                <span className="opacity-50">{data.coin.rank}</span>
              </h2>
            </div>
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

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <div className="card flex-grow">
            <div className="space-y-2">
              <p className="opacity-50">Current price</p>
              <h1 className="text-3xl font-medium text-blue-500 dark:text-blue-400">
                {data.base.sign}
                {Number(data.coin.price).toFixed(2)}
              </h1>
            </div>
          </div>

          <div className="card flex-grow">
            <div className="space-y-2">
              <p className="opacity-50">
                All time high (
                {moment(
                  new Date(data.coin.allTimeHigh.timestamp).getTime() > 0
                    ? data.coin.allTimeHigh.timestamp
                    : data.coin.allTimeHigh.timestamp * 1000
                ).format("YYYY-MM-DD")}
                )
              </p>

              <h1 className="text-3xl font-medium text-green-500 dark:text-green-400">
                {data.base.sign}
                {Number(data.coin.allTimeHigh.price).toFixed(2)}
              </h1>
            </div>
          </div>

          <div className="card flex-grow">
            <div className="space-y-2">
              <p className="opacity-50">Current marketcap</p>
              <h1 className="text-3xl text-gray-500 dark:text-gray-400 font-medium">
                {data.base.sign}
                {Number(data.coin.marketCap).toFixed(2)}
              </h1>
            </div>
          </div>

          <div className="card flex-grow">
            <div className="space-y-2">
              <p className="opacity-50">Total supply</p>
              <h1 className="text-3xl text-gray-500 dark:text-gray-400 font-medium">
                {Number(data.coin.totalSupply).toFixed(2)}
              </h1>
            </div>
          </div>

          <div className="card flex-grow">
            <div className="space-y-2">
              <p className="opacity-50">Circulating supply</p>
              <h1 className="text-3xl text-gray-500 dark:text-gray-400 font-medium">
                {Number(data.coin.circulatingSupply).toFixed(2)}
              </h1>
            </div>
          </div>

          <div className="card flex-grow">
            <div className="space-y-2">
              <p className="opacity-50">Volume</p>
              <h1 className="text-3xl text-gray-500 dark:text-gray-400 font-medium">
                {data.coin.volume}
              </h1>
            </div>
          </div>
        </div>

        <div className="card hidden sm:block">
          <History currency={data.base} id={data.coin.id} />
        </div>
      </div>
    </>
  );
}

CoinView.getInitialProps = async ({ query }) => {
  const coin = query.id && (await getCoin(query.id));
  return { coin };
};

export default CoinView;
