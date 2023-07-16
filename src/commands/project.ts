import { Args, Command, Flags } from "@oclif/core";
import { select } from "@inquirer/prompts";
import { updateConfig } from "../utils/config";
import { getHttpClient } from "../utils/http";

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
    // const { args, flags } = await this.parse(Project);

    const httpClient = await getHttpClient(true);

    const { data } = await httpClient.get("/projects");

    const choices = data.map(({ project }: any) => ({
      name: project.name,
      value: project.uuid,
    }));

    const projectId: string = await select({
      message: "Which project do you want to update",
      choices: choices,
    });

    if (projectId) {
      updateConfig({
        project_id: projectId,
      });

      this.log(`Le projet a été mis a jour`);
    }
  }
}
