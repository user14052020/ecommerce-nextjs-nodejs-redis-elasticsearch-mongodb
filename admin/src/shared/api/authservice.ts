import { API_URL } from "@root/config";
import type { LoginUser } from "@app/app/store/types";
import { createAuthService } from "@root/shared/api/createAuthService";

const emptyUser: LoginUser = {
  username: "",
  role: {},
  id: "",
  name: "",
  image: "",
};

export default createAuthService<LoginUser>({
  apiUrl: API_URL,
  loginPath: "/users/login",
  authenticatedPath: "/users/authenticated",
  emptyUser,
});
