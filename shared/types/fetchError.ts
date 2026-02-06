export const GET_ALL_FETCH_FAIL = "GET_ALL_FETCH_FAIL" as const;

export type GetAllFetchFailAction = {
  type: typeof GET_ALL_FETCH_FAIL;
  payload: string;
};
