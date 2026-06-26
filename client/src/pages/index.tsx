import ConnectBank from "@/components/ConnectBank";
import TransactionList from "@/components/TransactionList";


export default function Home() {
  return (
    <main className="home">
      <h1>Finance Tracker</h1>
      <ConnectBank />
      <TransactionList />
    </main>
  );
}
