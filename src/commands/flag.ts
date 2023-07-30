import { Command, Flags } from "@oclif/core";
import _ from "lodash";
import { confirm, select } from "@inquirer/prompts";
import { readConfig } from "../utils/config";
import { getHttpClient } from "../utils/http";
import * as flagUtils from "../utils/flag";

export default class Flag extends Command {
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

  static args = {};

  public async run(): Promise<void> {
    const { flags } = await this.parse(Flag);

    const config = await readConfig();
    const httpClient = await getHttpClient(true);

    if (flags.create || flags["create-only"]) {
      try {
        await flagUtils.createFlag();
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

    const environmentsById = _.keyBy(environments, "uuid");

    const selectedFlagId = await select({
      message: "Which feature flag do you want to update",
      choices: featureFlags.map((featureFlag: any) => ({
        name: featureFlag.name,
        value: featureFlag.uuid,
        description: featureFlag.description,
      })),
    });

    const selectedFlag = featureFlags.find(
      (featureFlag: any) => featureFlag.uuid === selectedFlagId
    );

    for (const flagEnvironment of selectedFlag.flagEnvironment) {
      const envrionment = environmentsById[flagEnvironment.environmentId];

      const switchStatus = {
        ACTIVATED: "NOT_ACTIVATED",
        NOT_ACTIVATED: "ACTIVATED",
      };

      this.log(
        `\nThe flag ${selectedFlag.name} is currently ${flagEnvironment.status} in ${envrionment.name}`
      );

      const switchedStatus =
        switchStatus[flagEnvironment.status as "ACTIVATED" | "NOT_ACTIVATED"];

      // eslint-disable-next-line no-await-in-loop
      await confirm({
        message: `Do you want to set it to ${switchedStatus}`,
      });

      // eslint-disable-next-line no-await-in-loop
      await httpClient.put(
        `/environments/${flagEnvironment.environmentId}/flags/${selectedFlagId}`,
        {
          status: switchedStatus,
        }
      );

      this.log(
        `The flag ${selectedFlag.name} has been updated to ${switchedStatus} in ${envrionment.name}`
      );
    }
  }
}
