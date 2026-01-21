import { combineReducers } from "redux";
import Settings from "@app/redux/reducers/Settings";
import Login from "@app/redux/reducers/Login";

const reducers = combineReducers({
  settings: Settings,
  login: Login,
});

export default reducers;
export type RootState = ReturnType<typeof reducers>;
