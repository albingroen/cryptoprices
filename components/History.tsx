import { ChangeEvent, useState } from "react";
import axios from "axios";
import useSWR from "swr";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  CartesianGrid,
  AreaChart,
  Area,
  YAxis,
} from "recharts";
import { normalizeHistory } from "../lib/utils";
import Change from "./Change";
import moment from "moment";

const getHistory = async (url: string, interval: string) => {
  const id = url.split("/")[1];

  return axios
    .get(`https://api.coinranking.com/v1/public/coin/${id}/history/${interval}`)
    .then((res) => res.data.data);
};

const History = ({ id, currency }) => {
  // Client state
  const [interval, setInterval] = useState<string>("1y");

  // Server state
  const { data, error, revalidate } = useSWR(
    [`coins/${id}/history`, interval],
    getHistory
  );

  if (error)
    return (
      <div className="flex items-center justify-between">
        <p className="text-red-500">Could not fetch history chart...</p>;
        <p onClick={revalidate} className="text-blue-500 cursor-pointer">
          Retry
        </p>
      </div>
    );

  const normalizedArray = data?.history ? normalizeHistory(data.history) : [];

  const onChangeInterval = (e: ChangeEvent<HTMLInputElement>) => {
    setInterval(e.currentTarget.value);
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex space-x-2 items-center justify-between">
        <div className="flex items-center space-x-7 select-none">
          <p className="opacity-50">Currency trend</p>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <input
                checked={interval === "24h"}
                onChange={onChangeInterval}
                name="interval"
                id="day"
                value="24h"
                type="radio"
              />
              <label htmlFor="day" className="opacity-50 text-sm">
                Day
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                checked={interval === "7d"}
                onChange={onChangeInterval}
                name="interval"
                id="week"
                value="7d"
                type="radio"
              />
              <label htmlFor="week" className="opacity-50 text-sm">
                Week
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                checked={interval === "30d"}
                onChange={onChangeInterval}
                name="interval"
                id="month"
                value="30d"
                type="radio"
              />
              <label htmlFor="month" className="opacity-50 text-sm">
                Month
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                checked={interval === "1y"}
                onChange={onChangeInterval}
                name="interval"
                id="year"
                value="1y"
                type="radio"
              />
              <label htmlFor="year" className="opacity-50 text-sm">
                Year
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                checked={interval === "5y"}
                onChange={onChangeInterval}
                name="interval"
                id="5-years"
                value="5y"
                type="radio"
              />
              <label htmlFor="5-years" className="opacity-50 text-sm">
                All
              </label>
            </div>
          </div>
        </div>

        {data?.change && (
          <Change change={data.change}>
            {(value) => <h2 className="text-xl">{value}</h2>}
          </Change>
        )}
      </div>

      <ResponsiveContainer key={interval} height={400} width="100%">
        <AreaChart data={normalizedArray}>
          <CartesianGrid strokeDasharray="3 3" />

          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
            </linearGradient>
          </defs>

          <XAxis
            tickFormatter={(value) => moment(value).format("YYYY-MM-DD")}
            allowDuplicatedCategory={false}
            dataKey="timestamp"
            tickLine={false}
            minTickGap={20}
            tickSize={15}
          />

          <Tooltip
            labelFormatter={(value) => moment(value).format("YYYY-MM-DD")}
            formatter={(value) =>
              `${Number(value).toFixed(2)} ${currency.symbol}`
            }
          />

          <Area
            type="monotone"
            strokeOpacity={0.75}
            strokeWidth={2}
            dot={false}
            dataKey="price"
            stroke="#82ca9d"
            fillOpacity={1}
            fill="url(#colorPv)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default History;
