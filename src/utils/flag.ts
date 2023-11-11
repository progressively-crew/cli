import { input } from "@inquirer/prompts";

import { readUserConfig } from "./config";
import { getHttpClient } from "./http";

export async function createFlag() {
  const { project_id } = await readUserConfig();
  const httpClient = await getHttpClient(true);

  const name = await input({ message: "What is the name of the flag" });
  const description = await input({
    message: "What is the description of the flag",
  });

  if (!project_id) {
    throw new Error("Couldn't find the project");
  }

  return httpClient.post(`/projects/${project_id}/flags`, {
    description,
    name,
  });
}
