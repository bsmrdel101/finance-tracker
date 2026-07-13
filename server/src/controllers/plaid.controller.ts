import express, { type Request, type Response } from "express";
import { plaid } from "../modules/plaid";
import { CountryCode, Products } from "plaid";
import { loadAccessToken, saveAccessToken } from "../modules/plaidStorage";


const router = express.Router();
/**
 * @base_path /api/plaid
*/

type PlaidToken = {
  itemId: string;
  accessToken: string;
};

let accessTokens: PlaidToken[] = [];

(async () => {
  accessTokens = await loadAccessToken() || [];
})();

router.get("/status", async (req: Request, res: Response) => {
  try {
    res.json({ connected: accessTokens.length > 0 });
  } catch (error) {
    console.log(`[Error in plaid GET "/status"] ${error}`);
    res.sendStatus(500);
  }
});

router.get("/link-token", async (req: Request, res: Response) => {
  try {
    const plaidRes = await plaid.linkTokenCreate({
      user: {
        client_user_id: process.env.CLIENT_USER_ID!
      },
      client_name: 'Finance App',
      language: 'en',
      country_codes: [CountryCode.Us],
      products: [Products.Transactions],
      transactions: {
        days_requested: 730
      }
    });
  
    res.json(plaidRes.data.link_token);
  } catch(error) {
    console.log(`[Error in plaid GET "/link-token"] ${error}`);
    res.sendStatus(500);
  }
});

router.get("/accounts", async (req: Request, res: Response) => {
  try {
    res.json(accessTokens.map((token) => ({
      itemId: token.itemId
    })));
  } catch(error) {
    console.log(`[Error in plaid GET "/accounts"] ${error}`);
    res.sendStatus(500);
  }
});

router.get("/transactions", async (req: Request, res: Response) => {
  try {
    if (accessTokens.length === 0) {
      return res.status(403).json({ error: "No access token set" });
    }

    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(endDate.getFullYear() - 2);

    const transactions = [];

    for (const token of accessTokens) {
      const plaidRes = await plaid.transactionsGet({
        access_token: token.accessToken,
        start_date: startDate.toISOString().split("T")[0],
        end_date: endDate.toISOString().split("T")[0],
        options: {
          count: 500,
          offset: 0
        }
      });

      transactions.push(...plaidRes.data.transactions);
    }

    res.json(transactions);
  } catch (error) {
    console.log(`[Error in plaid GET "/transactions"] ${error}`);
    res.sendStatus(500);
  }
});

router.post("/exchange-token", async (req: Request, res: Response) => {
  try {
    const plaidRes = await plaid.itemPublicTokenExchange({
      public_token: req.body.publicToken
    });

    const token: PlaidToken = {
      itemId: plaidRes.data.item_id,
      accessToken: plaidRes.data.access_token
    };

    accessTokens.push(token);

    await saveAccessToken(accessTokens);

    res.sendStatus(204);
  } catch(error) {
    console.log(`[Error in plaid POST "/exchange-token"] ${error}`);
    res.sendStatus(500);
  }
});


export default router;