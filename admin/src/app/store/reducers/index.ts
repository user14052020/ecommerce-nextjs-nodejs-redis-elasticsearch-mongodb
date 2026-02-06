import { combineReducers } from "redux";
import Settings from "@app/features/settings/model/reducer";
import Login from "@app/features/auth/model/reducer";

const reducers = combineReducers({
  settings: Settings,
  login: Login,
});

export default reducers;
export type RootState = ReturnType<typeof reducers>;
