import { Command, Flags } from "@oclif/core";
import fsPromises from "node:fs/promises";
import prettier from "prettier";

import { UserConfig, readUserConfig } from "../utils/config";
import { getHttpClient } from "../utils/http";

export default class Types extends Command {
  static args = {};

  static description = "Generate types based on your Progressively instance";

  static examples = ["<%= config.bin %> <%= command.id %>"];

  static flags = {
    name: Flags.string({
      char: "N",
      default: "progressively.d.ts",
      description: "Name of the generated types file",
      required: false,
    }),
    output: Flags.string({
      char: "O",
      default: process.cwd(),
      description:
        "Relative path of the folder where the types file should be generated",
      required: false,
    }),
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(Types);

    const { client_key } = await this.guardConfig();

    const httpClient = await getHttpClient(true);

    const { data } = await httpClient.get(`/sdk/${client_key}/types/gen`);

    const targetFilePath = `${flags.output}/${flags.name}`;

    const formattedData = await prettier.format(data, { parser: "typescript" });

    await fsPromises.writeFile(targetFilePath, formattedData);

    this.log(`Your types file has been generated at ${targetFilePath}`);
  }

  private async guardConfig(): Promise<UserConfig> {
    let config = await readUserConfig();

    if (!config.client_key) {
      config = await this.config.runCommand("env");
    }

    return config;
  }
}
