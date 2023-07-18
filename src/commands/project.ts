import { Command, Flags, ux } from "@oclif/core";
import { select, confirm } from "@inquirer/prompts";
import { updateConfig } from "../utils/config";
import { getHttpClient } from "../utils/http";

export default class Project extends Command {
  static description = "describe the command here";

  static examples = ["<%= config.bin %> <%= command.id %>"];

  static flags = {
    create: Flags.boolean({
      char: "C",
      description: "Create a project before selection",
    }),
  };

  static args = {};

  public async run(): Promise<void> {
    const { flags } = await this.parse(Project);

    const httpClient = await getHttpClient(true);

    const { data: projects } = await httpClient.get("/projects");

    if (projects.length === 0 || flags.create) {
      if (projects.length === 0) {
        const shouldCreateProject = await confirm({
          message:
            "We couldn't find any project, do you want to create one now?",
        });

        if (shouldCreateProject === false) {
          this.log(
            "You skipped project creation, you can still do this later or with web interface"
          );

          return;
        }
      }

      const projectName = await ux.prompt("What is the name of your project?");
      const httpClient = await getHttpClient(true);

      const { data: newProject } = await httpClient.post("/projects", {
        name: projectName,
      });

      projects.push({ project: newProject });
    }

    const choices = projects.map(({ project }: any) => ({
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

      const selectedProject = projects.find(
        (project: any) => project.projectId === projectId
      );

      this.log(`Current project : ${selectedProject.project.name}`);
    }
  }
}
