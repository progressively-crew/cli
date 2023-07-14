import * as fs from "fs-extra";

const CONFIG_FILE_PATH = `${process.cwd()}/config.json`;

type Config = {
  access_token?: string;
  project_id?: string;
};

export async function updateConfig(newConfig: Config): Promise<void> {
  let finalConfig = newConfig;

  if (await fs.exists(CONFIG_FILE_PATH)) {
    const currentConfig = await fs.readJSON(CONFIG_FILE_PATH);

    finalConfig = { ...currentConfig, ...newConfig };
  }

  await fs.writeJSON(CONFIG_FILE_PATH, finalConfig);
}

export function readConfig(): Promise<Config> {
  return fs.readJSON(CONFIG_FILE_PATH);
}
