import * as fs from "fs-extra";

const USER_CONFIG_FILE_PATH =
  process.env.NODE_ENV === "test"
    ? "/mock-current-folder/config.json"
    : `${process.cwd()}/config.json`;

export type UserConfig = {
  access_token?: string;
  base_url?: string;
  client_key?: string;
  email?: string;
  project_id?: string;
  refresh_token?: string;
};

export function getUserConfigPath(): string {
  return USER_CONFIG_FILE_PATH;
}

export async function updateUserConfig(newConfig: UserConfig): Promise<void> {
  let finalConfig = newConfig;

  if (await fs.pathExists(USER_CONFIG_FILE_PATH)) {
    const currentConfig = await fs.readJSON(USER_CONFIG_FILE_PATH);

    finalConfig = { ...currentConfig, ...newConfig };
  }

  await fs.writeJSON(USER_CONFIG_FILE_PATH, finalConfig, { spaces: 2 });
}

export async function readUserConfig(): Promise<UserConfig> {
  const defaultConfig: UserConfig = {
    access_token: "",
    base_url: "",
    client_key: "",
    email: "",
    project_id: "",
    refresh_token: "",
  };

  if (await fs.pathExists(USER_CONFIG_FILE_PATH)) {
    const localConfig = await fs.readJSON(USER_CONFIG_FILE_PATH);
    return { ...defaultConfig, ...localConfig };
  }

  return defaultConfig;
}
