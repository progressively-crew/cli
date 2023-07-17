import { Command, ux } from "@oclif/core";
import { readConfig, updateConfig } from "../utils/config";

export default class Config extends Command {
  static description = "Configure the Progressively CLI";

  static examples = ["<%= config.bin %> <%= command.id %>"];

  static flags = {};

  static args = {};

  public async run(): Promise<void> {
    this.log("You'll start the configuration of the Progressively CLI");

    const config = await readConfig();

    const baseUrl = await ux.prompt(
      "What is URL of your Progressively instance?",
      { default: config.base_url }
    );

    await updateConfig({
      base_url: baseUrl,
    });

    await this.config.runCommand("login");

    await this.config.runCommand("project");
  }
}
