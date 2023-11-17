import { input } from "@inquirer/prompts";
import color from "@oclif/color";
import { Command, Flags } from "@oclif/core";

import { UserConfig, readUserConfig, updateUserConfig } from "../utils/config";

export default class Config extends Command {
  static args = {};

  static description = "Configure the Progressively CLI";

  static examples = ["<%= config.bin %> <%= command.id %>"];

  static flags = {
    show: Flags.boolean({
      description: "Display the current configuration for the user",
    }),
  };

  public async run(): Promise<UserConfig | undefined> {
    const { flags } = await this.parse(Config);
    const config = await readUserConfig();

    if (flags.show) {
      this.log(
        `
${color.bold("Email")} : ${color.green(config.email)}
${color.bold("Backend URL")} : ${color.green(config.base_url)}
${color.bold("Client key")} : ${color.green(config.client_key)}
        `.trim(),
      );

      return;
    }

    this.log("You'll start the configuration of the Progressively CLI");

    const baseUrl = await input({
      default: config.base_url,
      message: "What is URL of your Progressively instance",
    });

    return updateUserConfig({
      base_url: baseUrl,
    });
  }
}
