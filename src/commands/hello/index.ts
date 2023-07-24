import { Command } from "@oclif/core";
import { refreshAccessToken } from "../../utils/auth";

export default class Hello extends Command {
  static description = "Say hello";

  static examples = [
    `$ oex hello friend --from oclif
hello friend from oclif! (./src/commands/hello/index.ts)
`,
  ];

  static flags = {};

  static args = {};

  async run(): Promise<void> {
    await refreshAccessToken();
  }
}
