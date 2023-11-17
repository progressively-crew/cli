import { expect, test } from "@oclif/test";

import * as configUtils from "../../src/utils/config";

describe("me", () => {
  test
    .stub(configUtils, "readUserConfig", () => ({
      access_token: "yo",
      base_url: "https://api.progressively.app",
    }))
    .nock("https://api.progressively.app", (api) =>
      api
        .get("/users/me")
        .reply(200, { email: "jean@smaug.fr", fullname: "Jean Smaug" }),
    )
    .stdout()
    .command(["me"])
    .it("should display user's informations", (ctx) => {
      expect(ctx.stdout).to.contain(`Jean Smaug`);
      expect(ctx.stdout).to.contain(`jean@smaug.fr`);
    });
});
