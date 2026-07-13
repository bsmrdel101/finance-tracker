import fs from "fs/promises";
import path from "path";

interface PlaidStorage {
  itemId: string;
  accessToken: string;
}


const FILE = path.join(process.cwd(), 'plaid.json');

export async function loadAccessToken(): Promise<PlaidStorage[]> {
  try {
    const data = await fs.readFile(FILE, 'utf8');
    return JSON.parse(data) as PlaidStorage[];
  } catch {
    return [];
  }
}

export async function saveAccessToken(accessTokens: PlaidStorage[]): Promise<void> {
  await fs.writeFile(FILE, JSON.stringify(accessTokens, null, 2));
}