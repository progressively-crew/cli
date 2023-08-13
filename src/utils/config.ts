import * as fs from "fs-extra";

const CONFIG_FILE_PATH = `${process.cwd()}/config.json`;

export type Config = {
  access_token?: string;
  refresh_token?: string;
  project_id?: string;
  base_url?: string;
  email?: string;
  client_key?: string;
};

export function getConfigPath(): string {
  return CONFIG_FILE_PATH;
}

export async function updateConfig(newConfig: Config): Promise<void> {
  let finalConfig = newConfig;

  if (await fs.pathExists(CONFIG_FILE_PATH)) {
    const currentConfig = await fs.readJSON(CONFIG_FILE_PATH);

    finalConfig = { ...currentConfig, ...newConfig };
  }

  await fs.writeJSON(CONFIG_FILE_PATH, finalConfig);
}

export async function readConfig(): Promise<Config> {
  const defaultConfig: Config = {
    base_url: "https://api.progressively.app",
  };

  if (await fs.pathExists(CONFIG_FILE_PATH)) {
    return { ...defaultConfig, ...fs.readJSON(CONFIG_FILE_PATH) };
  }

  return defaultConfig;
}
