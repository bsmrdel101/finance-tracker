import { formatCurrency, isValidTransaction } from "@/scripts/utils";
import { getTransactions } from "@/services/plaidService";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";


export default function BalanceChart() {
  const { data: transactions = [] } = useQuery<Transaction[]>({
    queryKey: ["transactions"],
    queryFn: getTransactions
  });

  const data = useMemo(() => {
    const sorted = transactions
      .filter(isValidTransaction)
      .slice()
      .sort((a, b) => a.date.localeCompare(b.date));

    let balance = 0;

    return sorted.map((transaction) => {
      balance -= transaction.amount;

      return {
        date: transaction.date,
        balance
      };
    });
  }, [transactions]);

  
  return (
    <section className="balance-chart">
      <h2>Balance Over Time</h2>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(date) =>
              new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric"
              })
            }
            minTickGap={30}
          />
          <YAxis
            tickFormatter={(value) =>
              new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                notation: "compact"
              }).format(value)
            }
          />
          <Tooltip
            labelFormatter={(date) => String(date)}
            formatter={(value) => [
              formatCurrency(Number(value)),
              "Balance Change"
            ]}
          />
          <Line
            type="monotone"
            dataKey="balance"
            stroke="var(--green-0)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </section>
  );
}
