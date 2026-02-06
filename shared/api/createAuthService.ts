import axios from "axios";

export type AuthResponse<TUser> = {
  isAuthenticated: boolean;
  user: TUser;
};

export type RegisterResponse = {
  error?: unknown;
  messagge?: string;
};

export type AuthServiceConfig<TUser> = {
  apiUrl: string;
  loginPath: string;
  authenticatedPath: string;
  registerPath?: string;
  logoutPath?: string;
  emptyUser: TUser;
};

export const createAuthService = <TUser extends Record<string, unknown>>(
  config: AuthServiceConfig<TUser>
) => {
  const {
    apiUrl,
    loginPath,
    authenticatedPath,
    registerPath = "/users/register",
    logoutPath = "/users/logout",
    emptyUser,
  } = config;

  return {
    login: (user: Record<string, unknown>): Promise<AuthResponse<TUser>> => {
      return axios
        .post(`${apiUrl}${loginPath}`, user)
        .then((res) => {
          return res.data as AuthResponse<TUser>;
        })
        .catch(() => {
          return {
            isAuthenticated: false,
            user: emptyUser,
          };
        });
    },

    register: (user: Record<string, unknown>): Promise<RegisterResponse> => {
      return axios
        .post(`${apiUrl}${registerPath}`, user)
        .then((res) => {
          return res.data as RegisterResponse;
        })
        .catch((err) => {
          return {
            error: err,
          };
        });
    },

    logout: (): Promise<Record<string, unknown>> => {
      return axios
        .get(`${apiUrl}${logoutPath}`)
        .then((res) => {
          return res.data as Record<string, unknown>;
        })
        .catch((err) => {
          return {
            error: err,
          };
        });
    },

    isAuthenticated: (): Promise<AuthResponse<TUser>> => {
      return axios
        .get(`${apiUrl}${authenticatedPath}`)
        .then((res) => {
          return res.data as AuthResponse<TUser>;
        })
        .catch(() => {
          return {
            isAuthenticated: false,
            user: emptyUser,
          };
        });
    },
  };
};
