import express, { type Request, type Response } from "express";
import { plaid } from "../modules/plaid";
import { CountryCode, Products } from "plaid";


const router = express.Router();
/**
 * @base_path /api/plaid
*/

let accessToken = '';

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
    
    console.log(plaidRes.data);

    res.json(plaidRes.data);
  } catch(error) {
    console.log(`[Error in plaid GET "/link-token"] ${error}`);
    res.sendStatus(500);
  }
});

router.get("/accounts", async (req: Request, res: Response) => {
  try {
    res.sendStatus(200);
  } catch(error) {
    console.log(`[Error in plaid GET "/accounts"] ${error}`);
    res.sendStatus(500);
  }
});

router.get("/transactions", async (req: Request, res: Response) => {
  try {
    const plaidRes = await plaid.transactionsSync({ access_token: accessToken });
    res.json(plaidRes.data);
  } catch(error) {
    console.log(`[Error in plaid GET "/transactions"] ${error}`);
    res.sendStatus(500);
  }
});

router.get("/exchange-token", async (req: Request, res: Response) => {
  try {
    const plaidRes = await plaid.itemPublicTokenExchange({
      public_token: req.query.publicToken?.toString() ?? ''
    });

    accessToken = plaidRes.data.access_token;

    res.sendStatus(201);
  } catch(error) {
    console.log(`[Error in plaid POST "/exchange-token"] ${error}`);
    res.sendStatus(500);
  }
});


export default router;
