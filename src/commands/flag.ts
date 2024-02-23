import { confirm, select } from "@inquirer/prompts";
import { Command, Flags, ux } from "@oclif/core";

import { UserConfig, readUserConfig } from "../utils/config";
import * as flagUtils from "../utils/flag";
import { getHttpClient } from "../utils/http";

export default class Flag extends Command {
  static args = {};

  static description = "Manipulate flags";

  static examples = ["<%= config.bin %> <%= command.id %>"];

  static flags = {
    create: Flags.boolean({
      char: "C",
      description: "Create a flag and update existing",
    }),
    "create-only": Flags.boolean({
      description: "Only create a flag",
    }),
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(Flag);

    const config = await this.guardConfig();
    const httpClient = await getHttpClient(true);

    if (flags.create || flags["create-only"]) {
      try {
        await flagUtils.createFlag();

        this.log("Flag created");
      } catch (error) {
        this.error(error as Error);
      }

      if (flags["create-only"]) {
        return;
      }
    }

    const { data: featureFlags } = await httpClient.get(
      `/projects/${config.project_id}/flags`,
    );

    const localFlags = featureFlags.map((featureFlag: any) => {
      return {
        name: featureFlag.name,
        status: featureFlag.status,
        value: featureFlag.uuid,
      };
    });

    const selectedFlagId = await select({
      choices: localFlags.map((localFlag: any) => ({
        ...localFlag,
        name: `${localFlag.name} (actual status ${localFlag.status})`,
      })),
      message: "Which feature flag do you want to update",
    });

    const selectedFlag = localFlags.find(
      (featureFlag: any) => featureFlag.value === selectedFlagId,
    );

    const nextStatus =
      selectedFlag.status === "ACTIVATED" ? "NOT_ACTIVATED" : "ACTIVATED";

    await confirm({
      message: `Do you want to update ${selectedFlag.name} to ${nextStatus}?`,
    });

    ux.action.start("Switching status...");
    await httpClient.put(`/flags/${selectedFlagId}`, {
      status: nextStatus,
    });
    ux.action.stop();

    this.log(`The flag has been successfully`);
  }

  private async guardConfig(): Promise<UserConfig> {
    let config = await readUserConfig();

    if (!config.secret_key) {
      config = await this.config.runCommand("project");
    }

    return config;
  }
}
