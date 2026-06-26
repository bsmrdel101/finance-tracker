import { formatCurrency, getMonthKey, groupBy, isValidTransaction } from "@/scripts/utils";
import { getTransactions } from "@/services/plaidService";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export default function TransactionList() {
  const { data: transactions = [] } = useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: getTransactions
  });

  const grouped = useMemo(() => {
    return groupBy(
      transactions.filter(isValidTransaction),
      (t) => getMonthKey(t.date)
    );
  }, [transactions]);

  const sortedGroups = useMemo(() => {
    return Object.entries(grouped).sort(([a], [b]) => {
      const [ma, ya] = a.split(" ");
      const [mb, yb] = b.split(" ");

      const monthIndex = {
        January: 0, February: 1, March: 2, April: 3,
        May: 4, June: 5, July: 6, August: 7,
        September: 8, October: 9, November: 10, December: 11
      };

      return (
        Number(yb) - Number(ya) ||
        monthIndex[mb as keyof typeof monthIndex] -
        monthIndex[ma as keyof typeof monthIndex]
      );
    });
  }, [grouped]);

  const monthlyTotals = (items: Transaction[]) => {
    const spent = items
      .filter((t) => t.amount < 0)
      .reduce((acc, t) => acc + t.amount, 0);

    const received = items
      .filter((t) => t.amount >= 0)
      .reduce((acc, t) => acc + t.amount, 0);
    
    const sum = received + spent;
    const change = `${sum >= 0 ? '+' : ''}${sum}`;

    return { spent, received, change };
  };


  return (
    <>
      <h2>Transactions</h2>
      <div className="transactions">
        {sortedGroups.map(([month, items]) => {
          const { spent, received, change } = monthlyTotals(items);
          
          return (
            <div key={month} className="transaction-group">
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <h3>{ month }</h3>
                <p>
                  (Spent:
                  <span style={spent < 0 ? { color: 'var(--red-0)' } : { color: 'var(--green-0)' }}>
                    { formatCurrency(spent) }
                  </span>,
                  Received:
                  <span style={spent < 0 ? { color: 'var(--red-0)' } : { color: 'var(--green-0)' }}>
                    { formatCurrency(received) }
                  </span>,
                  Change:
                  <span style={spent < 0 ? { color: 'var(--red-0)' } : { color: 'var(--green-0)' }}>
                    { formatCurrency(change) })
                  </span>
                </p>
              </div>

              {items.map((transaction) => {
                const isPositive = transaction.amount >= 0;
                return (
                  <div key={transaction.transactionId} className="transaction">
                    <h4>{ transaction.name }</h4>
                    <p style={isPositive ? { color: 'var(--green-0)' } : { color: 'var(--red-0)' }}>
                      { isPositive && '+' }{ formatCurrency(transaction.amount) }
                    </p>
                    <p className="transaction__date"><em>{ transaction.date }</em></p>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
}
