import { ReactNode } from "react";

interface IChangeProps {
  children: (value: string) => ReactNode;
  includePlus?: boolean;
  change: number;
}

export default function Change({
  includePlus,
  children,
  change,
}: IChangeProps) {
  const value: string = `${
    includePlus ? (change > 0 ? "+" : "") : ""
  }${change}%`;

  return (
    <div
      className={`text-${change < 0 ? "red" : "blue"}-500 dark:text-${
        change < 0 ? "red" : "blue"
      }-400`}
    >
      {children(value)}
    </div>
  );
}
