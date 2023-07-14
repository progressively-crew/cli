import { Args, Command, Flags } from "@oclif/core";
import axios from "axios";
import { readConfig } from "../utils/config";

export default class Project extends Command {
  static description = "describe the command here";

  static examples = ["<%= config.bin %> <%= command.id %>"];

  static flags = {
    // flag with a value (-n, --name=VALUE)
    name: Flags.string({ char: "n", description: "name to print" }),
    // flag with no value (-f, --force)
    force: Flags.boolean({ char: "f" }),
  };

  static args = {
    file: Args.string({ description: "file to read" }),
  };

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Project);

    const config = await readConfig();

    const { data } = await axios.get("http://localhost:4000/projects", {
      headers: {
        Authorization: `Bearer ${config.access_token}`,
      },
    });

    for (const { project } of data) {
      console.log(project.name);
    }
  }
}
