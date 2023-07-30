import { input } from "@inquirer/prompts";
import { readConfig } from "./config";
import { getHttpClient } from "./http";

export async function createFlag() {
  const config = await readConfig();
  const httpClient = await getHttpClient();

  const name = await input({ message: "What is the name of the flag" });
  const description = await input({
    message: "What is the description of the flag",
  });

  return httpClient.post(`/projects/${config.project_id}/flags`, {
    name,
    description,
  });
}
