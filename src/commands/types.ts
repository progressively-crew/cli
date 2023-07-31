import { Command, Flags } from "@oclif/core";
import fsPromises from "node:fs/promises";
import { getHttpClient } from "../utils/http";
import { readConfig } from "../utils/config";

export default class Types extends Command {
  static description = "Generate types based on your Progressively instance";

  static examples = ["<%= config.bin %> <%= command.id %>"];

  static flags = {
    name: Flags.string({
      required: false,
      default: "progressively.d.ts",
      char: "N",
      description: "Name of the generated types file",
    }),
    output: Flags.string({
      required: false,
      default: process.cwd(),
      char: "O",
      description:
        "Relative path of the folder where the types file should be generated",
    }),
  };

  static args = {};

  public async run(): Promise<void> {
    const { flags } = await this.parse(Types);

    const httpClient = await getHttpClient(true);
    const { client_key } = await readConfig();

    const { data } = await httpClient.get(`/sdk/${client_key}/types/gen`);

    const targetFilePath = `${flags.output}/${flags.name}`;

    await fsPromises.writeFile(targetFilePath, data);

    this.log(`Your types file has been generated at ${targetFilePath}`);
  }
}
