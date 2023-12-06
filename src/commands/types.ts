import { Command } from "@oclif/core";
import fs from "node:fs";
import fsPromises from "node:fs/promises";
import path from "node:path";
import prettier from "prettier";

import { UserConfig, readUserConfig } from "../utils/config";
import { getHttpClient } from "../utils/http";

export default class Types extends Command {
  static args = {};

  static description = "Generate types based on your Progressively instance";

  static examples = ["<%= config.bin %> <%= command.id %>"];

  static flags = {};

  getTargetPath() {
    const directory = path.join(
      process.cwd(),
      "node_modules",
      "@types",
      "@progressively",
    );

    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    return path.join(directory, "index.d.ts");
  }

  public async run(): Promise<void> {
    await this.guardConfig();

    const httpClient = await getHttpClient(true);

    const { data } = await httpClient.get(`/sdk/types/gen`);

    const formattedData = await prettier.format(data, { parser: "typescript" });

    const targetFilePath = this.getTargetPath();

    await fsPromises.writeFile(targetFilePath, formattedData);
    this.log(`Your types file has been generated at ${targetFilePath}`);
  }

  private async guardConfig(): Promise<UserConfig> {
    let config = await readUserConfig();

    if (!config.secret_key) {
      config = await this.config.runCommand("env");
    }

    return config;
  }
}
