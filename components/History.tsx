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
  const { data, error } = useSWR([`coins/${id}/history`, interval], getHistory);

  if (!data || error) return null

  const normalizedArray = normalizeHistory(data.history);

  const onChangeInterval = (e: ChangeEvent<HTMLInputElement>) => {
    setInterval(e.currentTarget.value);
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex space-x-2 items-center justify-between">
        <div className="flex items-center space-x-6">
          <p className="opacity-50">Currency trend</p>

          <div className="flex items-center space-x-4 select-none">
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
                1 day
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
                1 month
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
                1 year
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
                5 years
              </label>
            </div>
          </div>
        </div>

          <Change change={data.change}>
            {(value) => <h2 className="text-xl">{value}</h2>}
          </Change>
      </div>

      <ResponsiveContainer key={interval} height={400} width="100%">
          <LineChart data={normalizedArray}>
            <CartesianGrid strokeDasharray="3 3" />

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

            <Line
              type="monotone"
              strokeOpacity={0.75}
              strokeWidth={2}
              dot={false}
              dataKey="price"
              stroke="#8884d8"
            />
          </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default History;
