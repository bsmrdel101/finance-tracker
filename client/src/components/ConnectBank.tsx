import { exchangeToken, getPlaidStatus, linkToken } from "@/services/plaidService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usePlaidLink } from "react-plaid-link";


export default function ConnectBank() {
  const queryClient = useQueryClient();

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
      exchangeToken(publicToken).then(() => {
        queryClient.invalidateQueries({
          queryKey: ['status']
        });

        queryClient.invalidateQueries({
          queryKey: ['transactions']
        });
      });
    },
    onExit(err, metadata) {
      console.log('EXIT ERROR:', err);
      console.log('EXIT METADATA:', metadata);
    }
  });


  return (
    <button disabled={!ready} onClick={() => open()}>
      { status ? 'Add Another Bank' : 'Connect Bank' }
    </button>
  );
}
