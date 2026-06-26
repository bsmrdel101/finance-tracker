import express, { type Request, type Response } from "express";
import { plaid } from "../modules/plaid";
import { CountryCode, Products } from "plaid";
import { loadAccessToken, saveAccessToken } from "../modules/plaidStorage";


const router = express.Router();
/**
 * @base_path /api/plaid
*/

let accessToken = '';

(async () => {
  accessToken = await loadAccessToken();
})();

router.get("/status", async (req: Request, res: Response) => {
  try {
    res.json({ connected: !!accessToken });
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
      products: [Products.Transactions]
    });
  
    res.json(plaidRes.data.link_token);
  } catch(error) {
    console.log(`[Error in plaid GET "/link-token"] ${error}`);
    res.sendStatus(500);
  }
});

router.get("/accounts", async (req: Request, res: Response) => {
  try {
    res.sendStatus(204);
  } catch(error) {
    console.log(`[Error in plaid GET "/accounts"] ${error}`);
    res.sendStatus(500);
  }
});

router.get("/transactions", async (req: Request, res: Response) => {
  try {
    if (!accessToken) {
      return res.status(403).json({ error: "No access token set" });
    }

    const response = await plaid.transactionsSync({ access_token: accessToken });
    const { added } = response.data;

    res.json(added);
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

    accessToken = plaidRes.data.access_token;
    await saveAccessToken(accessToken);

    res.sendStatus(204);
  } catch(error) {
    console.log(`[Error in plaid POST "/exchange-token"] ${error}`);
    res.sendStatus(500);
  }
});


export default router;
