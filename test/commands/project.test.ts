import { expect, test } from "@oclif/test";
import * as prompts from "@inquirer/prompts";
// import * as configUtils from "../../src/utils/config";
// import Sinon from "sinon";

// const configUtilsMock = Sinon.mock(configUtils);

describe("project", () => {
  test
    .stdout()
    .stub(prompts, "confirm", () => false)
    .nock("https://api.progressively.app", (api) => {
      api.get("/projects").reply(200, []);
    })
    .command(["project", "--create"])
    .it("should skip project creation", (ctx) => {
      expect(ctx.stdout).to.contain(
        "You skipped project creation, you can still do this later or with web interface",
      );
    });
});
