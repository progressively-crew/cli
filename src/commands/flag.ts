import { Command, Flags } from "@oclif/core";
import { input, select } from "@inquirer/prompts";
import { readConfig } from "../utils/config";
import { getHttpClient } from "../utils/http";

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
      const name = await input({ message: "What is the name of the flag" });
      const description = await input({
        message: "What is the description of the flag",
      });

      try {
        await httpClient.post(`/projects/${config.project_id}/flags`, {
          name,
          description,
        });
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

    const choices = featureFlags.map((flag: any) => ({
      name: flag.name,
      value: flag.uuid,
      description: flag.description,
    }));

    const flagId = await select({
      message: "Which flag do you want to update ?",
      choices,
    });

    const { data: flag } = await httpClient.get(`/flags/${flagId}`);

    const environmentChoices = flag.flagEnvironment.map((flagEnv: any) => ({
      name: flagEnv.environmentId,
      value: flagEnv.environmentId,
    }));

    const environmentId = await select({
      message: "Which env do you want to update?",
      choices: environmentChoices,
    });

    const { data } = await httpClient.put(
      `/environments/${environmentId}/flags/${flagId}`,
      {
        status: "ACTIVATED",
      }
    );

    console.log("🚀 ~ file: flag.ts:75 ~ Flag ~ run ~ response:", data);
  }
}
