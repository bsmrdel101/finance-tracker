import api from "@/scripts/config/axios";


// === GET routes === //

export const getPlaidStatus = async (): Promise<boolean> => {
  try {
    const res = await api.get("/api/plaid/status");
    return res.data.connected;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const linkToken = async (): Promise<string | null> => {
  try {
    const res = await api.get('/api/plaid/link-token');
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getTransactions = async (): Promise<Transaction[]> => {
  try {
    const res = await api.get('/api/plaid/transactions');
    return res.data.filter((t: Transaction) => !t.name.includes('INTERNET TFR') && !t.name.includes('CHASE CREDIT CRDAUTOPAY'));
  } catch (error) {
    console.error(error);
    return [];
  }
};

// === POST routes === //

export const exchangeToken = async (publicToken: string) => {
  try {
    await api.post('/api/plaid/exchange-token', { publicToken });
  } catch (error) {
    console.error(error);
  }
};
