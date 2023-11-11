import axios, { AxiosInstance } from "axios";

import { readUserConfig } from "./config";

/**
 * Return an axios instance that target the progressivly backend instance defined in config
 * @param withAuth should the access token be included
 */
export async function getHttpClient(
  withAuth?: boolean,
): Promise<AxiosInstance> {
  const { access_token: accessToken, base_url: baseUrl } =
    await readUserConfig();

  return axios.create({
    baseURL: baseUrl,
    headers: {
      Authorization: withAuth ? `Bearer ${accessToken}` : undefined,
    },
  });
}
