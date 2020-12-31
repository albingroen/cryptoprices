import moment from "moment";

export const normalizeHistory = (
  history: { timestamp: string; price: number }[]
) => {
  const cleanArr = history.map((i) => ({
    timestamp: moment(i.timestamp).format('YYYY-MM-DD'),
    price: Number(i.price),
  }));

  // const highest = maxBy(cleanArr, "price");
  // const lowest = minBy(cleanArr, "price");

  // const normalized = cleanArr.map((i) => ({
  //   price: (i.price - lowest.price) / (highest.price - lowest.price),
  //   timestamp: i.timestamp,
  // }));

  // const normalizedLarge = normalized.map((i) => ({
  //   price: Math.round(i.price * 100),
  //   timestamp: moment(i.timestamp).format('YYYY-MM-DD'),
  // }));

  return cleanArr;
};
