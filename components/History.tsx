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

const getHistory = async (id: string) => {
  return axios
    .get(`https://api.coinranking.com/v1/public/coin/${id}/history/1y`)
    .then((res) => res.data.data);
};

const History = ({ id, currency }) => {
  const { data, error } = useSWR(`coins/${id}/history`, () => getHistory(id));

  if (!data || error) return null;

  const normalizedArray = normalizeHistory(data.history);

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex space-x-2 items-center justify-between">
        <p className="opacity-50">1 year trend</p>

        {data.change && (
          <Change change={data.change}>
            {(value) => <h2 className="text-xl">{value}</h2>}
          </Change>
        )}
      </div>

      <ResponsiveContainer height={400} width="100%">
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
