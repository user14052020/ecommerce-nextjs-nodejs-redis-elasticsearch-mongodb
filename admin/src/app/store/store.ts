import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import type { ThunkAction, ThunkMiddleware } from "redux-thunk";
import reducers from "@app/app/store/reducers";
import type { RootState } from "@app/app/store/reducers";
import type { AppActions } from "@app/app/store/types";

function configureStore(initialState: RootState | undefined = undefined) {
  const store = createStore(
    reducers,
    initialState,
    applyMiddleware(thunk as ThunkMiddleware<RootState, AppActions>)
  );

  return store;
}

export default configureStore;
export type AppDispatch = ReturnType<typeof configureStore>["dispatch"];
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AppActions
>;
export type { RootState };
