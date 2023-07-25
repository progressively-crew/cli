import { Hook } from "@oclif/core";
import { refreshAccessToken } from "../../utils/auth";
import { updateConfig } from "../../utils/config";

const hook: Hook<"init"> = async function (opts) {
  if (opts.id === "login") return;

  try {
    const { access_token, refresh_token } = await refreshAccessToken();

    await updateConfig({
      access_token,
      refresh_token,
    });
  } catch {
    this.log("We couldn't authenticate you. Please execute the login command");
  }
};

export default hook;
