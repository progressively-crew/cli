import { expect, test } from "@oclif/test";

describe("me", () => {
  test
    .nock("https://api.progressively.app", (api) =>
      api
        .get("/users/me")
        .reply(200, { email: "jean@smaug.fr", fullname: "Jean Smaug" }),
    )
    .stdout()
    .command(["me"])
    .it("should display user's informations", (ctx) => {
      expect(ctx.stdout).to.contain(`
Full name : Jean Smaug
Email     : jean@smaug.fr
`);
    });
});
