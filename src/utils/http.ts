import axios, { AxiosInstance } from "axios";
import { readConfig } from "./config";

/**
 * Return an axios instance that target the progressivly backend instance defined in config
 * @param withAuth should the access token be included
 */
export async function getHttpClient(
  withAuth?: boolean
): Promise<AxiosInstance> {
  let accessToken;

  if (withAuth) {
    const { access_token } = await readConfig();

    accessToken = access_token;
  }

  return axios.create({
    baseURL: "http://localhost:4000",
    headers: {
      Authorization: withAuth ? `Bearer ${accessToken}` : undefined,
    },
  });
}
