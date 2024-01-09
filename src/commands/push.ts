import { Command, ux } from "@oclif/core";
import _ from "lodash";

import { readProjectConfig } from "../utils/config";
import { getHttpClient } from "../utils/http";

export default class Push extends Command {
  static args = {};

  static description = "Apply the current config to the remote server";

  static examples = ["<%= config.bin %> <%= command.id %>"];

  static flags = {};

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
        description: flag.description,
        name: flag.name,
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
                  rolloutPercentage: 0,
                  value: variant,
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
