import fs from "fs/promises";
import path from "path";


const FILE = path.join(process.cwd(), 'plaid.json');

interface PlaidStorage {
  accessToken: string;
}

export async function loadAccessToken(): Promise<string> {
  try {
    const data = await fs.readFile(FILE, 'utf8');
    const json = JSON.parse(data) as PlaidStorage;
    return json.accessToken;
  } catch {
    return '';
  }
}

export async function saveAccessToken(accessToken: string): Promise<void> {
  const data: PlaidStorage = { accessToken };
  await fs.writeFile(FILE, JSON.stringify(data, null, 2));
}
