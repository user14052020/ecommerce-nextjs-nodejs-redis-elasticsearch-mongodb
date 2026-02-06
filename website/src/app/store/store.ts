import thunk, { ThunkMiddleware } from "redux-thunk";
import { createStore, applyMiddleware } from "redux";
import type { ThunkAction, ThunkDispatch } from "redux-thunk";
import type { Action } from "redux";
import rootReducer from "@app/app/store/reducers/index";
import type { RootState } from "@app/app/store/reducers/index";
import { HYDRATE, createWrapper } from "next-redux-wrapper";
import type { AppActions } from "@app/app/store/types";

const bindMiddleware = (
  middleware: ThunkMiddleware<RootState, AppActions>[],
) => {
  if (process.env.NODE_ENV == "development") {
    const { composeWithDevTools } = require("redux-devtools-extension");
    return composeWithDevTools(applyMiddleware(...middleware));
  }
  return applyMiddleware(...middleware);
};
type HydrateAction = Action<typeof HYDRATE> & { payload: RootState };

const reducer = (
  state: RootState | undefined,
  action: AppActions | HydrateAction,
) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state,
      ...action.payload,
    };

    return nextState;
  } else {
    return rootReducer(state, action as AppActions);
  }
};

const initStore = () => {
  return createStore(
    reducer,
    bindMiddleware([thunk as ThunkMiddleware<RootState, AppActions>]),
  );
};

export const wrapper = createWrapper(initStore);
export type AppDispatch = ThunkDispatch<RootState, unknown, AppActions>;
export type { RootState };
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AppActions
>;
