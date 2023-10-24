import * as prompts from "@inquirer/prompts";
import { expect, test } from "@oclif/test";
import Sinon from "sinon";

import * as configUtils from "../../src/utils/config";

const MOCK_PROJECT_ID = "mock-project-id";

describe("flag", () => {
  test
    .stub(configUtils, "readConfig", () => ({
      base_url: "https://api.progressively.app",
      project_id: MOCK_PROJECT_ID,
    }))
    .stub(
      prompts,
      "input",
      Sinon.stub()
        .onCall(0)
        .returns("background")
        .onCall(1)
        .returns("Update the background color of the home page"),
    )
    .nock("https://api.progressively.app", (api) => {
      api.post(`/projects/${MOCK_PROJECT_ID}/flags`).reply(201);
      api.get("/auth/refresh").reply(200);
    })
    .stdout()
    .command(["flag", "--create-only"])
    .it("should only create a flag", (ctx) => {
      expect(ctx.stdout).to.contain("Flag created");
    });
});
