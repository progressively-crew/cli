import { Command, Flags } from "@oclif/core";
import { color } from "@oclif/color";
import { select, confirm, input } from "@inquirer/prompts";
import { updateConfig } from "../utils/config";
import { getHttpClient } from "../utils/http";

export default class Project extends Command {
  static description = "describe the command here";

  static examples = ["<%= config.bin %> <%= command.id %>"];

  static flags = {
    delete: Flags.boolean({
      char: "D",
      description: "Delete a project",
    }),
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

    if (projects.length > 0 && flags.delete) {
      const projectId = await select({
        message: "Which project do you want to delete",
        choices: projects.map(({ project }: any) => ({
          name: project.name,
          value: project.uuid,
        })),
      });

      try {
        const { data: project } = await httpClient.delete(
          `/projects/${projectId}`,
        );

        this.log(`${color.bold(project.name)} project has been deleted`);
      } catch (error) {
        this.error(error as Error);
      }

      return;
    }

    if (projects.length === 0 || flags.create) {
      if (projects.length === 0) {
        const shouldCreateProject = await confirm({
          message:
            "We couldn't find any project, do you want to create one now?",
        });

        if (shouldCreateProject === false) {
          this.log(
            "You skipped project creation, you can still do this later or with web interface",
          );

          return;
        }
      }

      const projectName = await input({
        message: "What is the name of your project",
      });
      const httpClient = await getHttpClient(true);

      const { data: newProject } = await httpClient.post("/projects", {
        name: projectName,
      });

      projects.push({ project: newProject });
    }

    if (projects.length === 0) {
      this.log(
        // TODO: make command suggestion dynamic
        `You must create a project before being able to select one. You can run ${color.bold(
          "progressively project --create",
        )}`,
      );
      return;
    }

    const choices = projects.map(({ project }: any) => ({
      name: project.name,
      value: project.uuid,
    }));

    const projectId: string =
      choices.length === 1
        ? choices[0].value
        : await select({
            message: "Which project do you want to manage",
            choices,
          });

    if (projectId) {
      updateConfig({
        project_id: projectId,
      });

      const selectedProject = projects.find(
        ({ project }: any) => project.uuid === projectId,
      );

      this.log(`Current project : ${selectedProject.project.name}`);
    }
  }
}
