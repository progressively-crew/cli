import { Command } from "@oclif/core";
import fsPromises from "node:fs/promises";
import { getHttpClient } from "../utils/http";

export default class Types extends Command {
  static description = "describe the command here";

  static examples = ["<%= config.bin %> <%= command.id %>"];

  static flags = {};

  static args = {};

  public async run(): Promise<void> {
    const httpClient = await getHttpClient(true);

    // TODO: make token dynamic or remove it
    const { data } = await httpClient.get(
      "/sdk/ed2d06f3-cb98-417c-9475-e9eec152310b/types"
    );

    // TODO: find a name for the generated types file
    // and add it to gitignore.
    const targetFilePath = `${process.cwd()}/progressivelyTypes.ts`;

    await fsPromises.writeFile(targetFilePath, data);

    this.log(`Your types file has been generated at ${targetFilePath}`);
  }
}
