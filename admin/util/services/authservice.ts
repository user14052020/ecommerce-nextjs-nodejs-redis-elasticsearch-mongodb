import { API_URL } from "@root/config";
import axios from "axios";
import type { LoginUser } from "@app/redux/types";

type AuthUser = LoginUser;

type AuthResponse = {
  isAuthenticated: boolean;
  user: AuthUser;
};

type RegisterResponse = {
  error?: unknown;
};

export default {
  login: (user: Record<string, unknown>): Promise<AuthResponse> => {
    return axios
      .post(`${API_URL}/users/login`, user)
      .then((res) => {
        return res.data as AuthResponse;
      })
      .catch(() => {
        return {
          isAuthenticated: false,
          user: { username: "", role: {}, id: "", name: "", image: "" },
        };
      });
  },

  register: (user: Record<string, unknown>): Promise<RegisterResponse> => {
    return axios
      .post(`${API_URL}/users/register`, user)
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
      .get(`${API_URL}/users/logout`)
      .then((res) => {
        return res.data as Record<string, unknown>;
      })
      .catch((err) => {
        return {
          error: err,
        };
      });
  },
  isAuthenticated: (): Promise<AuthResponse> => {
    return axios
      .get(`${API_URL}/users/authenticated`)
      .then((res) => {
        return res.data as AuthResponse;
      })
      .catch(() => {
        return {
          isAuthenticated: false,
          user: { username: "", role: {}, id: "", name: "", image: "" },
        };
      });
  },
};
