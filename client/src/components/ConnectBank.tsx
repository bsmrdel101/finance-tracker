import { exchangeToken, getPlaidStatus, linkToken } from "@/services/plaidService";
import { useQuery } from "@tanstack/react-query";
import { usePlaidLink } from "react-plaid-link";


export default function ConnectBank() {
  const { data: status } = useQuery<boolean>({
    queryKey: ['status'],
    queryFn: getPlaidStatus
  });

  const { data: token = null } = useQuery<string | null>({
    queryKey: ['link-token'],
    queryFn: linkToken
  });

  const { open, ready } = usePlaidLink({
    token,
    onSuccess(publicToken) {
      exchangeToken(publicToken);
    },
    onExit(err, metadata) {
      console.log('EXIT ERROR:', err);
      console.log('EXIT METADATA:', metadata);
    }
  });


  if (status) return null;

  return (
    <button disabled={!ready} onClick={() => open()}>
      Connect Bank
    </button>
  );
}