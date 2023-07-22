import { Config } from "./config";
import { getHttpClient } from "./http";

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<Pick<Config, "access_token" | "refresh_token">> {
  const httpClient = await getHttpClient();

  const {
    data: { access_token: accessToken },
    headers,
  } = await httpClient.post("/auth/login", {
    username: email,
    password,
  });

  const refreshTokenCookie = headers["set-cookie"]
    ?.find((cookie: string) => cookie.includes("refresh-token"))
    ?.split(";")
    .find((str: string) => str.includes("refresh-token"));

  const refreshTokenMatch = /refresh-token=(?<token>.*)/.exec(
    refreshTokenCookie || ""
  );

  const refreshToken = refreshTokenMatch?.groups?.token || "";

  return {
    access_token: accessToken,
    refresh_token: refreshToken,
  };
}
