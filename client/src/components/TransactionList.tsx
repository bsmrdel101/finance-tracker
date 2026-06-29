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

  const yearlyGroups = useMemo(() => {
    const result: Record<
      string,
      {
        month: string;
        items: Transaction[];
      }[]
    > = {};

    for (const [month, items] of sortedGroups) {
      const year = month.split(" ")[1];

      if (!result[year]) {
        result[year] = [];
      }

      result[year].push({ month, items });
    }

    return Object.entries(result).sort(([a], [b]) => Number(b) - Number(a));
  }, [sortedGroups]);

  const monthlyTotals = (items: Transaction[]) => {
    const spent = items
      .filter((t) => t.amount >= 0)
      .reduce((acc, t) => acc + t.amount, 0);

    const received = Math.abs(
      items
        .filter((t) => t.amount < 0)
        .reduce((acc, t) => acc + t.amount, 0)
    );

    const change = received - spent;

    return { spent, received, change };
  };


  return (
    <div className="transactions">
      {yearlyGroups.map(([year, months]) => {
        const yearItems = months.flatMap(({ items }) => items);
        const yearTotals = monthlyTotals(yearItems);

        return (
          <div key={year}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '1rem' }}>
              <h2>{ year }</h2>
              <p>
                (Received{' '}
                <span style={{ color: 'var(--green-0)' }}>
                  +{ formatCurrency(yearTotals.received) }
                </span>, 
                Spent{' '}
                <span style={{ color: 'var(--red-0)' }}>
                  -{ formatCurrency(yearTotals.spent) }
                </span>, 
                Change{' '}
                <span style={{ color: yearTotals.change >= 0 ? 'var(--green-0)' : 'var(--red-0)' }}>
                  { yearTotals.change >= 0 ? '+' : '-' }
                  { formatCurrency(Math.abs(yearTotals.change)) }
                </span>)
              </p>
            </div>
            <hr />

            {months.map(({ month, items }) => {
              const { spent, received, change } = monthlyTotals(items);

              return (
                <div key={month} className="transaction-group">
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <h3>{ month }</h3>
                    <p>
                      (Received{' '}
                      <span style={{ color: 'var(--green-0)' }}>
                        +{ formatCurrency(received) }
                      </span>, 
                      Spent{' '}
                      <span style={{ color: 'var(--red-0)' }}>
                        -{ formatCurrency(spent) }
                      </span>, 
                      Change{' '}
                      <span style={{ color: change >= 0 ? 'var(--green-0)' : 'var(--red-0)' }}>
                        { change >= 0 ? '+' : '-' }
                        { formatCurrency(Math.abs(change)) }
                      </span>
                      )
                    </p>
                  </div>

                  {items.map((transaction) => {
                    const isExpense = transaction.amount >= 0;

                    return (
                      <div key={transaction.transactionId} className="transaction">
                        <div style={{ width: '35rem' }}>
                          <h4>{ transaction.name }</h4>
                          <p style={{ color: isExpense ? 'var(--red-0)' : 'var(--green-0)' }}>
                            { isExpense ? '-' : '+' }
                            { formatCurrency(transaction.amount) }
                          </p>
                        </div>

                        <p className="transaction__date"><em>{ transaction.date }</em></p>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
