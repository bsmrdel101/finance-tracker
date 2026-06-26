import { usePlaidLink } from "react-plaid-link";

export default function ConnectBank() {
  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess(publicToken) {
      exchangeToken(publicToken);
    }
  });

  
  return (
    <button disabled={!ready} onClick={() => open()}>
      Connect Bank
    </button>
  );
}
