import { Command, Flags } from "@oclif/core";
import fsPromises from "node:fs/promises";
import { getHttpClient } from "../utils/http";

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

    // TODO: make token dynamic or remove it
    const { data } = await httpClient.get(
      "/sdk/ce81b569-2f81-4e4f-bef4-0896bcf06a2a/types"
    );

    const targetFilePath = `${flags.output}/${flags.name}`;

    console.log(
      "🚀 ~ file: types.ts:41 ~ Types ~ run ~ targetFilePath:",
      targetFilePath
    );

    await fsPromises.writeFile(targetFilePath, data);

    this.log(`Your types file has been generated at ${targetFilePath}`);
  }
}
