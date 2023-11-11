import { Args, Command, Flags, ux } from "@oclif/core";
import { lilconfig } from "lilconfig";
import { readProjectConfig } from "../utils/config";

export default class Push extends Command {
  static description = "Apply the current config to the remote server";

  static examples = ["<%= config.bin %> <%= command.id %>"];

  static flags = {};

  static args = {};

  public async run(): Promise<void> {
    const { flags } = await this.parse(Push);

    ux.action.start("Synchronization");

    console.log(await readProjectConfig());

    ux.action.stop();

    const name = flags.name ?? "world";
    this.log(
      `hello ${name} from /Users/maximeblanc/Localdev/progressively-cli/src/commands/push.ts`,
    );
  }
}
