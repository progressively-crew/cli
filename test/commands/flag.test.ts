import { expect, test } from "@oclif/test";

describe("flag", () => {
  test
    .stdout()
    .command(["flag"])
    .it("runs hello", (ctx) => {
      expect(ctx.stdout).to.contain("hello world");
    });

  test
    .stdout()
    .command(["flag", "--name", "jeff"])
    .it("runs hello --name jeff", (ctx) => {
      expect(ctx.stdout).to.contain("hello jeff");
    });
});
