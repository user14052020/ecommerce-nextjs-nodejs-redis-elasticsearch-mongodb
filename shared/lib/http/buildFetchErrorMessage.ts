import axios from "axios";

export const buildFetchErrorMessage = (error: unknown, apiUrl: string) => {
  const message = error instanceof Error ? error.message : "Unknown error";

  if (axios.isAxiosError(error) && error.config?.url) {
    return `${message}: ${error.config.url.replace(apiUrl, "api")}`;
  }

  return message;
};
