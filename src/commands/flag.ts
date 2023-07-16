import { Args, Command, Flags } from "@oclif/core";
import { select } from "@inquirer/prompts";
import { readConfig } from "../utils/config";
import axios from "axios";

export default class Flag extends Command {
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
    const config = await readConfig();

    const { data: flags } = await axios.get(
      `http://localhost:4000/projects/${config.project_id}/flags`,
      {
        headers: {
          Authorization: `Bearer ${config.access_token}`,
        },
      }
    );

    const choices = flags.map((flag: any) => ({
      name: flag.name,
      value: flag.uuid,
      description: flag.description,
    }));

    const flagId = await select({
      message: "Which flag do you want to update ?",
      choices,
    });

    const { data: flag } = await axios.get(
      `http://localhost:4000/flags/${flagId}`,
      {
        headers: {
          Authorization: `Bearer ${config.access_token}`,
        },
      }
    );

    const environmentChoices = flag.flagEnvironment.map((flagEnv: any) => ({
      name: flagEnv.environmentId,
      value: flagEnv.environmentId,
    }));

    const environmentId = await select({
      message: "Which env do you want to update?",
      choices: environmentChoices,
    });

    const { data } = await axios.put(
      `http://localhost:4000/environments/${environmentId}/flags/${flagId}`,
      {
        status: "ACTIVATED",
      },
      {
        headers: {
          Authorization: `Bearer ${config.access_token}`,
        },
      }
    );
    console.log("🚀 ~ file: flag.ts:75 ~ Flag ~ run ~ response:", data);
  }
}
