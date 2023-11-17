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

    const [{ data: featureFlags }, { data: environments }] = await Promise.all([
      httpClient.get(`/projects/${config.project_id}/flags`),
      httpClient.get(`/projects/${config.project_id}/environments`),
    ]);

    const currentEnv = environments.find(
      (env: any) => env.clientKey === config.client_key,
    );

    this.log(
      `You are about to modify feature flags status on ${currentEnv.name.toUpperCase()}`,
    );

    const localFlags = featureFlags.map((featureFlag: any) => {
      const flagEnv = featureFlag.flagEnvironment.find(
        (flagEnv: any) => flagEnv.environmentId === currentEnv.uuid,
      );

      return {
        name: featureFlag.name,
        status: flagEnv.status,
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
      message: `Do you want to update ${selectedFlag.name} on ${currentEnv.name} to ${nextStatus}?`,
    });

    ux.action.start("Switching status...");
    await httpClient.put(
      `/environments/${currentEnv.uuid}/flags/${selectedFlagId}`,
      {
        status: nextStatus,
      },
    );
    ux.action.stop();

    this.log(`The flag has been successfully`);
  }

  private async guardConfig(): Promise<UserConfig> {
    let config = await readUserConfig();

    if (!config.client_key) {
      config = await this.config.runCommand("env");
    }

    return config;
  }
}
