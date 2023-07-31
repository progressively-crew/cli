import { expect, test } from "@oclif/test";

describe("me", () => {
  test
    .stdout()
    .command(["me"])
    .it("runs hello", (ctx) => {
      expect(ctx.stdout).to.contain("hello world");
    });

  test
    .stdout()
    .command(["me", "--name", "jeff"])
    .it("runs hello --name jeff", (ctx) => {
      expect(ctx.stdout).to.contain("hello jeff");
    });
});
