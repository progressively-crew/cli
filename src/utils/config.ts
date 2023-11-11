import * as fs from "fs-extra";

const CONFIG_FILE_PATH =
  process.env.NODE_ENV === "test"
    ? "/mock-current-folder/config.json"
    : `${process.cwd()}/config.json`;

export type Config = {
  access_token?: string;
  base_url?: string;
  client_key?: string;
  email?: string;
  project_id?: string;
  refresh_token?: string;
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

  await fs.writeJSON(CONFIG_FILE_PATH, finalConfig, { spaces: 2 });
}

export async function readConfig(): Promise<Config> {
  const defaultConfig: Config = {
    base_url: "https://api.progressively.app",
  };

  if (await fs.pathExists(CONFIG_FILE_PATH)) {
    const localConfig = await fs.readJSON(CONFIG_FILE_PATH);
    return { ...defaultConfig, ...localConfig };
  }

  return defaultConfig;
}
