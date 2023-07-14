import * as fs from "fs-extra";

const CONFIG_FILE_PATH = `${process.cwd()}/config.json`;

export async function updateConfig(
  newConfig: Record<string, string>
): Promise<void> {
  let finalConfig = newConfig;

  if (await fs.exists(CONFIG_FILE_PATH)) {
    const currentConfig = await fs.readJSON(CONFIG_FILE_PATH);

    finalConfig = { ...currentConfig, ...newConfig };
  }

  await fs.writeJSON(CONFIG_FILE_PATH, finalConfig);
}
