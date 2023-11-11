import { Command, ux } from "@oclif/core";
import { readProjectConfig } from "../utils/config";
import { getHttpClient } from "../utils/http";
import _ from "lodash";

export default class Push extends Command {
  static description = "Apply the current config to the remote server";

  static examples = ["<%= config.bin %> <%= command.id %>"];

  static flags = {};

  static args = {};

  public async run(): Promise<void> {
    // const { flags } = await this.parse(Push);

    ux.action.start("Synchronization");

    const projectConfig = await readProjectConfig();
    const httpClient = await getHttpClient(true);

    const { data: featureFlags } = await httpClient.get(
      `/projects/${projectConfig.projectId}/flags`,
    );

    const unpushedFeatureFlags = _.differenceBy(
      projectConfig.flags,
      featureFlags,
      "name",
    );

    for (const flag of unpushedFeatureFlags) {
      httpClient.post(`/projects/${projectConfig.projectId}/flags`, {
        name: flag.name,
        description: flag.description,
      });
    }

    /**
     * Variants
     */

    for (const flag of projectConfig.flags) {
      if (flag.variants) {
        const foundFeatureFlag = featureFlags.find(
          (featureFlag: any) => featureFlag.name === flag.name,
        );

        // NOTE: missing different environments
        if (Array.isArray(flag.variants) && foundFeatureFlag) {
          for (const variant of flag.variants) {
            for (const flagEnvironment of foundFeatureFlag.flagEnvironment) {
              httpClient.post(
                `/environments/${flagEnvironment.environmentId}/flags/${foundFeatureFlag.uuid}/variants`,
                {
                  value: variant,
                  rolloutPercentage: 0,
                },
              );
            }
          }
        }
      }
    }

    ux.action.stop();
  }
}
