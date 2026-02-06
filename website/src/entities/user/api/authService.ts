import { API_URL } from "@root/config";
import { createAuthService } from "@root/shared/api/createAuthService";
import type { LoginUser } from "@app/entities/user/model/types";

const emptyUser: LoginUser = {
  username: "",
  role: {},
  id: "",
  name: "",
  image: "",
  phone: "",
};

export default createAuthService<LoginUser>({
  apiUrl: API_URL,
  loginPath: "/users/loginuser",
  authenticatedPath: "/users/authenticateduser",
  emptyUser,
});
